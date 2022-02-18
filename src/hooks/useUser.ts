import { useMutation, useQuery, useQueryClient } from 'react-query'
import services from 'services'
import { getToken, setToken, removeToken } from 'utils/auth'
import type { Response } from 'utils/request'
import type { UserModel } from 'services/user'

export function useLogin() {
  return useMutation(services.user.login, {
    onSuccess(res) {
      if (res.code === 200) {
        setToken(res.data)
      }
    }
  })
}

export function useLogout() {
  return useMutation(services.user.logout, {
    onSuccess(res) {
      if (res.code === 200) {
        removeToken()
      }
    }
  })
}

export function useUserQueryData() {
  const queryClient = useQueryClient()
  const userData = queryClient.getQueryData<Response<UserModel>>('user')
  return userData
}

export default function useUser() {
  return useQuery('user', services.user.getUserInfo, {
    enabled: !!getToken()
  })
}