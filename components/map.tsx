"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Route } from "lucide-react"

// Dados das rotas com múltiplas entregas
const routes = [
  {
    id: "ROTA001",
    deliverer: "João Silva",
    status: "in_progress",
    totalDeliveries: 24,
    completedDeliveries: 8,
    currentStop: 9,
    estimatedCompletion: "16:30",
    stops: [
      { lat: -24.4950, lng: -47.8420, status: "completed", order: 1 },
      { lat: -24.4960, lng: -47.8430, status: "completed", order: 2 },
      { lat: -24.4970, lng: -47.8440, status: "completed", order: 3 },
      { lat: -24.4980, lng: -47.8450, status: "completed", order: 4 },
      { lat: -24.4990, lng: -47.8460, status: "completed", order: 5 },
      { lat: -24.5000, lng: -47.8470, status: "completed", order: 6 },
      { lat: -24.5010, lng: -47.8480, status: "completed", order: 7 },
      { lat: -24.5020, lng: -47.8490, status: "completed", order: 8 },
      { lat: -24.5030, lng: -47.8500, status: "current", order: 9 },
      { lat: -24.5040, lng: -47.8510, status: "pending", order: 10 },
      { lat: -24.5050, lng: -47.8520, status: "pending", order: 11 },
      { lat: -24.5060, lng: -47.8530, status: "pending", order: 12 },
    ],
  },
  {
    id: "ROTA002",
    deliverer: "Maria Santos",
    status: "completed",
    totalDeliveries: 18,
    completedDeliveries: 18,
    currentStop: null,
    estimatedCompletion: "Concluída",
    stops: [
      { lat: -24.5070, lng: -47.8540, status: "completed", order: 1 },
      { lat: -24.5080, lng: -47.8550, status: "completed", order: 2 },
      { lat: -24.5090, lng: -47.8560, status: "completed", order: 3 },
    ],
  },
]

export function MapComponent() {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)

  useEffect(() => {
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

          const delivererIcon = L.divIcon({
            html: '<div style="background-color: #3b82f6; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"><div style="width: 6px; height: 6px; background-color: white; border-radius: 50%; margin: 2px auto;"></div></div>',
            iconSize: [22, 22],
            className: "custom-div-icon",
          })

          // Processar cada rota
          routes.forEach((route) => {
            if (route.stops.length === 0) return

            // Criar array de coordenadas para a rota
            const waypoints = route.stops.map((stop) => L.latLng(stop.lat, stop.lng))

            // Desenhar a rota real pelas ruas usando Routing Machine
            leaflet.Routing.control({
              waypoints,
              lineOptions: {
                styles: [{ color: route.status === "completed" ? "#10b981" : "#3b82f6", weight: 4 }],
              },
              addWaypoints: false,
              draggableWaypoints: false,
              fitSelectedRoutes: false,
              createMarker: () => null,
              routeWhileDragging:false,
            }).addTo(map)

            document.querySelectorAll('.leaflet-routing-container').forEach((el) => {
              (el as HTMLElement).style.display = 'none'
            })

            // Adicionar marcadores para cada parada
            route.stops.forEach((stop, index) => {
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
                  <strong>Endereço:</strong> ${stop.address}<br>
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

            // Adicionar marcador do entregador na posição atual
            if (route.status === "in_progress" && route.currentStop) {
              const currentStopData = route.stops.find((s) => s.order === route.currentStop)
              if (currentStopData) {
                const delivererMarker = L.marker([currentStopData.lat, currentStopData.lng], {
                  icon: delivererIcon,
                  zIndexOffset: 2000,
                }).addTo(map)

                delivererMarker.bindPopup(`
                  <div style="font-family: system-ui; padding: 4px;">
                    <strong>🚚 ${route.deliverer}</strong><br>
                    Rota: ${route.id}<br>
                    Progresso: ${route.completedDeliveries}/${route.totalDeliveries}<br>
                    Previsão: ${route.estimatedCompletion}<br>
                    <small>Parada atual: ${route.currentStop}</small>
                  </div>
                `)
              }
            }
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
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Route className="h-5 w-5" />
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
