import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { Ionicons } from '@expo/vector-icons';
import { Delivery, Coordinates, RouteStep } from '../types';
import { LocationService } from '../services/location';
import { RouteOptimizer } from '../utils/routeOptimizer';

// Chave da API do Google Maps
const GOOGLE_MAPS_API_KEY = 'AIzaSyDcGIckl95JWpjI0lix-pan3mqsikSDLmc';
const HAS_GOOGLE_MAPS_KEY = true; // Agora temos a chave configurada

interface DeliveryMapProps {
  deliveries: Delivery[];
  onDeliveryPress: (delivery: Delivery) => void;
  onNavigateToDelivery: (delivery: Delivery) => void;
  currentLocation?: Coordinates;
}

export const DeliveryMap: React.FC<DeliveryMapProps> = ({
  deliveries,
  onDeliveryPress,
  onNavigateToDelivery,
  currentLocation,
}) => {
  const mapRef = useRef<MapView>(null);
  const [userLocation, setUserLocation] = useState<Coordinates | null>(currentLocation || null);
  const [optimizedRoute, setOptimizedRoute] = useState<RouteStep[]>([]);
  const [showRoute, setShowRoute] = useState(true);
  const [showFullRoute, setShowFullRoute] = useState(true); // Nova opção para rota completa
  const [isLoadingLocation, setIsLoadingLocation] = useState(!currentLocation);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);

  useEffect(() => {
    if (!currentLocation) {
      getCurrentLocation();
    }
    startLocationTracking();

    return () => {
      LocationService.stopLocationTracking();
    };
  }, []);

  useEffect(() => {
    if (userLocation && deliveries.length > 0) {
      optimizeRoute();
    }
  }, [userLocation, deliveries]);

  const getCurrentLocation = async () => {
    setIsLoadingLocation(true);
    try {
      const location = await LocationService.getCurrentLocation();
      if (location) {
        setUserLocation(location);
      } else {
        Alert.alert(
          'Localização',
          'Não foi possível obter sua localização. Verifique as permissões.'
        );
      }
    } catch (error) {
      console.error('Erro ao obter localização:', error);
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const startLocationTracking = async () => {
    await LocationService.startLocationTracking(
      (location) => {
        setUserLocation(location);
      },
      (error) => {
        console.error('Erro no tracking:', error);
      }
    );
  };

  const optimizeRoute = () => {
    if (!userLocation) return;

    const pendingDeliveries = deliveries.filter(
      d => d.status === 'pending' || d.status === 'in_progress'
    );

    const route = RouteOptimizer.optimizeRoute(pendingDeliveries, userLocation);
    setOptimizedRoute(route);
  };

  const centerMapOnUser = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  };

  const centerMapOnRoute = () => {
    if (deliveries.length > 0 && mapRef.current) {
      const coordinates = deliveries.map(d => ({
        latitude: d.latitude,
        longitude: d.longitude,
      }));

      if (userLocation) {
        coordinates.push(userLocation);
      }

      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }
  };

  const getMarkerColor = (delivery: Delivery): string => {
    switch (delivery.status) {
      case 'pending':
        return delivery.priority === 'high' ? '#ff4444' : '#ffa500';
      case 'in_progress':
        return '#007AFF';
      case 'delivered':
        return '#4CAF50';
      case 'failed':
        return '#9E9E9E';
      default:
        return '#ffa500';
    }
  };

  const handleMarkerPress = (delivery: Delivery) => {
    setSelectedDelivery(delivery);
    onDeliveryPress(delivery);
  };

  const renderDeliveryMarkers = () => {
    return deliveries.map((delivery, index) => (
      <Marker
        key={delivery.id}
        coordinate={{
          latitude: delivery.latitude,
          longitude: delivery.longitude,
        }}
        title={delivery.customerName}
        description={delivery.address}
        pinColor={getMarkerColor(delivery)}
        onPress={() => handleMarkerPress(delivery)}
      >
        <View style={[styles.markerContainer, { borderColor: getMarkerColor(delivery) }]}>
          <Text style={styles.markerText}>{index + 1}</Text>
          {delivery.priority === 'high' && (
            <View style={styles.priorityIndicator}>
              <Ionicons name="warning" size={12} color="#fff" />
            </View>
          )}
        </View>
      </Marker>
    ));
  };

  const renderRoutePolyline = () => {
    // Mostrar polyline simples quando não tiver Google Maps API Key
    if (HAS_GOOGLE_MAPS_KEY) return null;
    if (!showRoute || optimizedRoute.length === 0 || !userLocation) return null;

    const coordinates = [
      userLocation,
      ...optimizedRoute
        .filter(step => step.delivery.status === 'pending' || step.delivery.status === 'in_progress')
        .map(step => ({
          latitude: step.delivery.latitude,
          longitude: step.delivery.longitude,
        })),
    ];

    if (coordinates.length < 2) return null;

    return (
      <>
        {/* Rota completa em linha reta */}
        <Polyline
          coordinates={coordinates}
          strokeColor="#007AFF"
          strokeWidth={3}
          strokePattern={[10, 5]}
          lineCap="round"
          lineJoin="round"
        />
        
        {/* Destacar próxima entrega */}
        {!showFullRoute && coordinates.length >= 2 && (
          <Polyline
            coordinates={[coordinates[0], coordinates[1]]}
            strokeColor="#FF6B35"
            strokeWidth={5}
            lineCap="round"
            lineJoin="round"
          />
        )}
      </>
    );
  };

  const renderDirections = () => {
    if (!showRoute || optimizedRoute.length === 0 || !userLocation) return null;

    // Se não tiver a chave do Google Maps, não renderizar
    if (!HAS_GOOGLE_MAPS_KEY) {
      return null;
    }

    // Criar waypoints para a rota completa
    const pendingDeliveries = optimizedRoute.filter(
      step => step.delivery.status === 'pending' || step.delivery.status === 'in_progress'
    );

    if (pendingDeliveries.length === 0) return null;

    // Preparar waypoints (destinos intermediários)
    const waypoints = pendingDeliveries.slice(0, -1).map(step => ({
      latitude: step.delivery.latitude,
      longitude: step.delivery.longitude,
    }));

    // Destino final
    const destination = {
      latitude: pendingDeliveries[pendingDeliveries.length - 1].delivery.latitude,
      longitude: pendingDeliveries[pendingDeliveries.length - 1].delivery.longitude,
    };

    return (
      <MapViewDirections
        origin={userLocation}
        destination={destination}
        waypoints={waypoints}
        apikey={GOOGLE_MAPS_API_KEY}
        strokeWidth={4}
        strokeColor="#007AFF"
        strokeColors={['#007AFF']} // Cor consistente para toda a rota
        optimizeWaypoints={true}
        precision="high"
        timePrecision="now"
        mode="DRIVING"
        language="pt-BR"
        region="BR"
        onStart={(params) => {
          console.log('Calculando rota:', params);
        }}
        onReady={(result) => {
          console.log('Rota calculada:', {
            distance: result.distance,
            duration: result.duration,
            coordinates: result.coordinates.length
          });
          
          // Ajustar o mapa para mostrar toda a rota
          if (mapRef.current && result.coordinates.length > 0) {
            mapRef.current.fitToCoordinates(result.coordinates, {
              edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
              animated: true,
            });
          }
        }}
        onError={(errorMessage) => {
          console.error('Erro ao calcular rota:', errorMessage);
        }}
        resetOnChange={false}
        lineCap="round"
        lineJoin="round"
      />
    );
  };

  // Função para mostrar apenas a rota até a próxima entrega
  const renderNextDeliveryDirection = () => {
    if (!showRoute || optimizedRoute.length === 0 || !userLocation) return null;
    if (!HAS_GOOGLE_MAPS_KEY) return null;

    const nextDelivery = RouteOptimizer.getNextDelivery(optimizedRoute);
    if (!nextDelivery) return null;

    return (
      <MapViewDirections
        origin={userLocation}
        destination={{
          latitude: nextDelivery.delivery.latitude,
          longitude: nextDelivery.delivery.longitude,
        }}
        apikey={GOOGLE_MAPS_API_KEY}
        strokeWidth={6}
        strokeColor="#FF6B35" // Cor diferente para próxima entrega
        mode="DRIVING"
        language="pt-BR"
        region="BR"
        precision="high"
        onReady={(result) => {
          console.log('Próxima entrega:', {
            customer: nextDelivery.delivery.customerName,
            distance: result.distance,
            duration: result.duration
          });
        }}
        onError={(errorMessage) => {
          console.error('Erro na rota para próxima entrega:', errorMessage);
        }}
        lineCap="round"
        lineJoin="round"
      />
    );
  };

  if (isLoadingLocation) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Obtendo sua localização...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        showsMyLocationButton={false}
        followsUserLocation={false}
        initialRegion={
          userLocation
            ? {
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
                latitudeDelta: 0.02,
                longitudeDelta: 0.02,
              }
            : {
                latitude: -24.4894, // Centro de Registro-SP
                longitude: -47.8419,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }
        }
      >
        {renderDeliveryMarkers()}
        {!HAS_GOOGLE_MAPS_KEY ? (
          renderRoutePolyline()
        ) : (
          showFullRoute ? renderDirections() : renderNextDeliveryDirection()
        )}
      </MapView>

      {/* Controles do mapa */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlButton} onPress={centerMapOnUser}>
          <Ionicons name="locate" size={24} color="#007AFF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlButton} onPress={centerMapOnRoute}>
          <Ionicons name="map" size={24} color="#007AFF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => setShowRoute(!showRoute)}
        >
          <Ionicons
            name={showRoute ? "eye" : "eye-off"}
            size={24}
            color={showRoute ? "#007AFF" : "#9E9E9E"}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => setShowFullRoute(!showFullRoute)}
        >
          <Ionicons
            name={showFullRoute ? "map" : "navigate"}
            size={24}
            color={showFullRoute ? "#007AFF" : "#FF6B35"}
          />
        </TouchableOpacity>
      </View>

      {/* Informações da rota */}
      {optimizedRoute.length > 0 && (
        <View style={styles.routeInfo}>
          <Text style={styles.routeInfoText}>
            {optimizedRoute.length} entregas • {' '}
            {RouteOptimizer.calculateRouteStats(optimizedRoute).totalDistance.toFixed(1)} km
          </Text>
          {showFullRoute && (
            <Text style={styles.routeSubText}>Rota completa</Text>
          )}
          {!showFullRoute && (
            <Text style={styles.routeSubText}>Próxima entrega</Text>
          )}
        </View>
      )}

      {/* Aviso MVP - sem Google Maps */}
      {!HAS_GOOGLE_MAPS_KEY && (
        <View style={styles.warningInfo}>
          <Ionicons name="information-circle" size={20} color="#007AFF" />
          <Text style={styles.warningText}>
            📍 MVP: Rotas em linha reta. Configure Google Maps para rotas otimizadas nas ruas.
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  markerContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 2,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 30,
    minHeight: 30,
  },
  markerText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  priorityIndicator: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#ff4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controls: {
    position: 'absolute',
    top: 50,
    right: 16,
    gap: 8,
  },
  controlButton: {
    backgroundColor: '#fff',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  routeInfo: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  routeInfoText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  routeSubText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 2,
  },
  warningInfo: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  warningText: {
    fontSize: 12,
    color: '#1565C0',
    flex: 1,
    fontWeight: '500',
  },
});
