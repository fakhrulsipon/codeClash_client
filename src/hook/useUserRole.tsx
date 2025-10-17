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
  })

  return {
    userRole: data?.role || null,
    roleLoading: isLoading,
    roleError: error,
  }
}

export default useUserRole
