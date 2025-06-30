import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  Text,
} from 'react-native';
import { DeliveryMap } from '../components/DeliveryMap';
import { LoadingScreen } from '../components/LoadingScreen';
import { Delivery, Coordinates } from '../types';
import { ApiService } from '../services/api';
import { LocationService } from '../services/location';

export const HomeScreen = () => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [currentLocation, setCurrentLocation] = useState<Coordinates | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ID do entregador - em um app real isso viria da autenticação
  const driverId = 'driver-1';

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Obter localização atual
      const location = await LocationService.getCurrentLocation();
      if (location) {
        setCurrentLocation(location);
      }

      // Carregar entregas
      await loadDeliveries();
    } catch (error) {
      console.error('Erro ao inicializar app:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados iniciais.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadDeliveries = async () => {
    try {
      const data = await ApiService.getDeliveries(driverId);
      setDeliveries(data);
    } catch (error) {
      console.error('Erro ao carregar entregas:', error);
      Alert.alert('Erro', 'Não foi possível carregar as entregas.');
    }
  };

  const handleDeliveryPress = (delivery: Delivery) => {
    // Em uma implementação real, navegaria para detalhes
    Alert.alert(
      delivery.customerName,
      `${delivery.address}\n\nStatus: ${delivery.status}\nItens: ${delivery.items.length}`,
      [{ text: 'OK' }]
    );
  };

  const handleNavigateToDelivery = (delivery: Delivery) => {
    Alert.alert(
      'Navegar',
      `Abrir navegação para ${delivery.customerName}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Abrir Maps', onPress: () => console.log('Abrindo navegação...') },
      ]
    );
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  const pendingCount = deliveries.filter(d => d.status === 'pending' || d.status === 'in_progress').length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mapa de Entregas</Text>
        <Text style={styles.headerSubtitle}>
          {pendingCount} entregas pendentes
        </Text>
      </View>

      {/* Mapa */}
      <DeliveryMap
        deliveries={deliveries}
        onDeliveryPress={handleDeliveryPress}
        onNavigateToDelivery={handleNavigateToDelivery}
        currentLocation={currentLocation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 44, // Espaço para status bar
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
});
