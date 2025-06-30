import axios, { AxiosResponse } from 'axios'

// Configuração da API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Interceptor para adicionar token de autenticação se necessário
api.interceptors.request.use(
  (config) => {
    // Aqui você pode adicionar autenticação quando implementar
    // const token = localStorage.getItem('authToken')
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para tratar respostas
api.interceptors.response.use(
  (response) => {
    // Se a resposta tem success: true, retorna só os dados
    if (response.data?.success) {
      return { ...response, data: response.data.data }
    }
    return response
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

// Tipos TypeScript
export interface Entregador {
  id: number
  nome: string
  email: string
  telefone?: string
  cpf: string
  veiculo_tipo: string
  veiculo_placa?: string
  ativo: boolean
  latitude?: number
  longitude?: number
  status: 'online' | 'offline' | 'em_entrega' | 'inativo'
  ultima_localizacao?: string
}

export interface Rota {
  id: number
  nome: string
  descricao?: string
  entregador_id?: number
  entregador?: Entregador
  status: 'pendente' | 'em_andamento' | 'concluida' | 'cancelada'
  data_entrega: string
  hora_inicio?: string
  hora_fim?: string
  distancia_total?: number
  valor_total: number
  entregas?: Entrega[]
  entregas_pendentes: number
  entregas_concluidas: number
  progresso: number
}

export interface Entrega {
  id: number
  rota_id: number
  rota?: Rota
  codigo_rastreamento: string
  cliente_nome: string
  cliente_telefone?: string
  endereco_origem: string
  origem_latitude: number
  origem_longitude: number
  endereco_destino: string
  destino_latitude: number
  destino_longitude: number
  status: 'pendente' | 'coletada' | 'em_transito' | 'entregue' | 'cancelada'
  valor_entrega: number
  peso?: number
  observacoes?: string
  ordem_na_rota: number
  coletada_em?: string
  entregue_em?: string
}

export interface DashboardStats {
  entregadores_ativos: number
  rotas_hoje: number
  entregas_pendentes: number
  entregas_entregues: number
}

export interface EntregadorLocalizacao {
  id: number
  nome: string
  latitude: number
  longitude: number
  status: string
  veiculo_tipo: string
  ultima_localizacao?: string
}

// API Service
export class ApiService {
  // Dashboard
  static async getDashboardStats(): Promise<DashboardStats> {
    const response = await api.get('/dashboard/stats')
    return response.data
  }

  static async getEntregadoresLocalizacao(): Promise<EntregadorLocalizacao[]> {
    const response = await api.get('/dashboard/entregadores-localizacao')
    return response.data
  }

  // Entregadores
  static async getEntregadores(): Promise<Entregador[]> {
    const response = await api.get('/entregadores')
    return response.data
  }

  static async getEntregador(id: number): Promise<Entregador> {
    const response = await api.get(`/entregadores/${id}`)
    return response.data
  }

  static async createEntregador(data: Partial<Entregador>): Promise<Entregador> {
    const response = await api.post('/entregadores', data)
    return response.data
  }

  static async updateEntregador(id: number, data: Partial<Entregador>): Promise<Entregador> {
    const response = await api.put(`/entregadores/${id}`, data)
    return response.data
  }

  static async deleteEntregador(id: number): Promise<void> {
    await api.delete(`/entregadores/${id}`)
  }

  static async updateEntregadorLocation(id: number, location: { latitude: number, longitude: number }): Promise<void> {
    await api.post(`/entregadores/${id}/location`, location)
  }

  // Rotas
  static async getRotas(): Promise<Rota[]> {
    const response = await api.get('/rotas')
    return response.data
  }

  static async getRota(id: number): Promise<Rota> {
    const response = await api.get(`/rotas/${id}`)
    return response.data
  }

  static async createRota(data: Partial<Rota>): Promise<Rota> {
    const response = await api.post('/rotas', data)
    return response.data
  }

  static async updateRota(id: number, data: Partial<Rota>): Promise<Rota> {
    const response = await api.put(`/rotas/${id}`, data)
    return response.data
  }

  static async deleteRota(id: number): Promise<void> {
    await api.delete(`/rotas/${id}`)
  }

  static async iniciarRota(id: number): Promise<void> {
    await api.post(`/rotas/${id}/iniciar`)
  }

  static async finalizarRota(id: number): Promise<void> {
    await api.post(`/rotas/${id}/finalizar`)
  }

  // Entregas
  static async getEntregas(): Promise<Entrega[]> {
    const response = await api.get('/entregas')
    return response.data
  }

  static async getEntrega(id: number): Promise<Entrega> {
    const response = await api.get(`/entregas/${id}`)
    return response.data
  }

  static async createEntrega(data: Partial<Entrega>): Promise<Entrega> {
    const response = await api.post('/entregas', data)
    return response.data
  }

  static async updateEntrega(id: number, data: Partial<Entrega>): Promise<Entrega> {
    const response = await api.put(`/entregas/${id}`, data)
    return response.data
  }

  static async deleteEntrega(id: number): Promise<void> {
    await api.delete(`/entregas/${id}`)
  }

  static async marcarEntregaColetada(id: number): Promise<void> {
    await api.post(`/entregas/${id}/coletar`)
  }

  static async marcarEntregaEmTransito(id: number): Promise<void> {
    await api.post(`/entregas/${id}/transito`)
  }

  static async marcarEntregaEntregue(id: number): Promise<void> {
    await api.post(`/entregas/${id}/entregar`)
  }

  static async buscarEntregaPorCodigo(codigo: string): Promise<Entrega> {
    const response = await api.get(`/entregas/codigo/${codigo}`)
    return response.data
  }

  // Rastreamento
  static async trackDelivery(codigo: string): Promise<{
    entrega: Entrega
    entregador?: Entregador
  }> {
    const response = await api.get(`/tracking/${codigo}`)
    return response.data
  }
}

export default ApiService
