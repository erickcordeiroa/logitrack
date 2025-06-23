"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Users, Search, Phone, MapPin, Star, TrendingUp, UserPlus } from "lucide-react"

const deliveryPersons = [
  {
    id: 1,
    name: "João Silva",
    phone: "(11) 99999-1111",
    status: "delivering",
    location: "Centro - São Paulo",
    currentOrders: 3,
    totalOrders: 156,
    rating: 4.8,
    joinDate: "Jan 2023",
    vehicle: "Moto Honda CG 160",
    avgDeliveryTime: "22 min",
    onTimeRate: "96%",
    earnings: "R$ 2.450,00",
  },
  {
    id: 2,
    name: "Maria Santos",
    phone: "(11) 99999-2222",
    status: "available",
    location: "Zona Sul - São Paulo",
    currentOrders: 0,
    totalOrders: 203,
    rating: 4.9,
    joinDate: "Mar 2023",
    vehicle: "Bicicleta Elétrica",
    avgDeliveryTime: "18 min",
    onTimeRate: "98%",
    earnings: "R$ 3.120,00",
  },
  {
    id: 3,
    name: "Pedro Costa",
    phone: "(11) 99999-3333",
    status: "delivering",
    location: "Zona Norte - São Paulo",
    currentOrders: 2,
    totalOrders: 89,
    rating: 4.7,
    joinDate: "Jun 2023",
    vehicle: "Moto Yamaha Factor",
    avgDeliveryTime: "25 min",
    onTimeRate: "94%",
    earnings: "R$ 1.890,00",
  },
  {
    id: 4,
    name: "Ana Oliveira",
    phone: "(11) 99999-4444",
    status: "offline",
    location: "Zona Oeste - São Paulo",
    currentOrders: 0,
    totalOrders: 134,
    rating: 4.6,
    joinDate: "Fev 2023",
    vehicle: "Moto Honda Bros",
    avgDeliveryTime: "28 min",
    onTimeRate: "92%",
    earnings: "R$ 2.180,00",
  },
  {
    id: 5,
    name: "Carlos Mendes",
    phone: "(11) 99999-5555",
    status: "available",
    location: "Centro - São Paulo",
    currentOrders: 0,
    totalOrders: 67,
    rating: 4.5,
    joinDate: "Ago 2023",
    vehicle: "Bicicleta",
    avgDeliveryTime: "30 min",
    onTimeRate: "89%",
    earnings: "R$ 1.340,00",
  },
  {
    id: 6,
    name: "Lucia Ferreira",
    phone: "(11) 99999-6666",
    status: "delivering",
    location: "Zona Sul - São Paulo",
    currentOrders: 1,
    totalOrders: 178,
    rating: 4.8,
    joinDate: "Abr 2023",
    vehicle: "Moto Honda PCX",
    avgDeliveryTime: "20 min",
    onTimeRate: "97%",
    earnings: "R$ 2.890,00",
  },
]

export default function EntregadoresPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const getPersonStatus = (status: string) => {
    switch (status) {
      case "available":
        return { text: "Disponível", color: "bg-green-500", textColor: "text-green-700", bgColor: "bg-green-50" }
      case "delivering":
        return { text: "Entregando", color: "bg-blue-500", textColor: "text-blue-700", bgColor: "bg-blue-50" }
      case "offline":
        return { text: "Offline", color: "bg-gray-500", textColor: "text-gray-700", bgColor: "bg-gray-50" }
      default:
        return { text: "Desconhecido", color: "bg-gray-500", textColor: "text-gray-700", bgColor: "bg-gray-50" }
    }
  }

  const filteredDeliverers = deliveryPersons.filter(
    (person) =>
      person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.vehicle.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const statusCounts = {
    total: deliveryPersons.length,
    available: deliveryPersons.filter((p) => p.status === "available").length,
    delivering: deliveryPersons.filter((p) => p.status === "delivering").length,
    offline: deliveryPersons.filter((p) => p.status === "offline").length,
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Entregadores</h1>
          <p className="text-gray-600">Gerencie sua equipe de entregadores</p>
        </div>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Adicionar Entregador
        </Button>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold">{statusCounts.total}</p>
              </div>
              <Users className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Disponíveis</p>
                <p className="text-2xl font-bold text-green-600">{statusCounts.available}</p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Entregando</p>
                <p className="text-2xl font-bold text-blue-600">{statusCounts.delivering}</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Offline</p>
                <p className="text-2xl font-bold text-gray-600">{statusCounts.offline}</p>
              </div>
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar entregador por nome, localização ou veículo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Deliverers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDeliverers.map((person) => {
          const statusInfo = getPersonStatus(person.status)
          return (
            <Card key={person.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                      {person.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{person.name}</h3>
                      <div
                        className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.textColor}`}
                      >
                        <div className={`w-2 h-2 rounded-full ${statusInfo.color}`}></div>
                        {statusInfo.text}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Contact & Location */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{person.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{person.location}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 py-3 border-t border-gray-100">
                  <div className="text-center">
                    <p className="text-lg font-bold text-blue-600">{person.currentOrders}</p>
                    <p className="text-xs text-gray-500">Pedidos Ativos</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-green-600">{person.totalOrders}</p>
                    <p className="text-xs text-gray-500">Total Entregas</p>
                  </div>
                </div>

                {/* Performance */}
                <div className="space-y-2 py-3 border-t border-gray-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Avaliação:</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="font-medium">{person.rating}</span>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tempo Médio:</span>
                    <span className="font-medium">{person.avgDeliveryTime}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Pontualidade:</span>
                    <span className="font-medium text-green-600">{person.onTimeRate}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Ganhos (mês):</span>
                    <span className="font-medium text-purple-600">{person.earnings}</span>
                  </div>
                </div>

                {/* Vehicle */}
                <div className="py-2 border-t border-gray-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Veículo:</span>
                    <span className="font-medium">{person.vehicle}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Desde:</span>
                    <span className="font-medium">{person.joinDate}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Phone className="h-3 w-3 mr-1" />
                    Ligar
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    Localizar
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Relatório
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredDeliverers.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum entregador encontrado</h3>
            <p className="text-gray-500">Tente ajustar os filtros de busca</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
