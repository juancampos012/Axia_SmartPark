import { useState, useCallback, useRef, useEffect } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { 
  fetchUsers, 
  deleteUser 
} from '../libs/admin';
import {
  AdminUserListItem,
  AdminUserFilters,
} from '../interfaces/Admin';
// ARREGLO: Importar 'Role' directamente desde 'interfaces/User.ts'
import { Role } from '../interfaces/User'; 

/**
 * Hook para gestionar la lista de usuarios (Operadores) para un Admin.
 * La lógica de filtrado se delega 100% al backend.
 */
export const useUsersManagement = () => {
  const { user } = useAuth();
  const { refresh: refreshTrigger } = useLocalSearchParams<{ refresh?: string }>();

  const [users, setUsers] = useState<AdminUserListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  
  // ARREGLO: Cambiado 'filters' a 'searchQuery' para que coincida con fetchUsers
  const [searchQuery, setSearchQuery] = useState<string | undefined>();
  
  const loadingRef = useRef(false);

  // Cargar usuarios
  const loadUsers = useCallback(async (
    pageNum: number = 1, 
    currentSearchQuery: string | undefined,
    isRefresh: boolean = false
  ) => {
    if (loadingRef.current && !isRefresh) {
      return;
    }

    try {
      loadingRef.current = true;
      
      if (pageNum === 1 && !isRefresh) {
        setLoading(true);
      }
      if (isRefresh) {
        setRefreshing(true);
      }

      const response = await fetchUsers(pageNum, 20, currentSearchQuery);
      
      console.log('📦 useUsersManagement - Response:', {
        success: response.success,
        usersCount: response.data?.users?.length || 0,
        total: response.data?.pagination?.total || 0,
        users: response.data?.users
      });
      
      if (response.success && response.data) {
        const newUsers = response.data.users || [];
        
        console.log('useUsersManagement - Setting users:', {
          newUsersCount: newUsers.length,
          pageNum,
          isFirstPage: pageNum === 1,
          currentUsersCount: users.length
        });

        if (pageNum === 1) {
          setUsers(newUsers);
        } else {
          setUsers(prev => [
            ...prev, 
            ...newUsers.filter(nu => !prev.some(pu => pu.id === nu.id))
          ]);
        }
        
        setHasMore(response.data.pagination?.hasNextPage || false);
        setTotalUsers(response.data.pagination?.total || 0);
        setPage(pageNum);
        
        console.log('useUsersManagement - State updated:', {
          usersInState: pageNum === 1 ? newUsers.length : users.length + newUsers.length,
          totalUsers: response.data.pagination?.total || 0,
          hasMore: response.data.pagination?.hasNextPage || false
        });
      } else {
        console.warn('useUsersManagement - Invalid response format:', response);
        setUsers([]);
        setHasMore(false);
        setTotalUsers(0);
      }
    } catch (error: any) {
      console.error('useUsersManagement - Error:', error);
      setUsers([]);
      setHasMore(false);
      setTotalUsers(0);
    } finally {
      setLoading(false);
      setRefreshing(false);
      loadingRef.current = false;
    }
  }, []);

  // Buscar usuarios
  const handleSearch = useCallback((query: string) => {
    const newSearchQuery = query || undefined;
    setSearchQuery(newSearchQuery);
    loadUsers(1, newSearchQuery, false);
  }, [loadUsers]);
  

  // Refrescar lista
  const handleRefresh = useCallback(() => {
    loadUsers(1, searchQuery, true);
  }, [loadUsers, searchQuery]);

  // Cargar más
  const loadMore = useCallback(() => {
    if (!loading && hasMore && !loadingRef.current) {
      loadUsers(page + 1, searchQuery, false);
    }
  }, [loading, hasMore, page, searchQuery, loadUsers]);

  // Eliminar usuario
  const handleDeleteUser = useCallback(async (userId: string, userName: string) => {
    console.log(`Confirmar eliminación de ${userName} (ID: ${userId})`);
    
    try {
      setLoading(true);
      await deleteUser(userId);
      console.log(' Éxito', 'Usuario eliminado correctamente');
      handleRefresh();
    } catch (error: any) {
      console.error('Error al eliminar usuario', error.message);
    } finally {
      setLoading(false);
    }
  }, [handleRefresh]);

  // Navegar a crear
  const navigateToCreate = useCallback(() => {
    router.push('/profile/users/create');
  }, []);

  // Navegar a editar
  const navigateToEdit = useCallback((userId: string) => {
    router.push(`/profile/users/${userId}`);
  }, []);

  // Efecto para carga inicial y recarga por navegación
  useEffect(() => {
    if (user) {
      console.log('useUsersManagement - Carga inicial o Trigger de refresco', refreshTrigger);
      loadUsers(1, searchQuery, false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, refreshTrigger, searchQuery]);

  return {
    users,
    loading,
    refreshing,
    hasMore,
    searchQuery,
    totalUsers,
    loadUsers,
    handleSearch,
    handleRefresh,
    loadMore,
    handleDeleteUser,
    navigateToCreate,
    navigateToEdit,
  };
};