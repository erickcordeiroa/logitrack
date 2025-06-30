import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { DeliveryMap } from '../components/DeliveryMap';
import { DeliveryItem } from '../components/DeliveryItem';
import { LoadingScreen } from '../components/LoadingScreen';
import { Delivery, Coordinates } from '../types';
import { ApiService } from '../services/api';
import { LocationService } from '../services/location';

export const HomeScreen = () => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [currentLocation, setCurrentLocation] = useState<Coordinates | null>(null);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [showListView, setShowListView] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadDeliveries();
    setRefreshing(false);
  }, []);

  const handleDeliveryPress = (delivery: Delivery) => {
    setSelectedDelivery(delivery);
    setShowDeliveryModal(true);
  };

  const handleNavigateToDelivery = (delivery: Delivery) => {
    if (!currentLocation) {
      Alert.alert('Erro', 'Localização não disponível.');
      return;
    }

    // Abrir app de navegação nativo ou implementar navegação interna
    const url = `geo:${delivery.latitude},${delivery.longitude}?q=${encodeURIComponent(delivery.address)}`;
    Alert.alert(
      'Navegar',
      `Abrir navegação para ${delivery.customerName}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Abrir',
          onPress: () => {
            // Linking.openURL(url); // Descomentar quando implementar
            console.log('Abrindo navegação para:', url);
          },
        },
      ]
    );
  };

  const handleStatusChange = async (deliveryId: string, status: Delivery['status']) => {
    try {
      await ApiService.updateDeliveryStatus(deliveryId, status, currentLocation || undefined);
      
      // Atualizar estado local
      setDeliveries(prev =>
        prev.map(delivery =>
          delivery.id === deliveryId
            ? { ...delivery, status, updatedAt: new Date().toISOString() }
            : delivery
        )
      );

      // Mostrar feedback
      const statusText = status === 'delivered' ? 'entregue' : 
                        status === 'in_progress' ? 'iniciada' : 
                        status === 'failed' ? 'marcada como falhou' : 'atualizada';
      
      Alert.alert('Sucesso', `Entrega ${statusText} com sucesso!`);
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      Alert.alert('Erro', 'Não foi possível atualizar o status da entrega.');
    }
  };

  const getDeliveryDistance = (delivery: Delivery): number | undefined => {
    if (!currentLocation) return undefined;
    return LocationService.calculateDistance(
      currentLocation,
      { latitude: delivery.latitude, longitude: delivery.longitude }
    );
  };

  const getPendingDeliveriesCount = () => {
    return deliveries.filter(d => d.status === 'pending' || d.status === 'in_progress').length;
  };

  const getDeliveredTodayCount = () => {
    const today = new Date().toDateString();
    return deliveries.filter(d => 
      d.status === 'delivered' && 
      new Date(d.updatedAt).toDateString() === today
    ).length;
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>LogiTrack Entregador</Text>
      <View style={styles.headerStats}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{getPendingDeliveriesCount()}</Text>
          <Text style={styles.statLabel}>Pendentes</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{getDeliveredTodayCount()}</Text>
          <Text style={styles.statLabel}>Entregues hoje</Text>
        </View>
      </View>
    </View>
  );

  const renderFloatingButtons = () => (
    <View style={styles.floatingButtons}>
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setShowListView(!showListView)}
      >
        <Ionicons 
          name={showListView ? "map" : "list"} 
          size={24} 
          color="#fff" 
        />
      </TouchableOpacity>
    </View>
  );

  const renderDeliveryModal = () => (
    <Modal
      visible={showDeliveryModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowDeliveryModal(false)}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Detalhes da Entrega</Text>
          <TouchableOpacity onPress={() => setShowDeliveryModal(false)}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
        </View>
        
        {selectedDelivery && (
          <ScrollView style={styles.modalContent}>
            <DeliveryItem
              delivery={selectedDelivery}
              onPress={() => {}}
              onStatusChange={handleStatusChange}
              onNavigate={() => {
                setShowDeliveryModal(false);
                handleNavigateToDelivery(selectedDelivery);
              }}
              distance={getDeliveryDistance(selectedDelivery)}
            />
            
            <View style={styles.deliveryDetails}>
              <Text style={styles.sectionTitle}>Itens da Entrega</Text>
              {selectedDelivery.items.map((item) => (
                <View key={item.id} style={styles.itemContainer}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemQuantity}>Qtd: {item.quantity}</Text>
                  {item.description && (
                    <Text style={styles.itemDescription}>{item.description}</Text>
                  )}
                </View>
              ))}
            </View>

            <View style={styles.contactSection}>
              <Text style={styles.sectionTitle}>Contato</Text>
              <TouchableOpacity style={styles.contactButton}>
                <Ionicons name="call" size={20} color="#007AFF" />
                <Text style={styles.contactText}>{selectedDelivery.customerPhone}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </Modal>
  );

  if (isLoading) {
    return <LoadingScreen message="Carregando entregas..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      
      {showListView ? (
        <ScrollView
          style={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {deliveries.map((delivery) => (
            <DeliveryItem
              key={delivery.id}
              delivery={delivery}
              onPress={() => handleDeliveryPress(delivery)}
              onStatusChange={handleStatusChange}
              onNavigate={() => handleNavigateToDelivery(delivery)}
              distance={getDeliveryDistance(delivery)}
            />
          ))}
        </ScrollView>
      ) : (
        <DeliveryMap
          deliveries={deliveries}
          onDeliveryPress={handleDeliveryPress}
          onNavigateToDelivery={handleNavigateToDelivery}
          currentLocation={currentLocation || undefined}
        />
      )}

      {renderFloatingButtons()}
      {renderDeliveryModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  headerStats: {
    flexDirection: 'row',
    gap: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  listContainer: {
    flex: 1,
  },
  floatingButtons: {
    position: 'absolute',
    bottom: 30,
    right: 16,
  },
  floatingButton: {
    backgroundColor: '#007AFF',
    borderRadius: 28,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  modalContent: {
    flex: 1,
  },
  deliveryDetails: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  itemContainer: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  itemQuantity: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  itemDescription: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 2,
  },
  contactSection: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    padding: 16,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
  },
  contactText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
});
