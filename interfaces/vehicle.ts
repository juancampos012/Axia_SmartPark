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
  createdAt?: string;
  updatedAt?: string;
}

export interface AddCarFormProps {
  onSubmit: (data: CarFormData) => void;
  onCancel: () => void;
}