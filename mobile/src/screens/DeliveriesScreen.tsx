import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  RefreshControl,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { DeliveryItem } from '../components/DeliveryItem';
import { Delivery, Coordinates } from '../types';
import { ApiService } from '../services/api';
import { LocationService } from '../services/location';

interface DeliveriesScreenProps {
  navigation: any;
}

export const DeliveriesScreen: React.FC<DeliveriesScreenProps> = ({ navigation }) => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [filteredDeliveries, setFilteredDeliveries] = useState<Delivery[]>([]);
  const [currentLocation, setCurrentLocation] = useState<Coordinates | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'in_progress' | 'delivered' | 'failed'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const driverId = 'driver-1';

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterDeliveries();
  }, [deliveries, searchQuery, selectedFilter]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // Carregar localização
      const location = await LocationService.getCurrentLocation();
      if (location) {
        setCurrentLocation(location);
      }

      // Carregar entregas
      const data = await ApiService.getDeliveries(driverId);
      setDeliveries(data);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados.');
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, []);

  const filterDeliveries = () => {
    let filtered = deliveries;

    // Filtrar por status
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(delivery => delivery.status === selectedFilter);
    }

    // Filtrar por busca
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(delivery =>
        delivery.customerName.toLowerCase().includes(query) ||
        delivery.address.toLowerCase().includes(query) ||
        delivery.customerPhone.includes(query)
      );
    }

    // Ordenar por prioridade e distância
    filtered.sort((a, b) => {
      // Primeiro por status (em andamento primeiro)
      if (a.status === 'in_progress' && b.status !== 'in_progress') return -1;
      if (b.status === 'in_progress' && a.status !== 'in_progress') return 1;

      // Depois por prioridade
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;

      // Por último por distância (se disponível)
      if (currentLocation) {
        const distanceA = LocationService.calculateDistance(
          currentLocation,
          { latitude: a.latitude, longitude: a.longitude }
        );
        const distanceB = LocationService.calculateDistance(
          currentLocation,
          { latitude: b.latitude, longitude: b.longitude }
        );
        return distanceA - distanceB;
      }

      return 0;
    });

    setFilteredDeliveries(filtered);
  };

  const handleDeliveryPress = (delivery: Delivery) => {
    navigation.navigate('DeliveryDetails', { delivery });
  };

  const handleNavigateToDelivery = (delivery: Delivery) => {
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
          onPress: () => {
            // Linking.openURL(url);
            console.log('Abrindo navegação para:', url);
          },
        },
      ]
    );
  };

  const handleStatusChange = async (deliveryId: string, status: Delivery['status']) => {
    try {
      await ApiService.updateDeliveryStatus(deliveryId, status, currentLocation || undefined);
      
      setDeliveries(prev =>
        prev.map(delivery =>
          delivery.id === deliveryId
            ? { ...delivery, status, updatedAt: new Date().toISOString() }
            : delivery
        )
      );

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

  const getFilterCount = (filter: typeof selectedFilter): number => {
    if (filter === 'all') return deliveries.length;
    return deliveries.filter(d => d.status === filter).length;
  };

  const renderFilterButton = (
    filter: typeof selectedFilter,
    label: string,
    icon: string
  ) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        selectedFilter === filter && styles.filterButtonActive,
      ]}
      onPress={() => setSelectedFilter(filter)}
    >
      <Ionicons
        name={icon as any}
        size={16}
        color={selectedFilter === filter ? '#fff' : '#666'}
      />
      <Text
        style={[
          styles.filterButtonText,
          selectedFilter === filter && styles.filterButtonTextActive,
        ]}
      >
        {label} ({getFilterCount(filter)})
      </Text>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>Minhas Entregas</Text>
      
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por cliente, endereço ou telefone..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />
      </View>

      <View style={styles.filtersContainer}>
        {renderFilterButton('all', 'Todas', 'list')}
        {renderFilterButton('pending', 'Pendentes', 'time')}
        {renderFilterButton('in_progress', 'Em Andamento', 'car')}
        {renderFilterButton('delivered', 'Entregues', 'checkmark-circle')}
        {renderFilterButton('failed', 'Falharam', 'close-circle')}
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="cube" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>Nenhuma entrega encontrada</Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery || selectedFilter !== 'all'
          ? 'Tente ajustar os filtros de busca'
          : 'Você não possui entregas no momento'}
      </Text>
    </View>
  );

  const renderDeliveryItem = ({ item }: { item: Delivery }) => (
    <DeliveryItem
      delivery={item}
      onPress={() => handleDeliveryPress(item)}
      onStatusChange={handleStatusChange}
      onNavigate={() => handleNavigateToDelivery(item)}
      distance={getDeliveryDistance(item)}
    />
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      
      <FlatList
        data={filteredDeliveries}
        renderItem={renderDeliveryItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={!isLoading ? renderEmptyState : null}
        showsVerticalScrollIndicator={false}
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  filtersContainer: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    gap: 4,
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
  },
  filterButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 100, // Espaço para tab bar
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    marginTop: 100,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});
