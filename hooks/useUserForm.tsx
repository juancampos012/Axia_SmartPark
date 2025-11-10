import { useState, useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { fetchUserById, createUser, updateUser } from '../libs/admin';
import { CreateUserDTO, UpdateUserDTO, AdminUserDetail } from '../interfaces/Admin';
import { Role } from '../interfaces/User';
import { 
  createUserFormSchema, 
  updateUserFormSchema, 
  type CreateUserFormData 
} from '../schemas/userFormSchema';
import { ZodError } from 'zod';

export const useUserForm = (userId?: string) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<AdminUserDetail | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string | null>>({});
  
  // Form fields
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<Role>(Role.OPERATOR);
  const [isActive, setIsActive] = useState(true);

  const isEditMode = !!userId;

  // Cargar usuario si estamos en modo edición
  useEffect(() => {
    if (userId) {
      loadUser(userId);
    }
  }, [userId]);

  const loadUser = async (id: string) => {
    try {
      setLoading(true);
      const userData = await fetchUserById(id);
      setUser(userData);
      
      // Rellenar formulario
      setName(userData.name);
      setLastName(userData.lastName);
      setEmail(userData.email);
      setPhoneNumber(userData.phoneNumber || '');
      setRole(userData.role);
      setIsActive(userData.isActive);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al cargar usuario');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  // Validar formulario con Zod
  const validateForm = (): boolean => {
    try {
      if (isEditMode) {
        // Validar solo campos de actualización
        updateUserFormSchema.parse({
          name: name.trim() || undefined,
          lastName: lastName.trim() || undefined,
          email: email.trim() || undefined,
          phoneNumber: phoneNumber.trim() || undefined,
          role,
          isActive,
        });
      } else {
        // Validar campos de creación
        createUserFormSchema.parse({
          name: name.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          phoneNumber: phoneNumber.trim(),
          password,
          confirmPassword,
          role,
        });
      }
      // Si llegamos aquí, limpiar errores
      setFormErrors({});
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        // Mapear errores por campo para mostrarlos inline
        const errs: Record<string, string> = {};
        error.errors.forEach((e) => {
          const key = (e.path && e.path[0]) ? String(e.path[0]) : 'form';
          // Si ya existe un error para esa llave, no lo sobrescribimos (mantener el primero)
          if (!errs[key]) errs[key] = e.message;
        });
        setFormErrors(errs);
        const firstError = error.errors[0];
        Alert.alert('Error de validación', firstError.message);
      } else {
        Alert.alert('Error', 'Error al validar el formulario');
      }
      return false;
    }
  };

  // Guardar usuario
  const handleSave = useCallback(async () => {
    if (!validateForm()) return;

    try {
      setSaving(true);

      if (isEditMode && userId) {
        // Actualizar usuario existente
        const updateData: UpdateUserDTO = {
          name: name.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          phoneNumber: phoneNumber.trim(),
          role,
          isActive,
        };

        await updateUser(userId, updateData);
        Alert.alert('Éxito', 'Usuario actualizado correctamente', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      } else {
        // Crear nuevo usuario
        const createData: CreateUserDTO = {
          name: name.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          phoneNumber: phoneNumber.trim(),
          password,
          role,
        };

        console.log('📝 Creando usuario con datos:', {
          ...createData,
          password: '***'
        });

        await createUser(createData);
        Alert.alert('Éxito', 'Usuario creado correctamente', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      }
    } catch (error: any) {
      console.error('Error creating user:', error);
      
      // Manejo específico de errores de token
      if (error.message?.includes('sesión') || error.message?.includes('token') || error.message?.includes('expired')) {
        Alert.alert(
          'Sesión expirada',
          'Tu sesión ha expirado. Por favor, cierra sesión y vuelve a iniciar sesión.',
          [
            { text: 'OK' }
          ]
        );
      } else if (error.message?.includes('permisos') || error.message?.includes('SUPER_ADMIN')) {
        Alert.alert('Error de permisos', error.message);
      } else if (error.message?.includes('existe') || error.message?.includes('exists')) {
        Alert.alert('Error', 'Ya existe un usuario con ese email o teléfono');
      } else {
        Alert.alert('Error', error.message || 'Error al guardar usuario');
      }
    } finally {
      setSaving(false);
    }
  }, [
    name,
    lastName,
    email,
    phoneNumber,
    password,
    confirmPassword,
    role,
    isActive,
    isEditMode,
    userId,
  ]);

  return {
    loading,
    saving,
    user,
    isEditMode,
    formErrors,
    // Form fields
    name,
    setName,
    lastName,
    setLastName,
    email,
    setEmail,
    phoneNumber,
    setPhoneNumber,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    role,
    setRole,
    isActive,
    setIsActive,
    // Actions
    handleSave,
  };
};
