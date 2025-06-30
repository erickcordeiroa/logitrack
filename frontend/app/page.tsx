"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapComponent } from "@/components/map"
import { Package, Clock, TrendingUp, AlertTriangle, CheckCircle, Navigation, Users, Bell, Route } from "lucide-react"

const metrics = {
  totalDeliveries: 342,
  activeRoutes: 8,
  avgDeliveryTime: "28 min",
  onTimeRate: "94%",
}

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Visão geral do sistema de logística</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            Sistema Online
          </Badge>
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Entregas</p>
                <p className="text-2xl font-bold">{metrics.totalDeliveries}</p>
                <p className="text-xs text-green-600 mt-1">+12% vs ontem</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rotas Ativas</p>
                <p className="text-2xl font-bold">{metrics.activeRoutes}</p>
                <p className="text-xs text-blue-600 mt-1">Em tempo real</p>
              </div>
              <Route className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tempo Médio</p>
                <p className="text-2xl font-bold">{metrics.avgDeliveryTime}</p>
                <p className="text-xs text-orange-600 mt-1">-3 min vs média</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taxa de Pontualidade</p>
                <p className="text-2xl font-bold">{metrics.onTimeRate}</p>
                <p className="text-xs text-purple-600 mt-1">Meta: 95%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mapa */}
        <div className="lg:col-span-2">
          <MapComponent />
        </div>

        {/* Alertas e Notificações */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Alertas Recentes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <p className="font-medium text-red-800">Atraso Crítico</p>
                <p className="text-sm text-red-600">Pedido PED001 - 15 min de atraso</p>
                <p className="text-xs text-red-500 mt-1">há 2 minutos</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-800">Trânsito Intenso</p>
                <p className="text-sm text-yellow-600">Rota Centro - Zona Sul congestionada</p>
                <p className="text-xs text-yellow-500 mt-1">há 5 minutos</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-green-800">Entrega Concluída</p>
                <p className="text-sm text-green-600">Pedido PED003 entregue com sucesso</p>
                <p className="text-xs text-green-500 mt-1">há 8 minutos</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <Navigation className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-800">Rota Otimizada</p>
                <p className="text-sm text-blue-600">Nova rota calculada para João Silva</p>
                <p className="text-xs text-blue-500 mt-1">há 12 minutos</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <Users className="h-5 w-5 text-gray-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-800">Entregador Disponível</p>
                <p className="text-sm text-gray-600">Maria Santos aguardando pedidos</p>
                <p className="text-xs text-gray-500 mt-1">há 15 minutos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resumo de Performance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Entregas Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Concluídas</span>
                <span className="font-medium">89</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Em andamento</span>
                <span className="font-medium">23</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Pendentes</span>
                <span className="font-medium">44</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: "57%" }}></div>
              </div>
              <p className="text-xs text-gray-500 text-center">57% concluído</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Entregadores Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Disponíveis</span>
                <span className="font-medium text-green-600">8</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Em rota</span>
                <span className="font-medium text-blue-600">15</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Offline</span>
                <span className="font-medium text-gray-600">3</span>
              </div>
              <div className="mt-3 text-center">
                <span className="text-2xl font-bold">26</span>
                <p className="text-xs text-gray-500">Total de entregadores</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Eficiência</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Pontualidade</span>
                  <span className="font-medium">94%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: "94%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Satisfação</span>
                  <span className="font-medium">4.8/5</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "96%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Otimização</span>
                  <span className="font-medium">87%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: "87%" }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
