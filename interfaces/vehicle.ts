import { CarFormData } from "../schemas/carSchema";
export interface Vehicle {
  id: string;
  licensePlate: string;
  type: "car" | "motorcycle";
  model: string;
  carBrand: string;
  color?: string;
  engineType?: "GASOLINE" | "ELECTRIC" | "HYBRID";
  year?: number;
  image?: string; // URL de la imagen del vehículo
  createdAt?: string;
  updatedAt?: string;
}

export interface AddCarFormProps {
  onSubmit: (data: CarFormData) => void;
  onCancel: () => void;
}