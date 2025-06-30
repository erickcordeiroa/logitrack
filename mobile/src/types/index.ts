export interface Delivery {
  id: string;
  customerName: string;
  customerPhone: string;
  address: string;
  latitude: number;
  longitude: number;
  status: 'pending' | 'in_progress' | 'delivered' | 'failed';
  estimatedTime: string;
  items: DeliveryItem[];
  notes?: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}

export interface DeliveryItem {
  id: string;
  name: string;
  quantity: number;
  description?: string;
}

export interface Route {
  id: string;
  deliveries: Delivery[];
  totalDistance: number;
  estimatedDuration: number;
  optimized: boolean;
  startLocation: Coordinates;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface DeliveryDriver {
  id: string;
  name: string;
  phone: string;
  email: string;
  vehicle: string;
  currentLocation?: Coordinates;
}

export interface RouteStep {
  delivery: Delivery;
  distance: number;
  duration: number;
  order: number;
}

export interface NavigationProps {
  delivery: Delivery;
  currentLocation: Coordinates;
}
