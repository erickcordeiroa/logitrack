"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Route, User, MapPin, CheckCircle, Calculator, Navigation, Plus, Trash2 } from "lucide-react"

export default function NovaRotaPage() {
  const [step, setStep] = useState(1)
  const [routeData, setRouteData] = useState({
    deliverer: "",
    vehicle: "",
    region: "",
    priority: "medium",
    startTime: "08:00",
    notes: "",
    stops: [{ address: "", complement: "", neighborhood: "", customer: "", phone: "" }],
    totalDistance: 0,
    estimatedTime: "",
    optimizedOrder: [],
  })

  const [routeCalculated, setRouteCalculated] = useState(false)

  const addStop = () => {
    setRouteData((prev) => ({
      ...prev,
      stops: [...prev.stops, { address: "", complement: "", neighborhood: "", customer: "", phone: "" }],
    }))
  }

  const removeStop = (index: number) => {
    if (routeData.stops.length > 1) {
      setRouteData((prev) => ({
        ...prev,
        stops: prev.stops.filter((_, i) => i !== index),
      }))
    }
  }

  const updateStop = (index: number, field: string, value: string) => {
    setRouteData((prev) => ({
      ...prev,
      stops: prev.stops.map((stop, i) => (i === index ? { ...stop, [field]: value } : stop)),
    }))
  }

  const calculateRoute = () => {
    // Simular otimização de rota
    setTimeout(() => {
      const optimizedOrder = routeData.stops.map((_, index) => index + 1).sort(() => Math.random() - 0.5)
      setRouteData((prev) => ({
        ...prev,
        totalDistance: routeData.stops.length * 3.5, // Simular distância
        estimatedTime: `${Math.ceil(routeData.stops.length * 0.5 + 2)} horas`,
        optimizedOrder,
      }))
      setRouteCalculated(true)
    }, 2000)
  }

  const createRoute = () => {
    alert(`Rota criada com sucesso! ${routeData.stops.length} paradas otimizadas.`)
    // Reset form
    setRouteData({
      deliverer: "",
      vehicle: "",
      region: "",
      priority: "medium",
      startTime: "08:00",
      notes: "",
      stops: [{ address: "", complement: "", neighborhood: "", customer: "", phone: "" }],
      totalDistance: 0,
      estimatedTime: "",
      optimizedOrder: [],
    })
    setStep(1)
    setRouteCalculated(false)
  }

  const availableDeliverers = [
    { id: 1, name: "João Silva", vehicle: "Caminhão Mercedes 1016" },
    { id: 2, name: "Maria Santos", vehicle: "Van Iveco Daily" },
    { id: 3, name: "Pedro Costa", vehicle: "Caminhão Ford Cargo" },
    { id: 4, name: "Ana Oliveira", vehicle: "Van Renault Master" },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Criar Nova Rota</h1>
          <p className="text-gray-600">Configure uma rota de distribuição com múltiplas paradas</p>
        </div>
        <Badge variant="outline" className="text-sm">
          Passo {step} de 3
        </Badge>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        <div className={`flex items-center ${step >= 1 ? "text-blue-600" : "text-gray-400"}`}>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            1
          </div>
          <span className="ml-2 font-medium">Configuração da Rota</span>
        </div>

        <div className={`w-16 h-0.5 ${step >= 2 ? "bg-blue-600" : "bg-gray-200"}`}></div>

        <div className={`flex items-center ${step >= 2 ? "text-blue-600" : "text-gray-400"}`}>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            2
          </div>
          <span className="ml-2 font-medium">Paradas de Entrega</span>
        </div>

        <div className={`w-16 h-0.5 ${step >= 3 ? "bg-blue-600" : "bg-gray-200"}`}></div>

        <div className={`flex items-center ${step >= 3 ? "text-blue-600" : "text-gray-400"}`}>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            3
          </div>
          <span className="ml-2 font-medium">Otimização e Confirmação</span>
        </div>
      </div>

      {/* Step 1: Route Configuration */}
      {step === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Entregador e Veículo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="deliverer">Entregador *</Label>
                <Select
                  value={routeData.deliverer}
                  onValueChange={(value) => {
                    const selected = availableDeliverers.find((d) => d.name === value)
                    setRouteData((prev) => ({
                      ...prev,
                      deliverer: value,
                      vehicle: selected?.vehicle || "",
                    }))
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o entregador" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableDeliverers.map((deliverer) => (
                      <SelectItem key={deliverer.id} value={deliverer.name}>
                        {deliverer.name} - {deliverer.vehicle}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="vehicle">Veículo</Label>
                <Input
                  id="vehicle"
                  value={routeData.vehicle}
                  readOnly
                  placeholder="Será preenchido automaticamente"
                  className="bg-gray-50"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Configurações da Rota
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="region">Região *</Label>
                  <Select
                    value={routeData.region}
                    onValueChange={(value) => setRouteData((prev) => ({ ...prev, region: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a região" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="zona-norte">Zona Norte</SelectItem>
                      <SelectItem value="zona-sul">Zona Sul</SelectItem>
                      <SelectItem value="zona-leste">Zona Leste</SelectItem>
                      <SelectItem value="zona-oeste">Zona Oeste</SelectItem>
                      <SelectItem value="centro">Centro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startTime">Horário de Início</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={routeData.startTime}
                    onChange={(e) => setRouteData((prev) => ({ ...prev, startTime: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Prioridade</Label>
                <Select
                  value={routeData.priority}
                  onValueChange={(value) => setRouteData((prev) => ({ ...prev, priority: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baixa</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  value={routeData.notes}
                  onChange={(e) => setRouteData((prev) => ({ ...prev, notes: e.target.value }))}
                  placeholder="Instruções especiais para a rota..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <div className="lg:col-span-2 flex justify-end">
            <Button onClick={() => setStep(2)} disabled={!routeData.deliverer || !routeData.region}>
              Próximo: Adicionar Paradas
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Delivery Stops */}
      {step === 2 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Paradas de Entrega ({routeData.stops.length})
                </div>
                <Button onClick={addStop} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Parada
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {routeData.stops.map((stop, index) => (
                <Card key={index} className="border-l-4 border-l-blue-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Parada {index + 1}</h3>
                      {routeData.stops.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeStop(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Nome do Cliente *</Label>
                        <Input
                          value={stop.customer}
                          onChange={(e) => updateStop(index, "customer", e.target.value)}
                          placeholder="Nome do cliente"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Telefone</Label>
                        <Input
                          value={stop.phone}
                          onChange={(e) => updateStop(index, "phone", e.target.value)}
                          placeholder="(11) 99999-9999"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Endereço *</Label>
                      <Input
                        value={stop.address}
                        onChange={(e) => updateStop(index, "address", e.target.value)}
                        placeholder="Rua, Avenida, número"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Complemento</Label>
                        <Input
                          value={stop.complement}
                          onChange={(e) => updateStop(index, "complement", e.target.value)}
                          placeholder="Apto, bloco, etc."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Bairro *</Label>
                        <Input
                          value={stop.neighborhood}
                          onChange={(e) => updateStop(index, "neighborhood", e.target.value)}
                          placeholder="Nome do bairro"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(1)}>
              Voltar
            </Button>
            <Button
              onClick={() => setStep(3)}
              disabled={routeData.stops.some((stop) => !stop.customer || !stop.address || !stop.neighborhood)}
            >
              Próximo: Otimizar Rota
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Route Optimization */}
      {step === 3 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Navigation className="h-5 w-5" />
                Otimização da Rota
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!routeCalculated ? (
                <div className="text-center py-8">
                  <Button onClick={calculateRoute} size="lg">
                    <Calculator className="h-5 w-5 mr-2" />
                    Calcular Rota Otimizada
                  </Button>
                  <p className="text-sm text-gray-500 mt-2">Isso pode levar alguns segundos...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-green-800">Rota Otimizada</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Total de Paradas:</span>
                        <span className="font-medium ml-2">{routeData.stops.length}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Distância Total:</span>
                        <span className="font-medium ml-2">{routeData.totalDistance} km</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Tempo Estimado:</span>
                        <span className="font-medium ml-2">{routeData.estimatedTime}</span>
                      </div>
                    </div>
                  </div>

                  {/* Route Summary */}
                  <div>
                    <h3 className="font-semibold mb-4">Resumo da Rota</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h4 className="font-medium border-b pb-2">Configuração</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Entregador:</span>
                            <span className="font-medium">{routeData.deliverer}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Veículo:</span>
                            <span className="font-medium">{routeData.vehicle}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Região:</span>
                            <span className="font-medium">{routeData.region}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Início:</span>
                            <span className="font-medium">{routeData.startTime}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-medium border-b pb-2">Sequência Otimizada</h4>
                        <div className="space-y-2 text-sm max-h-48 overflow-y-auto">
                          {routeData.optimizedOrder.map((order, index) => {
                            const stop = routeData.stops[order - 1]
                            return (
                              <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                  {index + 1}
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium">{stop.customer}</p>
                                  <p className="text-gray-600 text-xs">{stop.address}</p>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(2)}>
              Voltar
            </Button>
            {routeCalculated && (
              <Button onClick={createRoute} className="bg-green-600 hover:bg-green-700">
                <Route className="h-4 w-4 mr-2" />
                Criar Rota
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
