import { Delivery, Coordinates, RouteStep } from '../types';
import { LocationService } from '../services/location';

export class RouteOptimizer {
  // Otimizar rota usando algoritmo de vizinho mais próximo
  static optimizeRoute(
    deliveries: Delivery[],
    startLocation: Coordinates
  ): RouteStep[] {
    const unvisited = [...deliveries];
    const route: RouteStep[] = [];
    let currentLocation = startLocation;
    let order = 1;

    while (unvisited.length > 0) {
      let nearestDelivery: Delivery | null = null;
      let shortestDistance = Infinity;
      let nearestIndex = -1;

      // Encontrar a entrega mais próxima
      unvisited.forEach((delivery, index) => {
        const distance = LocationService.calculateDistance(
          currentLocation,
          { latitude: delivery.latitude, longitude: delivery.longitude }
        );

        // Considerar prioridade na decisão
        const priorityWeight = this.getPriorityWeight(delivery.priority);
        const adjustedDistance = distance / priorityWeight;

        if (adjustedDistance < shortestDistance) {
          shortestDistance = distance;
          nearestDelivery = delivery;
          nearestIndex = index;
        }
      });

      if (nearestDelivery) {
        // Adicionar à rota
        route.push({
          delivery: nearestDelivery,
          distance: shortestDistance,
          duration: this.estimateDuration(shortestDistance),
          order,
        });

        // Atualizar localização atual
        currentLocation = {
          latitude: nearestDelivery.latitude,
          longitude: nearestDelivery.longitude,
        };

        // Remover da lista de não visitados
        unvisited.splice(nearestIndex, 1);
        order++;
      }
    }

    return route;
  }

  // Obter peso da prioridade para otimização
  private static getPriorityWeight(priority: Delivery['priority']): number {
    switch (priority) {
      case 'high':
        return 1.5; // Prioridade alta reduz distância efetiva
      case 'medium':
        return 1.0;
      case 'low':
        return 0.8;
      default:
        return 1.0;
    }
  }

  // Estimar duração baseada na distância
  private static estimateDuration(distanceKm: number): number {
    // Assumindo velocidade média de 30 km/h na cidade
    const averageSpeedKmh = 30;
    const durationHours = distanceKm / averageSpeedKmh;
    return Math.round(durationHours * 60); // Retorna em minutos
  }

  // Calcular estatísticas da rota
  static calculateRouteStats(route: RouteStep[]): {
    totalDistance: number;
    totalDuration: number;
    estimatedArrival: Date;
  } {
    const totalDistance = route.reduce((sum, step) => sum + step.distance, 0);
    const totalDuration = route.reduce((sum, step) => sum + step.duration, 0);
    
    const estimatedArrival = new Date();
    estimatedArrival.setMinutes(estimatedArrival.getMinutes() + totalDuration);

    return {
      totalDistance: Math.round(totalDistance * 100) / 100, // Arredondar para 2 casas decimais
      totalDuration,
      estimatedArrival,
    };
  }

  // Reagrupar entregas se necessário (baseado em proximidade)
  static groupNearbyDeliveries(
    deliveries: Delivery[],
    maxDistanceKm: number = 0.5
  ): Delivery[][] {
    const groups: Delivery[][] = [];
    const processed = new Set<string>();

    deliveries.forEach((delivery) => {
      if (processed.has(delivery.id)) return;

      const group = [delivery];
      processed.add(delivery.id);

      // Encontrar entregas próximas
      deliveries.forEach((otherDelivery) => {
        if (processed.has(otherDelivery.id)) return;

        const distance = LocationService.calculateDistance(
          { latitude: delivery.latitude, longitude: delivery.longitude },
          { latitude: otherDelivery.latitude, longitude: otherDelivery.longitude }
        );

        if (distance <= maxDistanceKm) {
          group.push(otherDelivery);
          processed.add(otherDelivery.id);
        }
      });

      groups.push(group);
    });

    return groups;
  }

  // Verificar se entrega está dentro do raio de entrega
  static isWithinDeliveryRadius(
    currentLocation: Coordinates,
    deliveryLocation: Coordinates,
    radiusMeters: number = 100
  ): boolean {
    const distanceKm = LocationService.calculateDistance(currentLocation, deliveryLocation);
    const distanceMeters = distanceKm * 1000;
    return distanceMeters <= radiusMeters;
  }

  // Obter próxima entrega na rota
  static getNextDelivery(route: RouteStep[]): RouteStep | null {
    const pendingDeliveries = route.filter(
      step => step.delivery.status === 'pending' || step.delivery.status === 'in_progress'
    );

    if (pendingDeliveries.length === 0) return null;

    // Retornar a próxima na ordem
    return pendingDeliveries.sort((a, b) => a.order - b.order)[0];
  }

  // Recalcular rota quando uma entrega for concluída
  static recalculateRoute(
    route: RouteStep[],
    completedDeliveryId: string,
    currentLocation: Coordinates
  ): RouteStep[] {
    // Remover entrega concluída
    const remainingDeliveries = route
      .filter(step => step.delivery.id !== completedDeliveryId)
      .map(step => step.delivery);

    // Se não há mais entregas, retornar array vazio
    if (remainingDeliveries.length === 0) return [];

    // Re-otimizar com as entregas restantes
    return this.optimizeRoute(remainingDeliveries, currentLocation);
  }
}
