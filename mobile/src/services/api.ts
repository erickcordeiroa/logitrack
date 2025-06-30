import axios from 'axios';
import { Delivery, Route, DeliveryDriver, Coordinates } from '../types';

// Configuração base da API
const API_BASE_URL = __DEV__ ? 'http://192.168.1.100:8000/api/v1' : 'https://your-api-domain.com/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
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

// Interceptor para tratar respostas da API Laravel
api.interceptors.response.use(
  (response) => {
    // Se a resposta tem success: true, retorna só os dados
    if (response.data?.success) {
      return { ...response, data: response.data.data };
    }
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export class ApiService {
  // Buscar entregas pendentes para o entregador
  static async getDeliveries(driverId: string): Promise<Delivery[]> {
    try {
      const response = await api.get(`/entregadores/${driverId}`);
      const entregador = response.data;
      
      // Buscar entregas de todas as rotas do entregador
      const entregas: any[] = [];
      if (entregador.rotas) {
        entregador.rotas.forEach((rota: any) => {
          if (rota.entregas) {
            entregas.push(...rota.entregas);
          }
        });
      }
      
      return entregas.map(this.convertEntregaToDelivery);
    } catch (error) {
      console.error('Erro ao buscar entregas:', error);
      // Retorna dados mock para desenvolvimento
      return this.getMockDeliveries();
    }
  }

  // Buscar detalhes de uma entrega específica
  static async getDeliveryDetails(deliveryId: string): Promise<Delivery> {
    try {
      const response = await api.get(`/entregas/${deliveryId}`);
      return this.convertEntregaToDelivery(response.data);
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
      let endpoint: string;
      switch (status) {
        case 'collected':
          endpoint = `/entregas/${deliveryId}/coletar`;
          break;
        case 'in_transit':
          endpoint = `/entregas/${deliveryId}/transito`;
          break;
        case 'delivered':
          endpoint = `/entregas/${deliveryId}/entregar`;
          break;
        default:
          throw new Error(`Status ${status} não suportado`);
      }
      
      await api.post(endpoint, { location });
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
      const response = await api.get(`/entregadores/${driverId}`);
      const entregador = response.data;
      
      // Buscar rota ativa do entregador
      const rotaAtiva = entregador.rotas?.find((rota: any) => rota.status === 'em_andamento');
      
      if (rotaAtiva) {
        return this.convertRotaToRoute(rotaAtiva);
      }
      
      throw new Error('Nenhuma rota ativa encontrada');
    } catch (error) {
      console.error('Erro ao buscar rota:', error);
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
      await api.post(`/entregadores/${driverId}/location`, {
        latitude: location.latitude,
        longitude: location.longitude,
      });
    } catch (error) {
      console.error('Erro ao atualizar localização:', error);
    }
  }

  // Função para converter dados da API Laravel para o formato do app
  private static convertEntregaToDelivery(entrega: any): Delivery {
    return {
      id: entrega.id.toString(),
      customerName: entrega.cliente_nome,
      customerPhone: entrega.cliente_telefone || '',
      address: entrega.endereco_destino,
      latitude: entrega.destino_latitude,
      longitude: entrega.destino_longitude,
      status: this.convertStatusToDeliveryStatus(entrega.status),
      estimatedTime: '25 min', // Pode ser calculado dinamicamente
      items: [
        {
          id: '1',
          name: 'Produto',
          quantity: 1,
          description: entrega.observacoes || 'Sem descrição',
        },
      ],
      notes: entrega.observacoes || '',
      priority: 'medium' as const,
      createdAt: entrega.created_at,
      updatedAt: entrega.updated_at,
    };
  }

  private static convertStatusToDeliveryStatus(status: string): Delivery['status'] {
    const statusMap: Record<string, Delivery['status']> = {
      'pendente': 'pending',
      'coletada': 'collected',
      'em_transito': 'in_transit',
      'entregue': 'delivered',
      'cancelada': 'cancelled',
    };
    
    return statusMap[status] || 'pending';
  }

  private static convertRotaToRoute(rota: any): Route {
    const stops = rota.entregas?.map((entrega: any) => ({
      id: entrega.id.toString(),
      address: entrega.endereco_destino,
      latitude: entrega.destino_latitude,
      longitude: entrega.destino_longitude,
      completed: entrega.status === 'entregue',
      estimatedTime: '15 min',
    })) || [];

    return {
      id: rota.id.toString(),
      driverId: rota.entregador_id?.toString() || '',
      status: rota.status === 'em_andamento' ? 'active' : 'pending',
      totalStops: stops.length,
      completedStops: stops.filter((stop: any) => stop.completed).length,
      estimatedCompletion: rota.hora_fim || '18:00',
      stops,
    };
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
