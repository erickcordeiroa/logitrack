import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Delivery } from '../types';

interface DeliveryItemProps {
  delivery: Delivery;
  onPress: () => void;
  onStatusChange: (deliveryId: string, status: Delivery['status']) => void;
  onNavigate: () => void;
  distance?: number;
}

export const DeliveryItem: React.FC<DeliveryItemProps> = ({
  delivery,
  onPress,
  onStatusChange,
  onNavigate,
  distance,
}) => {
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

  const getPriorityIcon = () => {
    switch (delivery.priority) {
      case 'high':
        return <Ionicons name="warning" size={16} color="#ff4444" />;
      case 'medium':
        return <Ionicons name="time" size={16} color="#ffa500" />;
      case 'low':
        return <Ionicons name="remove-circle-outline" size={16} color="#9E9E9E" />;
      default:
        return null;
    }
  };

  const handleStatusChange = () => {
    if (delivery.status === 'pending') {
      Alert.alert(
        'Iniciar Entrega',
        'Deseja iniciar esta entrega?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Iniciar',
            onPress: () => onStatusChange(delivery.id, 'in_progress'),
          },
        ]
      );
    } else if (delivery.status === 'in_progress') {
      Alert.alert(
        'Finalizar Entrega',
        'Como deseja finalizar esta entrega?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Entregue',
            onPress: () => onStatusChange(delivery.id, 'delivered'),
            style: 'default',
          },
          {
            text: 'Falhou',
            onPress: () => onStatusChange(delivery.id, 'failed'),
            style: 'destructive',
          },
        ]
      );
    }
  };

  const canChangeStatus = delivery.status === 'pending' || delivery.status === 'in_progress';

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.customerInfo}>
          <Text style={styles.customerName}>{delivery.customerName}</Text>
          <View style={styles.priorityContainer}>
            {getPriorityIcon()}
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
              <Text style={styles.statusText}>{getStatusText()}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={onNavigate}
          >
            <Ionicons name="navigate" size={20} color="#007AFF" />
          </TouchableOpacity>
          
          {canChangeStatus && (
            <TouchableOpacity 
              style={[styles.actionButton, styles.statusButton]} 
              onPress={handleStatusChange}
            >
              <Ionicons 
                name={delivery.status === 'pending' ? 'play' : 'checkmark'} 
                size={20} 
                color="#fff" 
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <Text style={styles.address} numberOfLines={2}>
        <Ionicons name="location" size={14} color="#666" /> {delivery.address}
      </Text>

      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Ionicons name="time" size={14} color="#666" />
          <Text style={styles.detailText}>{delivery.estimatedTime}</Text>
        </View>
        
        {distance && (
          <View style={styles.detailItem}>
            <Ionicons name="car" size={14} color="#666" />
            <Text style={styles.detailText}>{distance.toFixed(1)} km</Text>
          </View>
        )}
        
        <View style={styles.detailItem}>
          <Ionicons name="bag" size={14} color="#666" />
          <Text style={styles.detailText}>
            {delivery.items.length} {delivery.items.length === 1 ? 'item' : 'itens'}
          </Text>
        </View>
      </View>

      {delivery.notes && (
        <View style={styles.notesContainer}>
          <Ionicons name="document-text" size={14} color="#666" />
          <Text style={styles.notesText}>{delivery.notes}</Text>
        </View>
      )}

      <View style={styles.footer}>
        <Text style={styles.createdAt}>
          Criado: {new Date(delivery.createdAt).toLocaleString('pt-BR')}
        </Text>
        <TouchableOpacity onPress={() => {/* Implementar ligação */}}>
          <Ionicons name="call" size={20} color="#007AFF" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 4,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  priorityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#fff',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusButton: {
    backgroundColor: '#007AFF',
  },
  address: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#666',
  },
  notesContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    backgroundColor: '#f8f9fa',
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
  },
  notesText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 8,
  },
  createdAt: {
    fontSize: 11,
    color: '#999',
  },
});
