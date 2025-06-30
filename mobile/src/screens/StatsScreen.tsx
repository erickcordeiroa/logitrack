import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ApiService } from '../services/api';

interface StatsCardProps {
  title: string;
  value: string;
  icon: string;
  color: string;
  subtitle?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, color, subtitle }) => (
  <View style={[styles.statsCard, { borderLeftColor: color }]}>
    <View style={styles.statsHeader}>
      <Ionicons name={icon as any} size={24} color={color} />
      <Text style={styles.statsTitle}>{title}</Text>
    </View>
    <Text style={[styles.statsValue, { color }]}>{value}</Text>
    {subtitle && <Text style={styles.statsSubtitle}>{subtitle}</Text>}
  </View>
);

export const StatsScreen: React.FC = () => {
  const [stats, setStats] = useState({
    totalDeliveries: 0,
    pendingDeliveries: 0,
    completedDeliveries: 0,
    todayDeliveries: 0,
    totalDistance: 0,
    averageTime: 0,
    successRate: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setIsLoading(true);
      
      // Carregar entregas para calcular estatísticas
      const deliveries = await ApiService.getDeliveries('driver-1');
      
      const total = deliveries.length;
      const pending = deliveries.filter(d => d.status === 'pending').length;
      const inProgress = deliveries.filter(d => d.status === 'in_progress').length;
      const completed = deliveries.filter(d => d.status === 'delivered').length;
      const failed = deliveries.filter(d => d.status === 'failed').length;
      
      // Entregas de hoje (mock)
      const today = new Date().toDateString();
      const todayCount = deliveries.filter(d => 
        new Date(d.createdAt).toDateString() === today
      ).length;
      
      // Distância total estimada (mock - em um app real seria calculado)
      const totalDistance = deliveries.reduce((acc, delivery) => {
        return acc + (delivery.estimatedDistance || 0);
      }, 0);
      
      // Taxa de sucesso
      const successRate = total > 0 ? ((completed / total) * 100) : 0;
      
      setStats({
        totalDeliveries: total,
        pendingDeliveries: pending + inProgress,
        completedDeliveries: completed,
        todayDeliveries: todayCount,
        totalDistance: Math.round(totalDistance),
        averageTime: 25, // Mock - tempo médio em minutos
        successRate: Math.round(successRate),
      });
      
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando estatísticas...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Suas Estatísticas</Text>
          <Text style={styles.headerSubtitle}>Acompanhe seu desempenho</Text>
        </View>

        {/* Estatísticas Principais */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Visão Geral</Text>
          
          <StatsCard
            title="Total de Entregas"
            value={stats.totalDeliveries.toString()}
            icon="cube"
            color="#007AFF"
            subtitle="Todas as entregas"
          />
          
          <StatsCard
            title="Entregas Pendentes"
            value={stats.pendingDeliveries.toString()}
            icon="time"
            color="#FF9500"
            subtitle="Para fazer"
          />
          
          <StatsCard
            title="Entregas Concluídas"
            value={stats.completedDeliveries.toString()}
            icon="checkmark-circle"
            color="#34C759"
            subtitle="Finalizadas com sucesso"
          />
        </View>

        {/* Estatísticas de Hoje */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hoje</Text>
          
          <StatsCard
            title="Entregas de Hoje"
            value={stats.todayDeliveries.toString()}
            icon="calendar"
            color="#5856D6"
            subtitle={new Date().toLocaleDateString('pt-BR')}
          />
        </View>

        {/* Estatísticas de Performance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance</Text>
          
          <StatsCard
            title="Distância Total"
            value={`${stats.totalDistance} km`}
            icon="speedometer"
            color="#FF2D92"
            subtitle="Percorrida nas entregas"
          />
          
          <StatsCard
            title="Tempo Médio"
            value={`${stats.averageTime} min`}
            icon="timer"
            color="#32D74B"
            subtitle="Por entrega"
          />
          
          <StatsCard
            title="Taxa de Sucesso"
            value={`${stats.successRate}%`}
            icon="trophy"
            color="#FFD60A"
            subtitle="Entregas bem-sucedidas"
          />
        </View>

        {/* Ações Rápidas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ações Rápidas</Text>
          
          <TouchableOpacity style={styles.actionButton} onPress={loadStats}>
            <Ionicons name="refresh" size={20} color="#007AFF" />
            <Text style={styles.actionButtonText}>Atualizar Estatísticas</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Dados atualizados em: {new Date().toLocaleString('pt-BR')}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  statsCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 20,
    borderRadius: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginLeft: 10,
  },
  statsValue: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statsSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#007AFF',
    marginLeft: 8,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});
