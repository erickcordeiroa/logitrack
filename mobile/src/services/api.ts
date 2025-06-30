import axios from 'axios';
import { Delivery, Route, DeliveryDriver, Coordinates } from '../types';

// Configuração base da API - será necessário ajustar quando o backend Laravel estiver pronto
const API_BASE_URL = __DEV__ ? 'http://localhost:8000/api' : 'https://your-api-domain.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  (config) => {
    // Aqui você pode adicionar o token de autenticação quando implementar
    // const token = await AsyncStorage.getItem('authToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export class ApiService {
  // Buscar entregas pendentes para o entregador
  static async getDeliveries(driverId: string): Promise<Delivery[]> {
    try {
      const response = await api.get(`/drivers/${driverId}/deliveries`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar entregas:', error);
      // Retorna dados mock para desenvolvimento
      return this.getMockDeliveries();
    }
  }

  // Buscar detalhes de uma entrega específica
  static async getDeliveryDetails(deliveryId: string): Promise<Delivery> {
    try {
      const response = await api.get(`/deliveries/${deliveryId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar detalhes da entrega:', error);
      throw error;
    }
  }

  // Atualizar status da entrega
  static async updateDeliveryStatus(
    deliveryId: string, 
    status: Delivery['status'],
    location?: Coordinates
  ): Promise<void> {
    try {
      await api.patch(`/deliveries/${deliveryId}/status`, {
        status,
        location,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Erro ao atualizar status da entrega:', error);
      throw error;
    }
  }

  // Obter rota otimizada
  static async getOptimizedRoute(
    driverId: string,
    currentLocation: Coordinates
  ): Promise<Route> {
    try {
      const response = await api.post(`/drivers/${driverId}/optimize-route`, {
        currentLocation,
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao otimizar rota:', error);
      // Retorna rota mock para desenvolvimento
      return this.getMockRoute();
    }
  }

  // Enviar localização atual do entregador
  static async updateDriverLocation(
    driverId: string,
    location: Coordinates
  ): Promise<void> {
    try {
      await api.post(`/drivers/${driverId}/location`, location);
    } catch (error) {
      console.error('Erro ao atualizar localização:', error);
    }
  }

  // Dados mock para desenvolvimento - Cidade de Registro-SP
  private static getMockDeliveries(): Delivery[] {
    return [
      {
        id: '1',
        customerName: 'João Silva Santos',
        customerPhone: '(13) 99821-1234',
        address: 'Rua Campos Sales, 245 - Centro, Registro - SP',
        latitude: -24.4894,
        longitude: -47.8419,
        status: 'pending',
        estimatedTime: '25 min',
        items: [
          { id: '1', name: 'Pizza Margherita', quantity: 1, description: 'Tamanho grande' },
          { id: '2', name: 'Refrigerante Coca-Cola', quantity: 2, description: '2L' },
        ],
        notes: 'Entregar no portão principal - Casa azul',
        priority: 'high',
        createdAt: '2025-06-29T09:30:00Z',
        updatedAt: '2025-06-29T09:30:00Z',
      },
      {
        id: '2',
        customerName: 'Maria das Graças',
        customerPhone: '(13) 99765-4321',
        address: 'Av. Prefeito Jonas Banks Leite, 890 - Vila Tupy, Registro - SP',
        latitude: -24.4835,
        longitude: -47.8502,
        status: 'pending',
        estimatedTime: '20 min',
        items: [
          { id: '3', name: 'Hambúrguer Artesanal', quantity: 2, description: 'Com batata frita' },
          { id: '4', name: 'Milk Shake', quantity: 1, description: 'Chocolate' },
        ],
        notes: 'Apartamento 304 - Interfone quebrado, ligar antes',
        priority: 'medium',
        createdAt: '2025-06-29T10:15:00Z',
        updatedAt: '2025-06-29T10:15:00Z',
      },
      {
        id: '3',
        customerName: 'Pedro Henrique Oliveira',
        customerPhone: '(13) 99888-7777',
        address: 'Rua João Batista Gomes, 156 - Jardim Paraíso, Registro - SP',
        latitude: -24.4920,
        longitude: -47.8380,
        status: 'in_progress',
        estimatedTime: '15 min',
        items: [
          { id: '5', name: 'Marmitex Completa', quantity: 1, description: 'Arroz, feijão, bife, batata' },
        ],
        notes: 'Cliente no trabalho - entregar na portaria da empresa',
        priority: 'high',
        createdAt: '2025-06-29T09:00:00Z',
        updatedAt: '2025-06-29T11:30:00Z',
      },
      {
        id: '4',
        customerName: 'Ana Paula Ferreira',
        customerPhone: '(13) 99654-3210',
        address: 'Rua das Palmeiras, 78 - Jardim Residencial, Registro - SP',
        latitude: -24.4865,
        longitude: -47.8445,
        status: 'pending',
        estimatedTime: '30 min',
        items: [
          { id: '6', name: 'Açaí com granola', quantity: 2, description: '500ml cada' },
          { id: '7', name: 'Tapioca doce', quantity: 1, description: 'Leite condensado e coco' },
        ],
        priority: 'low',
        createdAt: '2025-06-29T11:00:00Z',
        updatedAt: '2025-06-29T11:00:00Z',
      },
      {
        id: '5',
        customerName: 'Carlos Eduardo Lima',
        customerPhone: '(13) 99123-9876',
        address: 'Av. Marginal, 1200 - Barra do Ribeira, Registro - SP',
        latitude: -24.4780,
        longitude: -47.8590,
        status: 'pending',
        estimatedTime: '35 min',
        items: [
          { id: '8', name: 'Sushi Combinado', quantity: 1, description: '30 peças variadas' },
          { id: '9', name: 'Temaki de salmão', quantity: 2, description: 'Grande' },
        ],
        notes: 'Casa na beira do rio - portão verde',
        priority: 'medium',
        createdAt: '2025-06-29T10:45:00Z',
        updatedAt: '2025-06-29T10:45:00Z',
      },
      {
        id: '6',
        customerName: 'Fernanda Costa',
        customerPhone: '(13) 99333-5555',
        address: 'Rua Benedito Calixto, 333 - Centro, Registro - SP',
        latitude: -24.4910,
        longitude: -47.8435,
        status: 'pending',
        estimatedTime: '18 min',
        items: [
          { id: '10', name: 'Lanche Natural', quantity: 3, description: 'Frango com salada' },
          { id: '11', name: 'Suco de laranja', quantity: 3, description: '300ml' },
        ],
        notes: 'Escritório no 2º andar - sala 201',
        priority: 'medium',
        createdAt: '2025-06-29T11:15:00Z',
        updatedAt: '2025-06-29T11:15:00Z',
      },
      {
        id: '7',
        customerName: 'Roberto da Silva',
        customerPhone: '(13) 99777-2468',
        address: 'Estrada do Despraiado, km 3 - Zona Rural, Registro - SP',
        latitude: -24.5050,
        longitude: -47.8650,
        status: 'pending',
        estimatedTime: '45 min',
        items: [
          { id: '12', name: 'Marmitex Grande', quantity: 4, description: 'Almoço para a família' },
          { id: '13', name: 'Refrigerante', quantity: 4, description: 'Guaraná 2L' },
        ],
        notes: 'Sítio - seguir pela estrada de terra 500m após o posto',
        priority: 'low',
        createdAt: '2025-06-29T09:45:00Z',
        updatedAt: '2025-06-29T09:45:00Z',
      },
      {
        id: '8',
        customerName: 'Juliana Mendes',
        customerPhone: '(13) 99111-3579',
        address: 'Rua São José, 567 - Vila São José, Registro - SP',
        latitude: -24.4825,
        longitude: -47.8395,
        status: 'delivered',
        estimatedTime: '22 min',
        items: [
          { id: '14', name: 'Pizza Portuguesa', quantity: 1, description: 'Família' },
          { id: '15', name: 'Esfiha de carne', quantity: 6, description: 'Abertas' },
        ],
        notes: 'Entregue com sucesso',
        priority: 'high',
        createdAt: '2025-06-29T08:30:00Z',
        updatedAt: '2025-06-29T10:45:00Z',
      }
    ];
  }

  private static getMockRoute(): Route {
    return {
      id: 'route-1',
      deliveries: this.getMockDeliveries(),
      totalDistance: 8.2,
      estimatedDuration: 120,
      optimized: true,
      startLocation: {
        latitude: -24.4894, // Centro de Registro-SP
        longitude: -47.8419,
      },
    };
  }
}
