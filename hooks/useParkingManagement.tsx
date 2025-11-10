import { useState, useCallback, useRef } from 'react';
// IMPORTANTE: Asegúrate de importar useFocusEffect desde '@react-navigation/native'
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import {
  fetchParkingByIdAdmin,
  changeParkingStatus,
} from '../libs/admin';
import { AdminParkingInfo } from '../interfaces/Admin';

export const useParkingManagement = () => {
  const { parkingId } = useAuth();
  const [loading, setLoading] = useState(true);
  const [parking, setParking] = useState<AdminParkingInfo | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const isInitialLoadRef = useRef(true);

  // Cargar información del parqueadero
  const loadParking = useCallback(async (isManualRefresh: boolean = false) => {
    if (!parkingId) {
      setLoading(false);
      setRefreshing(false);
      return;
    }
    
    // Lógica de indicadores de carga:
    if (isInitialLoadRef.current) {
      // 1. Carga INICIAL (solo la primera vez que se monta el hook)
      setLoading(true);
      isInitialLoadRef.current = false; // Marcar que la carga inicial ya pasó
    } else if (isManualRefresh) {
      // 2. Refresco MANUAL (el usuario hizo pull-to-refresh)
      setRefreshing(true);
    }

    try {
      const parkingData = await fetchParkingByIdAdmin(parkingId);
      setParking(parkingData);
    } catch (error: any) {
      console.error('Error al cargar información del parqueadero:', error.message);
      // Setea parking a null si falla para mostrar la vista de error
      setParking(null); 
    } finally {
      // Asegurarse de apagar ambos spinners sin importar qué
      setLoading(false);
      setRefreshing(false);
    }
  }, [parkingId]); 

  // Hook para "pull-to-refresh" manual
  const handleRefresh = useCallback(() => {
    // Solo permitir el refresco si no está cargando ya
    if (!loading && !refreshing) {
        loadParking(true); // 'true' indica que es un refresco MANUAL
    }
  }, [loading, refreshing, loadParking]);

  useFocusEffect(
    useCallback(() => {
      // Llama a loadParking con 'isManualRefresh' = false.
      loadParking(false); 
    }, [loadParking])
  );

  // Cambiar estado del parqueadero
  const handleChangeStatus = useCallback(
    async (newStatus: 'OPEN' | 'CLOSED' | 'FULL' | 'MAINTENANCE') => {
      if (!parkingId) return;
      
      // Guardar estado anterior por si falla
      const previousParking = parking; 
      
      // Actualización optimista de la UI
      setParking(prev => prev ? { ...prev, status: newStatus } : null);

      try {
        // No necesitamos setLoading(true) para esta acción rápida,
        // la UI ya se actualizó
        const updated = await changeParkingStatus(parkingId, newStatus);
        setParking(updated); // Sincronizar con la respuesta final del servidor
        console.log('Estado actualizado correctamente');
      } catch (error: any) {
        console.error('Error al cambiar el estado:', error.message);
        // Revertir en caso de error
        setParking(previousParking); 
      }
    },
    [parkingId, parking] 
  );

  return {
    parking,
    loading,
    refreshing,
    loadParking,
    handleRefresh,
    handleChangeStatus,
  };
};

