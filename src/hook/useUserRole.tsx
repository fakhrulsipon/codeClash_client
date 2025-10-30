// src/hook/useUserRole.tsx
import { useQuery } from '@tanstack/react-query'
import useAxiosPublic from './useAxiosPublic'

interface UserRoleResponse {
  role: string
}

const useUserRole = (email?: string) => {
  const axiosPublic = useAxiosPublic()
  const {
    data,
    isLoading,
    error,
  } = useQuery<UserRoleResponse>({
    queryKey: ['userRole', email],
    queryFn: async () => {
      if (!email) throw new Error('Email not provided')
      const res = await axiosPublic.get<UserRoleResponse>(`/api/users/role/${email}`)
      return res.data
    },
    enabled: !!email,
    retry: 2,
    staleTime: 5 * 60 * 1000,
  })

  return {
    userRole: data?.role || 'user',
    roleLoading: isLoading,
    roleError: error,
  }
}

export default useUserRole