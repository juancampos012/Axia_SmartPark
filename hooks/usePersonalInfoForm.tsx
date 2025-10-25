import { useForm } from 'react-hook-form';

interface PersonalInfoFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  active: boolean;
  createdAt: string;
}

interface UsePersonalInfoFormProps {
  initialData?: PersonalInfoFormData;
  onSubmit?: (data: PersonalInfoFormData) => void;
  onCancel?: () => void;
}

const defaultData: PersonalInfoFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  active: true,
  createdAt: ''
};

export const usePersonalInfoForm = ({
  initialData = defaultData,
  onSubmit,
  onCancel
}: UsePersonalInfoFormProps = {}) => {
  
  const { 
    control, 
    handleSubmit, 
    formState: { errors }, 
    reset 
  } = useForm<PersonalInfoFormData>({
    defaultValues: initialData
  });

  const submitForm = (data: PersonalInfoFormData) => {
    if (onSubmit) {
      onSubmit(data);
    }
  };

  const handleCancelPress = () => {
    // Restaurar valores originales
    reset(initialData);
    if (onCancel) {
      onCancel();
    }
  };

  return {
    control,
    errors,
    handleSubmit: handleSubmit(submitForm),
    handleCancelPress,
    resetForm: () => reset(initialData)
  };
};
