"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapComponent } from "@/components/map"
import { Package, Clock, TrendingUp, AlertTriangle, CheckCircle, Navigation, Users, Bell, Route } from "lucide-react"
import ApiService, { DashboardStats, EntregadorLocalizacao } from "@/lib/apiService"

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [entregadores, setEntregadores] = useState<EntregadorLocalizacao[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [statsData, entregadoresData] = await Promise.all([
          ApiService.getDashboardStats(),
          ApiService.getEntregadoresLocalizacao()
        ])
        
        setStats(statsData)
        setEntregadores(entregadoresData)
        setError(null)
      } catch (err) {
        console.error('Erro ao carregar dados do dashboard:', err)
        setError('Erro ao carregar dados. Usando dados de exemplo.')
        // Usar dados mock em caso de erro
        setStats({
          entregadores_ativos: 12,
          rotas_hoje: 8,
          entregas_pendentes: 24,
          entregas_entregues: 156
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    // Atualizar dados a cada 30 segundos
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Visão geral do sistema de logística</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className={`${error ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
            <div className={`w-2 h-2 ${error ? 'bg-yellow-500' : 'bg-green-500'} rounded-full mr-2 animate-pulse`}></div>
            {error ? 'Modo Offline' : 'Sistema Online'}
          </Badge>
        </div>
      </div>

      {error && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <span className="text-sm text-yellow-800">{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Entregadores Ativos</p>
                <p className="text-2xl font-bold">{stats?.entregadores_ativos || 0}</p>
                <p className="text-xs text-green-600 mt-1">Em operação</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rotas Hoje</p>
                <p className="text-2xl font-bold">{stats?.rotas_hoje || 0}</p>
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
                <p className="text-sm font-medium text-gray-600">Entregas Pendentes</p>
                <p className="text-2xl font-bold">{stats?.entregas_pendentes || 0}</p>
                <p className="text-xs text-orange-600 mt-1">Aguardando</p>
              </div>
              <Package className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Entregas Concluídas</p>
                <p className="text-2xl font-bold">{stats?.entregas_entregues || 0}</p>
                <p className="text-xs text-purple-600 mt-1">Hoje</p>
              </div>
              <CheckCircle className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mapa */}
        <div className="lg:col-span-2">
          <MapComponent entregadores={entregadores} />
        </div>

        {/* Entregadores Ativos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="h-5 w-5" />
              Entregadores Ativos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {entregadores.length > 0 ? (
              entregadores.slice(0, 5).map((entregador) => (
                <div key={entregador.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{entregador.nome}</p>
                    <p className="text-xs text-gray-600">{entregador.veiculo_tipo}</p>
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${
                      entregador.status === 'online' ? 'bg-green-100 text-green-800' :
                      entregador.status === 'em_entrega' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {entregador.status === 'online' ? 'Online' :
                     entregador.status === 'em_entrega' ? 'Em Entrega' :
                     entregador.status === 'offline' ? 'Offline' : 'Inativo'}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Nenhum entregador ativo</p>
              </div>
            )}
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
                <span className="font-medium">{stats?.entregas_entregues || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Pendentes</span>
                <span className="font-medium">{stats?.entregas_pendentes || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total</span>
                <span className="font-medium">{(stats?.entregas_entregues || 0) + (stats?.entregas_pendentes || 0)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ 
                    width: `${stats ? ((stats.entregas_entregues / (stats.entregas_entregues + stats.entregas_pendentes)) * 100) : 0}%` 
                  }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 text-center">
                {stats ? Math.round((stats.entregas_entregues / (stats.entregas_entregues + stats.entregas_pendentes)) * 100) : 0}% concluído
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Status dos Entregadores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Ativos</span>
                <span className="font-medium">{stats?.entregadores_ativos || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Online</span>
                <span className="font-medium">{entregadores.filter(e => e.status === 'online').length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Em Entrega</span>
                <span className="font-medium">{entregadores.filter(e => e.status === 'em_entrega').length}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Rotas Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total</span>
                <span className="font-medium">{stats?.rotas_hoje || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Em Andamento</span>
                <span className="font-medium">-</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Concluídas</span>
                <span className="font-medium">-</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
            