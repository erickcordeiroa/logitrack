export interface Delivery {
  id: string;
  customerName: string;
  customerPhone: string;
  address: string;
  latitude: number;
  longitude: number;
  status: 'pending' | 'collected' | 'in_transit' | 'delivered' | 'cancelled';
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
  driverId: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  totalStops: number;
  completedStops: number;
  estimatedCompletion: string;
  stops: RouteStop[];
}

export interface RouteStop {
  id: string;
  address: string;
  latitude: number;
  longitude: number;
  completed: boolean;
  estimatedTime: string;
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
