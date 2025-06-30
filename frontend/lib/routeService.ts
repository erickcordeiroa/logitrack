import axios from 'axios'

export type Stop = {
  lat: number
  lng: number
  status: 'completed' | 'current' | 'pending'
  order: number
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
}

// MOCK LOCAL PARA MVP
export async function getRoutes(): Promise<Route[]> {
  // Simula um delay de rede
  await new Promise((resolve) => setTimeout(resolve, 500))
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
      hasProblem: true, // Este entregador terá um problema
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