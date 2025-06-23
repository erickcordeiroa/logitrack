"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Route, Search, Eye, Phone, MapPin, Clock, User, Package, TrendingUp } from "lucide-react"

const routes = [
  {
    id: "ROTA001",
    deliverer: "João Silva",
    vehicle: "Caminhão Mercedes 1016",
    status: "in_progress",
    totalDeliveries: 24,
    completedDeliveries: 8,
    currentStop: 9,
    startTime: "08:00",
    estimatedCompletion: "16:30",
    actualTime: "14:25",
    region: "Zona Norte",
    totalDistance: "85 km",
    completedDistance: "28 km",
    priority: "high",
    stops: [
      { address: "Rua das Flores, 123 - Vila Madalena", status: "completed", time: "08:15" },
      { address: "Av. Paulista, 456 - Bela Vista", status: "completed", time: "08:45" },
      { address: "Rua Augusta, 789 - Consolação", status: "completed", time: "09:20" },
      { address: "Rua Oscar Freire, 321 - Jardins", status: "current", time: "14:25" },
      { address: "Av. Faria Lima, 654 - Itaim", status: "pending", time: "15:00" },
    ],
  },
  {
    id: "ROTA002",
    deliverer: "Maria Santos",
    vehicle: "Van Iveco Daily",
    status: "completed",
    totalDeliveries: 18,
    completedDeliveries: 18,
    currentStop: null,
    startTime: "07:30",
    estimatedCompletion: "15:00",
    actualTime: "14:45",
    region: "Zona Sul",
    totalDistance: "62 km",
    completedDistance: "62 km",
    priority: "medium",
    stops: [],
  },
  {
    id: "ROTA003",
    deliverer: "Pedro Costa",
    vehicle: "Caminhão Ford Cargo",
    status: "pending",
    totalDeliveries: 32,
    completedDeliveries: 0,
    currentStop: null,
    startTime: "09:00",
    estimatedCompletion: "18:00",
    actualTime: null,
    region: "Zona Oeste",
    totalDistance: "120 km",
    completedDistance: "0 km",
    priority: "medium",
    stops: [],
  },
  {
    id: "ROTA004",
    deliverer: "Ana Oliveira",
    vehicle: "Van Renault Master",
    status: "in_progress",
    totalDeliveries: 15,
    completedDeliveries: 12,
    currentStop: 13,
    startTime: "08:30",
    estimatedCompletion: "15:30",
    actualTime: "14:10",
    region: "Centro",
    totalDistance: "45 km",
    completedDistance: "38 km",
    priority: "low",
    stops: [],
  },
  {
    id: "ROTA005",
    deliverer: "Carlos Mendes",
    vehicle: "Caminhão VW Delivery",
    status: "delayed",
    totalDeliveries: 28,
    completedDeliveries: 15,
    currentStop: 16,
    startTime: "07:45",
    estimatedCompletion: "16:00",
    actualTime: "14:30",
    region: "Zona Leste",
    totalDistance: "95 km",
    completedDistance: "52 km",
    priority: "high",
    stops: [],
  },
]

export default function RotasPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [regionFilter, setRegionFilter] = useState("all")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "in_progress":
        return "bg-blue-500"
      case "pending":
        return "bg-yellow-500"
      case "delayed":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Concluída"
      case "in_progress":
        return "Em Andamento"
      case "pending":
        return "Pendente"
      case "delayed":
        return "Atrasada"
      default:
        return "Desconhecido"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "secondary"
    }
  }

  const filteredRoutes = routes.filter((route) => {
    const matchesSearch =
      route.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.deliverer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.region.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || route.status === statusFilter
    const matchesRegion = regionFilter === "all" || route.region.includes(regionFilter)

    return matchesSearch && matchesStatus && matchesRegion
  })

  const statusCounts = {
    all: routes.length,
    pending: routes.filter((r) => r.status === "pending").length,
    in_progress: routes.filter((r) => r.status === "in_progress").length,
    completed: routes.filter((r) => r.status === "completed").length,
    delayed: routes.filter((r) => r.status === "delayed").length,
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rotas de Entrega</h1>
          <p className="text-gray-600">Gerencie e monitore todas as rotas de distribuição</p>
        </div>
        <Button>
          <Route className="h-4 w-4 mr-2" />
          Nova Rota
        </Button>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{statusCounts.all}</p>
              <p className="text-sm text-gray-600">Total</p>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{statusCounts.pending}</p>
              <p className="text-sm text-gray-600">Pendentes</p>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{statusCounts.in_progress}</p>
              <p className="text-sm text-gray-600">Em Andamento</p>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{statusCounts.completed}</p>
              <p className="text-sm text-gray-600">Concluídas</p>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{statusCounts.delayed}</p>
              <p className="text-sm text-gray-600">Atrasadas</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por ID, entregador ou região..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="pending">Pendentes</SelectItem>
                <SelectItem value="in_progress">Em Andamento</SelectItem>
                <SelectItem value="completed">Concluídas</SelectItem>
                <SelectItem value="delayed">Atrasadas</SelectItem>
              </SelectContent>
            </Select>

            <Select value={regionFilter} onValueChange={setRegionFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filtrar por região" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as regiões</SelectItem>
                <SelectItem value="Norte">Zona Norte</SelectItem>
                <SelectItem value="Sul">Zona Sul</SelectItem>
                <SelectItem value="Leste">Zona Leste</SelectItem>
                <SelectItem value="Oeste">Zona Oeste</SelectItem>
                <SelectItem value="Centro">Centro</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Routes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredRoutes.map((route) => {
          const progress = (route.completedDeliveries / route.totalDeliveries) * 100
          const distanceProgress =
            route.totalDistance !== "0 km"
              ? (Number.parseInt(route.completedDistance) / Number.parseInt(route.totalDistance)) * 100
              : 0

          return (
            <Card key={route.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold">
                      <Route className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{route.id}</h3>
                      <Badge className={`${getStatusColor(route.status)} text-white`}>
                        {getStatusText(route.status)}
                      </Badge>
                    </div>
                  </div>
                  <Badge variant={getPriorityColor(route.priority)}>
                    {route.priority === "high" ? "Alta" : route.priority === "medium" ? "Média" : "Baixa"}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Entregador e Veículo */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">{route.deliverer}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">{route.vehicle}</span>
                  </div>
                </div>

                {/* Progresso de Entregas */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Entregas</span>
                    <span className="font-medium">
                      {route.completedDeliveries}/{route.totalDeliveries}
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <div className="text-xs text-gray-500 text-center">{progress.toFixed(0)}% concluído</div>
                </div>

                {/* Progresso de Distância */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Distância</span>
                    <span className="font-medium">
                      {route.completedDistance} / {route.totalDistance}
                    </span>
                  </div>
                  <Progress value={distanceProgress} className="h-2" />
                </div>

                {/* Informações de Tempo */}
                <div className="grid grid-cols-2 gap-4 py-3 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500">Início</p>
                    <p className="font-medium">{route.startTime}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Previsão</p>
                    <p className="font-medium">{route.estimatedCompletion}</p>
                  </div>
                </div>

                {/* Região e Status Atual */}
                <div className="flex justify-between items-center text-sm py-2 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">{route.region}</span>
                  </div>
                  {route.currentStop && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span className="text-blue-600 font-medium">Parada {route.currentStop}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <Eye className="h-3 w-3 mr-1" />
                    Detalhes
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Phone className="h-3 w-3 mr-1" />
                    Contato
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    Rastrear
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

      {filteredRoutes.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Route className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma rota encontrada</h3>
            <p className="text-gray-500">Tente ajustar os filtros de busca</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
