import * as Location from 'expo-location';
import { Coordinates } from '../types';

export class LocationService {
  private static watchSubscription: Location.LocationSubscription | null = null;

  // Solicitar permissões de localização
  static async requestPermissions(): Promise<boolean> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Permissão de localização negada');
        return false;
      }

      // Também solicitar permissão para localização em background se necessário
      const backgroundStatus = await Location.requestBackgroundPermissionsAsync();
      if (backgroundStatus.status !== 'granted') {
        console.warn('Permissão de localização em background negada');
      }

      return true;
    } catch (error) {
      console.error('Erro ao solicitar permissões de localização:', error);
      return false;
    }
  }

  // Obter localização atual
  static async getCurrentLocation(): Promise<Coordinates | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        return null;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeout: 10000,
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
    } catch (error) {
      console.error('Erro ao obter localização atual:', error);
      return null;
    }
  }

  // Iniciar monitoramento de localização
  static async startLocationTracking(
    onLocationUpdate: (location: Coordinates) => void,
    onError?: (error: Error) => void
  ): Promise<boolean> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        return false;
      }

      // Parar tracking anterior se existir
      await this.stopLocationTracking();

      this.watchSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 10000, // Atualizar a cada 10 segundos
          distanceInterval: 10, // Ou quando mover 10 metros
        },
        (location) => {
          onLocationUpdate({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
        }
      );

      return true;
    } catch (error) {
      console.error('Erro ao iniciar tracking de localização:', error);
      if (onError) {
        onError(error as Error);
      }
      return false;
    }
  }

  // Parar monitoramento de localização
  static async stopLocationTracking(): Promise<void> {
    if (this.watchSubscription) {
      await this.watchSubscription.remove();
      this.watchSubscription = null;
    }
  }

  // Calcular distância entre duas coordenadas (em quilômetros)
  static calculateDistance(
    coord1: Coordinates,
    coord2: Coordinates
  ): number {
    const R = 6371; // Raio da Terra em km
    const dLat = this.toRad(coord2.latitude - coord1.latitude);
    const dLon = this.toRad(coord2.longitude - coord1.longitude);
    
    const lat1 = this.toRad(coord1.latitude);
    const lat2 = this.toRad(coord2.latitude);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    return R * c;
  }

  // Converter graus para radianos
  private static toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  // Obter endereço a partir de coordenadas (geocoding reverso)
  static async getAddressFromCoordinates(
    coordinates: Coordinates
  ): Promise<string | null> {
    try {
      const results = await Location.reverseGeocodeAsync(coordinates);
      
      if (results.length > 0) {
        const address = results[0];
        return `${address.street || ''} ${address.streetNumber || ''}, ${address.city || ''} - ${address.region || ''}`;
      }
      
      return null;
    } catch (error) {
      console.error('Erro ao obter endereço:', error);
      return null;
    }
  }

  // Obter coordenadas a partir de endereço (geocoding)
  static async getCoordinatesFromAddress(
    address: string
  ): Promise<Coordinates | null> {
    try {
      const results = await Location.geocodeAsync(address);
      
      if (results.length > 0) {
        return {
          latitude: results[0].latitude,
          longitude: results[0].longitude,
        };
      }
      
      return null;
    } catch (error) {
      console.error('Erro ao obter coordenadas:', error);
      return null;
    }
  }
}
