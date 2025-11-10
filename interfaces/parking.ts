export interface ParkingFloor {
  id: string;
  floorNumber: number;
  parkingId: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ParkingSpot {
  number: any;
  id: string;
  parkingId: string;
  floorId: string;
  spotType: 'STANDARD' | 'ELECTRIC' | 'HANDICAPPED';
  spotNumber: string;
  status: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'MAINTENANCE';
  createdAt: string;
  updatedAt: string;
}

export interface ParkingDetail {
  id: string;
  userId: string;
  name: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  actualCapacity: number;
  totalCapacity: number;
  floors: number;
  hourlyCarRate: number;
  hourlyMotorcycleRate: number;
  dailyRate: number;
  monthlyRate: number;
  schedule: string;
  status: 'OPEN' | 'CLOSED' | 'FULL' | 'MAINTENANCE';
  createdAt: string;
  updatedAt: string;
  parkingFloors: ParkingFloor[];
  parkingSpots: ParkingSpot[];
}

export interface ParkingResponse {
  success: boolean;
  message: string;
  data: {
    results: Array<{
      parking: ParkingDetail;
      distance: number | null;
      availability: {
        isAvailable: boolean;
        availableSpots: number;
      };
      pricing: {
        hourlyCarRate: number;
        hourlyMotorcycleRate: number;
        dailyRate: number;
      };
      rating: {
        average: number;
        count: number;
      };
    }>;
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
    searchCriteria: any;
  };
  timestamp: string;
}

export interface Parking {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  actualCapacity: number;
  totalCapacity: number;
  floors: number;
  hourlyCarRate: number;
  hourlyMotorcycleRate: number;
  dailyRate: number;
  monthlyRate: number;
  schedule: string;
  status: 'OPEN' | 'CLOSED' | 'FULL' | 'MAINTENANCE';
  availableSpots: number;
  totalSpots: number;
  distance: number;
  rating: number;
  ratingCount: number;
  description: string;
  image: string;
  features: string[];
  isFavorite: boolean;
  parkingFloors: ParkingFloor[];
  parkingSpots: ParkingSpot[];
}
