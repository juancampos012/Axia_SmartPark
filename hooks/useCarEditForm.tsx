// hooks/useCarForm.ts
import { useForm, Control, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert } from "react-native";
import { CarEditSchema, CarFormData } from "../schemas/carEditSchema";

interface UseCarFormProps {
  initialData?: CarFormData;
  onSubmit?: (data: CarFormData) => void;
  onCancel?: () => void;
}

export const useCarEditForm = ({
  initialData,
  onSubmit,
  onCancel,
}: UseCarFormProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CarFormData>({
    resolver: zodResolver(CarEditSchema),
    defaultValues: {
      carBrand: initialData?.carBrand || "",
      model: initialData?.model || "",
      licensePlate: initialData?.licensePlate || "",
      engineType: initialData?.engineType || "GASOLINA",
      color: initialData?.color || "",
    },
    mode: "onChange",
  });

  // Función que se ejecuta al enviar el formulario
  const submitForm = (data: CarFormData) => {
    try {
      onSubmit?.(data);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Ocurrió un problema al guardar los datos del vehículo.");
    }
  };

  // Función para cancelar edición y resetear valores
  const handleCancelPress = () => {
    if (initialData) reset(initialData);
    onCancel?.();
  };

  return {
    control,
    errors: errors as FieldErrors<CarFormData>,
    isSubmitting,
    handleSubmit: handleSubmit(submitForm),
    handleCancelPress,
  };
};