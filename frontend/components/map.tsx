"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getRoutes, Route as RouteType } from "../lib/routeService"
import { Route as RouteIcon } from "lucide-react"

export function MapComponent() {
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
    if (loading || error || routes.length === 0) return
    if (typeof window !== "undefined" && mapRef.current && !mapInstanceRef.current) {
      import("leaflet").then((L) => {
        import("leaflet-routing-machine").then(() => {
          const leaflet = L.default || L
          const link = document.createElement("link")
          link.rel = "stylesheet"
          link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          document.head.appendChild(link)

          const map = leaflet.map(mapRef.current!).setView([-24.4971, -47.8449], 15)

          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "© OpenStreetMap contributors",
          }).addTo(map)

          // Ícones para diferentes status de entrega
          const completedIcon = L.divIcon({
            html: '<div style="background-color: #10b981; width: 8px; height: 8px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></div>',
            iconSize: [12, 12],
            className: "custom-div-icon",
          })

          const currentIcon = L.divIcon({
            html: '<div style="background-color: #f59e0b; width: 12px; height: 12px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3); animation: pulse 2s infinite;"></div>',
            iconSize: [18, 18],
            className: "custom-div-icon",
          })

          const pendingIcon = L.divIcon({
            html: '<div style="background-color: #6b7280; width: 6px; height: 6px; border-radius: 50%; border: 2px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.2);"></div>',
            iconSize: [10, 10],
            className: "custom-div-icon",
          })

          // Ícone normal do entregador
          const delivererIcon = L.divIcon({
            html: '<div style="background-color: #3b82f6; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"><div style="width: 6px; height: 6px; background-color: white; border-radius: 50%; margin: 2px auto;"></div></div>',
            iconSize: [22, 22],
            className: "custom-div-icon",
          })

          // Ícone de problema (vermelho e animado)
          const problemIcon = L.divIcon({
            html: '<div style="background-color: #dc2626; width: 18px; height: 18px; border-radius: 50%; border: 3px solid #fff; box-shadow: 0 2px 8px rgba(220,38,38,0.5); animation: pulse 1s infinite;"></div>',
            iconSize: [24, 24],
            className: "custom-div-icon",
          })

          // Processar cada rota
          routes.forEach((route) => {
            if (route.stops.length === 0) return

            // Criar array de coordenadas para a rota
            const waypoints = route.stops.map((stop) => L.latLng(stop.lat, stop.lng))

            // Desenhar a rota real pelas ruas usando Routing Machine
            const routingControl = leaflet.Routing.control({
              waypoints,
              lineOptions: {
                styles: [{ color: route.status === "completed" ? "#10b981" : "#3b82f6", weight: 4 }],
              },
              addWaypoints: false,
              draggableWaypoints: false,
              fitSelectedRoutes: false,
              createMarker: () => null, // Não cria marcadores automáticos
              routeWhileDragging: false,
            }).addTo(map)

            // Esconde todos os painéis de instruções
            document.querySelectorAll('.leaflet-routing-container').forEach((el) => {
              (el as HTMLElement).style.display = 'none'
            })

            // Adicionar marcadores para cada parada
            route.stops.forEach((stop: any, index: number) => {
              let icon = pendingIcon
              if (stop.status === "completed") icon = completedIcon
              else if (stop.status === "current") icon = currentIcon

              const marker = leaflet.marker([stop.lat, stop.lng], { icon }).addTo(map)

              const statusText =
                stop.status === "completed" ? "Entregue" : stop.status === "current" ? "Atual" : "Pendente"

              marker.bindPopup(`
                <div style="font-family: system-ui; padding: 4px; min-width: 200px;">
                  <strong>Parada ${stop.order}</strong><br>
                  <strong>Rota:</strong> ${route.id}<br>
                  <strong>Status:</strong> ${statusText}<br>
                  <strong>Entregador:</strong> ${route.deliverer}<br>
                  ${stop.status === "current" ? '<small style="color: #f59e0b;">📍 Localização atual</small>' : ""}
                </div>
              `)

              // Adicione estes eventos para mostrar o popup no hover
              marker.on("mouseover", function () {
                marker.openPopup()
              })
              marker.on("mouseout", function () {
                marker.closePopup()
              })

              // Adicionar número da parada
              const numberIcon = L.divIcon({
                html: `<div style="background-color: white; color: #374151; width: 20px; height: 20px; border-radius: 50%; border: 2px solid ${route.status === "completed" ? "#10b981" : "#3b82f6"}; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: bold; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">${stop.order}</div>`,
                iconSize: [24, 24],
                className: "custom-div-icon",
              })

              L.marker([stop.lat, stop.lng], {
                icon: numberIcon,
                zIndexOffset: 1000,
              }).addTo(map)
            })

            // --- ANIMAÇÃO DO ENTREGADOR SEGUINDO A ROTA REAL ---
            // Função para calcular distância entre dois pontos (Haversine)
            function getDistanceMeters(lat1: number, lng1: number, lat2: number, lng2: number) {
              const R = 6371000; // Raio da Terra em metros
              const toRad = (x: number) => x * Math.PI / 180;
              const dLat = toRad(lat2 - lat1);
              const dLng = toRad(lng2 - lng1);
              const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
                        Math.sin(dLng/2) * Math.sin(dLng/2);
              const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
              return R * c;
            }

            routingControl.on('routesfound', function(e: any) {
              const routeLine = e.routes[0].coordinates // array de {lat, lng}
              if (route.hasProblem) {
                // Entregador com problema: marker parado na primeira parada
                const marker = leaflet.marker([routeLine[0].lat, routeLine[0].lng], {
                  icon: problemIcon,
                  zIndexOffset: 2000,
                }).addTo(map)
                marker.bindPopup(`
                  <div style="font-family: system-ui; color: #dc2626;">
                    <strong>⚠️ Problema detectado!</strong><br>
                    Entregador: ${route.deliverer}<br>
                    Status: Parado/Atrasado
                  </div>
                `).openPopup()
                return
              }
              // Entregador normal: animar ao longo do polyline
              let idx = 0
              const marker = leaflet.marker([routeLine[0].lat, routeLine[0].lng], {
                icon: delivererIcon,
                zIndexOffset: 2000,
              }).addTo(map)
              const velocidadeMS = 8.33; // 30 km/h em m/s
              function move() {
                if (idx < routeLine.length - 1) {
                  marker.setLatLng([routeLine[idx].lat, routeLine[idx].lng])
                  const atual = routeLine[idx]
                  const prox = routeLine[idx + 1]
                  const dist = getDistanceMeters(atual.lat, atual.lng, prox.lat, prox.lng)
                  const tempo = (dist / velocidadeMS) * 1000 // tempo em ms
                  idx++
                  setTimeout(move, tempo)
                } else {
                  idx = 0 // loop: volta ao início
                  setTimeout(move, 5000)
                }
              }
              move()
            })
            // --- FIM ANIMAÇÃO DO ENTREGADOR ---
          })

          mapInstanceRef.current = map

          return () => {
            if (mapInstanceRef.current) {
              mapInstanceRef.current.remove()
              mapInstanceRef.current = null
            }
          }
        })
      })
    }
  }, [routes, loading, error])

  if (loading) return <div>Carregando rotas...</div>
  if (error) return <div>{error}</div>

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RouteIcon className="h-5 w-5" />
          Rotas de Entrega em Tempo Real
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div ref={mapRef} className="w-full h-96 rounded-lg border border-gray-200" style={{ minHeight: "400px" }} />
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">Entregas concluídas</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-gray-600">Parada atual</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
            <span className="text-gray-600">Entregas pendentes</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>
            <span className="text-gray-600">Entregadores</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
