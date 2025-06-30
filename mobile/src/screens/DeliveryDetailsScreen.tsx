import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  Alert,
  Linking,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { Delivery, Coordinates } from '../types';
import { ApiService } from '../services/api';
import { LocationService } from '../services/location';

interface DeliveryDetailsScreenProps {
  navigation: any;
  route: {
    params: {
      delivery: Delivery;
    };
  };
}

const { width } = Dimensions.get('window');

export const DeliveryDetailsScreen: React.FC<DeliveryDetailsScreenProps> = ({
  navigation,
  route,
}) => {
  const { delivery: initialDelivery } = route.params;
  const [delivery, setDelivery] = useState<Delivery>(initialDelivery);
  const [currentLocation, setCurrentLocation] = useState<Coordinates | null>(null);
  const [distance, setDistance] = useState<number | null>(null);

  useEffect(() => {
    loadCurrentLocation();
    navigation.setOptions({
      title: `Entrega para ${delivery.customerName}`,
    });
  }, []);

  useEffect(() => {
    if (currentLocation) {
      const dist = LocationService.calculateDistance(
        currentLocation,
        { latitude: delivery.latitude, longitude: delivery.longitude }
      );
      setDistance(dist);
    }
  }, [currentLocation, delivery]);

  const loadCurrentLocation = async () => {
    const location = await LocationService.getCurrentLocation();
    setCurrentLocation(location);
  };

  const handleStatusChange = async (status: Delivery['status']) => {
    try {
      await ApiService.updateDeliveryStatus(delivery.id, status, currentLocation || undefined);
      
      setDelivery(prev => ({
        ...prev,
        status,
        updatedAt: new Date().toISOString(),
      }));

      const statusText = status === 'delivered' ? 'entregue' : 
                        status === 'in_progress' ? 'iniciada' : 
                        status === 'failed' ? 'marcada como falhou' : 'atualizada';
      
      Alert.alert('Sucesso', `Entrega ${statusText} com sucesso!`);
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      Alert.alert('Erro', 'Não foi possível atualizar o status da entrega.');
    }
  };

  const handleCall = () => {
    Alert.alert(
      'Ligar para cliente',
      `Deseja ligar para ${delivery.customerName}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Ligar',
          onPress: () => Linking.openURL(`tel:${delivery.customerPhone}`),
        },
      ]
    );
  };

  const handleNavigate = () => {
    if (!currentLocation) {
      Alert.alert('Erro', 'Localização não disponível.');
      return;
    }

    const url = `geo:${delivery.latitude},${delivery.longitude}?q=${encodeURIComponent(delivery.address)}`;
    Alert.alert(
      'Navegar',
      `Abrir navegação para ${delivery.customerName}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Abrir',
          onPress: () => Linking.openURL(url),
        },
      ]
    );
  };

  const getStatusColor = () => {
    switch (delivery.status) {
      case 'pending':
        return '#ffa500';
      case 'in_progress':
        return '#007AFF';
      case 'delivered':
        return '#4CAF50';
      case 'failed':
        return '#ff4444';
      default:
        return '#9E9E9E';
    }
  };

  const getStatusText = () => {
    switch (delivery.status) {
      case 'pending':
        return 'Pendente';
      case 'in_progress':
        return 'Em andamento';
      case 'delivered':
        return 'Entregue';
      case 'failed':
        return 'Falhou';
      default:
        return 'Desconhecido';
    }
  };

  const getPriorityText = () => {
    switch (delivery.priority) {
      case 'high':
        return 'Alta';
      case 'medium':
        return 'Média';
      case 'low':
        return 'Baixa';
      default:
        return 'Normal';
    }
  };

  const getPriorityColor = () => {
    switch (delivery.priority) {
      case 'high':
        return '#ff4444';
      case 'medium':
        return '#ffa500';
      case 'low':
        return '#9E9E9E';
      default:
        return '#9E9E9E';
    }
  };

  const renderStatusActions = () => {
    if (delivery.status === 'delivered' || delivery.status === 'failed') {
      return null;
    }

    return (
      <View style={styles.actionsContainer}>
        {delivery.status === 'pending' && (
          <TouchableOpacity
            style={[styles.actionButton, styles.startButton]}
            onPress={() => handleStatusChange('in_progress')}
          >
            <Ionicons name="play" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Iniciar Entrega</Text>
          </TouchableOpacity>
        )}

        {delivery.status === 'in_progress' && (
          <>
            <TouchableOpacity
              style={[styles.actionButton, styles.completeButton]}
              onPress={() => handleStatusChange('delivered')}
            >
              <Ionicons name="checkmark" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>Marcar como Entregue</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.failButton]}
              onPress={() => handleStatusChange('failed')}
            >
              <Ionicons name="close" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>Marcar como Falhada</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    );
  };

  const renderMap = () => (
    <View style={styles.mapContainer}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: delivery.latitude,
          longitude: delivery.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={true}
      >
        <Marker
          coordinate={{
            latitude: delivery.latitude,
            longitude: delivery.longitude,
          }}
          title={delivery.customerName}
          description={delivery.address}
          pinColor={getStatusColor()}
        />
      </MapView>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header com informações principais */}
        <View style={styles.header}>
          <View style={styles.customerInfo}>
            <Text style={styles.customerName}>{delivery.customerName}</Text>
            <Text style={styles.customerPhone}>{delivery.customerPhone}</Text>
          </View>
          
          <View style={styles.statusContainer}>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
              <Text style={styles.statusText}>{getStatusText()}</Text>
            </View>
            <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor() }]}>
              <Text style={styles.priorityText}>Prioridade {getPriorityText()}</Text>
            </View>
          </View>
        </View>

        {/* Mapa */}
        {renderMap()}

        {/* Endereço e distância */}
        <View style={styles.addressContainer}>
          <View style={styles.addressInfo}>
            <Ionicons name="location" size={20} color="#007AFF" />
            <Text style={styles.address}>{delivery.address}</Text>
          </View>
          
          {distance && (
            <View style={styles.distanceInfo}>
              <Ionicons name="car" size={16} color="#666" />
              <Text style={styles.distanceText}>{distance.toFixed(1)} km de distância</Text>
            </View>
          )}
          
          <View style={styles.timeInfo}>
            <Ionicons name="time" size={16} color="#666" />
            <Text style={styles.timeText}>Tempo estimado: {delivery.estimatedTime}</Text>
          </View>
        </View>

        {/* Itens da entrega */}
        <View style={styles.itemsContainer}>
          <Text style={styles.sectionTitle}>Itens da Entrega</Text>
          {delivery.items.map((item) => (
            <View key={item.id} style={styles.itemCard}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemQuantity}>Qtd: {item.quantity}</Text>
              </View>
              {item.description && (
                <Text style={styles.itemDescription}>{item.description}</Text>
              )}
            </View>
          ))}
        </View>

        {/* Observações */}
        {delivery.notes && (
          <View style={styles.notesContainer}>
            <Text style={styles.sectionTitle}>Observações</Text>
            <View style={styles.notesCard}>
              <Ionicons name="document-text" size={20} color="#666" />
              <Text style={styles.notesText}>{delivery.notes}</Text>
            </View>
          </View>
        )}

        {/* Informações de tempo */}
        <View style={styles.timeContainer}>
          <Text style={styles.sectionTitle}>Informações de Tempo</Text>
          <View style={styles.timeCard}>
            <View style={styles.timeRow}>
              <Text style={styles.timeLabel}>Criado em:</Text>
              <Text style={styles.timeValue}>
                {new Date(delivery.createdAt).toLocaleString('pt-BR')}
              </Text>
            </View>
            <View style={styles.timeRow}>
              <Text style={styles.timeLabel}>Última atualização:</Text>
              <Text style={styles.timeValue}>
                {new Date(delivery.updatedAt).toLocaleString('pt-BR')}
              </Text>
            </View>
          </View>
        </View>

        {/* Ações de status */}
        {renderStatusActions()}
      </ScrollView>

      {/* Botões fixos na parte inferior */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity style={styles.callButton} onPress={handleCall}>
          <Ionicons name="call" size={24} color="#fff" />
          <Text style={styles.bottomButtonText}>Ligar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navigateButton} onPress={handleNavigate}>
          <Ionicons name="navigate" size={24} color="#fff" />
          <Text style={styles.bottomButtonText}>Navegar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#fff',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  customerPhone: {
    fontSize: 16,
    color: '#666',
  },
  statusContainer: {
    alignItems: 'flex-end',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#fff',
  },
  mapContainer: {
    height: 200,
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  addressContainer: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  addressInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 8,
  },
  address: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    lineHeight: 22,
  },
  distanceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  distanceText: {
    fontSize: 14,
    color: '#666',
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeText: {
    fontSize: 14,
    color: '#666',
  },
  itemsContainer: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  itemCard: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    flex: 1,
  },
  itemQuantity: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  notesContainer: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  notesCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#fff3cd',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#ffa500',
  },
  notesText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    lineHeight: 20,
  },
  timeContainer: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  timeCard: {
    gap: 8,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeLabel: {
    fontSize: 14,
    color: '#666',
  },
  timeValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  actionsContainer: {
    margin: 16,
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  startButton: {
    backgroundColor: '#007AFF',
  },
  completeButton: {
    backgroundColor: '#4CAF50',
  },
  failButton: {
    backgroundColor: '#ff4444',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  bottomButtons: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  callButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    gap: 8,
  },
  navigateButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    gap: 8,
  },
  bottomButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
