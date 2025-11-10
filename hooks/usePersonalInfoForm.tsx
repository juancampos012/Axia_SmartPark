import { useForm, Control, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert } from "react-native";
import { PersonalInfoSchema, PersonalInfoFormData } from "../schemas/personalInfoSchema";

interface UsePersonalInfoFormProps {
  initialData?: PersonalInfoFormData;
  onSubmit?: (data: PersonalInfoFormData) => void;
  onCancel?: () => void;
}

export const usePersonalInfoForm = ({
  initialData,
  onSubmit,
  onCancel,
}: UsePersonalInfoFormProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PersonalInfoFormData>({
    resolver: zodResolver(PersonalInfoSchema),
    defaultValues: {
      firstName: initialData?.firstName || "",
      lastName: initialData?.lastName || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      active: initialData?.active ?? true,
      createdAt: initialData?.createdAt || "",
    },
    mode: "onChange",
  });

  // Función que se ejecuta al enviar el formulario
  const submitForm = (data: PersonalInfoFormData) => {
    try {
      onSubmit?.(data);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Ocurrió un problema al guardar los datos.");
    }
  };

  // Función para cancelar edición y resetear valores
  const handleCancelPress = () => {
    if (initialData) reset(initialData);
    onCancel?.();
  };

  return {
    control,
    errors: errors as FieldErrors<PersonalInfoFormData>,
    isSubmitting, // ✅ ahora disponible en el componente
    handleSubmit: handleSubmit(submitForm),
    handleCancelPress,
  };
};
