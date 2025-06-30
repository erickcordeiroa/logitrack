"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getRoutes, Route as RouteType } from "../lib/routeService"
import { EntregadorLocalizacao } from "../lib/apiService"
import { Route as RouteIcon, MapPin } from "lucide-react"

interface MapComponentProps {
  entregadores?: EntregadorLocalizacao[]
}

export function MapComponent({ entregadores = [] }: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const [routes, setRoutes] = useState<RouteType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    getRoutes()
      .then((data) => {
        setRoutes(data)
        setLoading(false)
      })
      .catch((err) => {
        setError("Erro ao carregar rotas")
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    if (loading || error) return
    if (typeof window !== "undefined" && mapRef.current && !mapInstanceRef.current) {
      import("leaflet").then((L) => {
        const leaflet = L.default || L
        
        // Adicionar CSS do Leaflet
        const link = document.createElement("link")
        link.rel = "stylesheet"
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        document.head.appendChild(link)

        // Centro do mapa em Registro-SP
        const map = leaflet.map(mapRef.current!).setView([-24.4971, -47.8449], 13)

        leaflet.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors",
        }).addTo(map)

        // Ícones para entregadores
        const createIcon = (color: string, size: number = 16, pulse: boolean = false) => {
          return leaflet.divIcon({
            html: `<div style="background-color: ${color}; width: ${size}px; height: ${size}px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);${pulse ? ' animation: pulse 2s infinite;' : ''}"><div style="width: ${size/3}px; height: ${size/3}px; background-color: white; border-radius: 50%; margin: ${size/4}px auto;"></div></div>`,
            iconSize: [size + 6, size + 6],
            className: "custom-div-icon",
          })
        }

        // Adicionar entregadores ao mapa
        entregadores.forEach((entregador) => {
          if (entregador.latitude && entregador.longitude) {
            let icon
            let statusText = 'Offline'
            
            if (entregador.status === 'online') {
              icon = createIcon('#10b981', 16) // Verde
              statusText = 'Online'
            } else if (entregador.status === 'em_entrega') {
              icon = createIcon('#3b82f6', 16, true) // Azul com animação
              statusText = 'Em Entrega'
            } else {
              icon = createIcon('#6b7280', 14) // Cinza
            }

            leaflet.marker([entregador.latitude, entregador.longitude], { icon })
              .addTo(map)
              .bindPopup(`
                <div>
                  <h3 style="margin: 0; font-weight: bold;">${entregador.nome}</h3>
                  <p style="margin: 4px 0; color: #666;">Status: ${statusText}</p>
                  <p style="margin: 4px 0; color: #666;">Veículo: ${entregador.veiculo_tipo}</p>
                  ${entregador.ultima_localizacao ? 
                    `<p style="margin: 4px 0; color: #999; font-size: 12px;">Última atualização: ${new Date(entregador.ultima_localizacao).toLocaleTimeString()}</p>` : 
                    ''
                  }
                </div>
              `)
          }
        })

        // Adicionar pontos das rotas
        routes.forEach((route) => {
          if (route.stops.length === 0) return

          route.stops.forEach((stop, index) => {
            let color = '#6b7280'
            
            if (stop.status === 'completed') {
              color = '#10b981'
            } else if (stop.status === 'current') {
              color = '#f59e0b'
            }

            const stopIcon = leaflet.divIcon({
              html: `<div style="background-color: ${color}; width: 10px; height: 10px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></div>`,
              iconSize: [14, 14],
              className: "custom-div-icon",
            })

            leaflet.marker([stop.lat, stop.lng], { icon: stopIcon })
              .addTo(map)
              .bindPopup(`
                <div>
                  <h4 style="margin: 0;">Parada ${stop.order}</h4>
                  <p style="margin: 4px 0;">Entregador: ${route.deliverer}</p>
                  <p style="margin: 4px 0;">Status: ${stop.status === 'completed' ? 'Concluída' : stop.status === 'current' ? 'Atual' : 'Pendente'}</p>
                </div>
              `)
          })
        })

        mapInstanceRef.current = map

        // Adicionar CSS para animação
        const style = document.createElement('style')
        style.textContent = `
          @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.1); opacity: 0.7; }
            100% { transform: scale(1); opacity: 1; }
          }
        `
        document.head.appendChild(style)
      })
    }
  }, [loading, error, routes, entregadores])

  if (loading) {
    return (
      <Card className="h-96">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RouteIcon className="h-5 w-5" />
            Mapa de Entregas
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando mapa...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="h-96">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RouteIcon className="h-5 w-5" />
            Mapa de Entregas
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-96">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RouteIcon className="h-5 w-5" />
          Mapa de Entregas
          <span className="ml-auto text-sm font-normal text-gray-600">
            {entregadores.length} entregadores • {routes.length} rotas
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div ref={mapRef} className="w-full h-80 rounded-b-lg" />
      </CardContent>
    </Card>
  )
}
