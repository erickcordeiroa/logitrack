"use client"

import { getRoutes, Route } from '../../lib/routeService'
import dynamic from 'next/dynamic'

const MapComponent = dynamic(() => import('../../components/map').then(mod => mod.MapComponent), { ssr: false })

const orders = [
  {
    id: "PED001",
    customer: "Carlos Mendes",
    phone: "(11) 99999-1234",
    address: "Rua das Flores, 123 - Centro",
    status: "in_transit",
    deliveryPerson: "João Silva",
    estimatedTime: "15 min",
    priority: "high",
    createdAt: "14:30",
    value: "R$ 45,90",
  },
  {
    id: "PED002",
    customer: "Lucia Ferreira",
    phone: "(11) 99999-5678",
    address: "Av. Paulista, 456 - Bela Vista",
    status: "preparing",
    deliveryPerson: null,
    estimatedTime: "30 min",
    priority: "medium",
    createdAt: "14:45",
    value: "R$ 32,50",
  },
  {
    id: "PED003",
    customer: "Roberto Lima",
    phone: "(11) 99999-9012",
    address: "Rua Augusta, 789 - Consolação",
    status: "delivered",
    deliveryPerson: "Pedro Costa",
    estimatedTime: "Entregue",
    priority: "low",
    createdAt: "13:15",
    value: "R$ 28,75",
  },
  {
    id: "PED004",
    customer: "Ana Silva",
    phone: "(11) 99999-3456",
    address: "Rua Oscar Freire, 321 - Jardins",
    status: "cancelled",
    deliveryPerson: null,
    estimatedTime: "Cancelado",
    priority: "medium",
    createdAt: "12:30",
    value: "R$ 55,20",
  },
  {
    id: "PED005",
    customer: "José Santos",
    phone: "(11) 99999-7890",
    address: "Av. Faria Lima, 654 - Itaim Bibi",
    status: "preparing",
    deliveryPerson: null,
    estimatedTime: "25 min",
    priority: "high",
    createdAt: "15:00",
    value: "R$ 67,40",
  },
]

export default async function EntregasPage() {
  const routes: Route[] = await getRoutes()
  return (
    <div className="p-4">
      <MapComponent routes={routes} />
    </div>
  )
}
