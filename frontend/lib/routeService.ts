import ApiService, { Rota, Entrega } from './apiService'

export type Stop = {
  lat: number
  lng: number
  status: 'completed' | 'current' | 'pending'
  order: number
  entrega?: Entrega
}

export type Route = {
  id: string
  deliverer: string
  status: string
  hasProblem: boolean
  totalDeliveries: number
  completedDeliveries: number
  currentStop: number | null
  estimatedCompletion: string
  stops: Stop[]
  rota?: Rota
}

// Função para converter dados da API para o formato usado no frontend
function convertRotaToRoute(rota: Rota): Route {
  const stops: Stop[] = rota.entregas?.map((entrega, index) => ({
    lat: entrega.destino_latitude,
    lng: entrega.destino_longitude,
    status: entrega.status === 'entregue' ? 'completed' : 
            entrega.status === 'em_transito' ? 'current' : 'pending',
    order: entrega.ordem_na_rota,
    entrega
  })) || []

  const currentStopIndex = stops.findIndex(stop => stop.status === 'current')
  
  return {
    id: rota.id.toString(),
    deliverer: rota.entregador?.nome || 'Sem entregador',
    status: rota.status === 'em_andamento' ? 'in_progress' : rota.status,
    hasProblem: false, // Pode ser calculado baseado em atrasos ou outras métricas
    totalDeliveries: rota.entregas?.length || 0,
    completedDeliveries: rota.entregas_concluidas,
    currentStop: currentStopIndex >= 0 ? currentStopIndex : null,
    estimatedCompletion: rota.hora_fim || '18:00', // Pode ser calculado dinamicamente
    stops,
    rota
  }
}

// Função principal para buscar rotas - agora usa a API real
export async function getRoutes(): Promise<Route[]> {
  try {
    const rotas = await ApiService.getRotas()
    return rotas.map(convertRotaToRoute)
  } catch (error) {
    console.error('Erro ao buscar rotas:', error)
    // Fallback para dados mock em caso de erro
    return getMockRoutes()
  }
}

// Buscar uma rota específica
export async function getRoute(id: string): Promise<Route | null> {
  try {
    const rota = await ApiService.getRota(parseInt(id))
    return convertRotaToRoute(rota)
  } catch (error) {
    console.error('Erro ao buscar rota:', error)
    return null
  }
}

// Função para dados mock (mantida como fallback)
function getMockRoutes(): Route[] {
  return [
    {
      id: "ROTA001",
      deliverer: "João Silva",
      status: "in_progress",
      hasProblem: false,
      totalDeliveries: 8,
      completedDeliveries: 3,
      currentStop: 1,
      estimatedCompletion: "16:30",
      stops: [
        { lat: -24.4950, lng: -47.8420, status: "completed", order: 1 },
        { lat: -24.4960, lng: -47.8430, status: "completed", order: 2 },
        { lat: -24.4970, lng: -47.8440, status: "current", order: 3 },
        { lat: -24.4980, lng: -47.8450, status: "pending", order: 4 },
        { lat: -24.4990, lng: -47.8460, status: "pending", order: 5 },
        { lat: -24.5000, lng: -47.8470, status: "pending", order: 6 },
        { lat: -24.5010, lng: -47.8480, status: "pending", order: 7 },
        { lat: -24.5020, lng: -47.8490, status: "pending", order: 8 },
      ],
    },
    {
      id: "ROTA002",
      deliverer: "Maria Santos",
      status: "in_progress",
      hasProblem: true,
      totalDeliveries: 5,
      completedDeliveries: 2,
      currentStop: 1,
      estimatedCompletion: "17:00",
      stops: [
        { lat: -24.5070, lng: -47.8540, status: "completed", order: 1 },
        { lat: -24.5080, lng: -47.8550, status: "current", order: 2 },
        { lat: -24.5090, lng: -47.8560, status: "pending", order: 3 },
        { lat: -24.5100, lng: -47.8570, status: "pending", order: 4 },
        { lat: -24.5110, lng: -47.8580, status: "pending", order: 5 },
      ],
    },
  ]
} 