import { useAuthStore } from '@/store/authStore'
import {
  useQuery,
  useMutation,
  UseQueryOptions,
  UseMutationOptions,
} from '@tanstack/react-query'

const fetcher = async <T>(
  url: string,
  options: RequestInit = {},
  retry = true, // 🔹 재시도 여부를 판단하는 플래그 추가
): Promise<T> => {
  const { accessToken, refreshToken, setAccessToken, clearAuth } =
    useAuthStore.getState()

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || ''

  const fetchRequest = async (token: string | null): Promise<T> => {
    const response = await fetch(
      `${apiUrl.replace(/\/$/, '')}/${url.replace(/^\//, '')}`,
      {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : '',
          ...options.headers,
        },
      },
    )

    // 🔹 401 또는 403 에러가 발생하면 토큰 갱신을 시도
    if ((response.status === 403 || response.status === 401) && retry) {
      if (!refreshToken) {
        clearAuth()
        throw new Error('토큰이 만료되었습니다. 다시 로그인해 주세요.')
      }

      // ✅ accessToken 갱신 요청
      const refreshResponse = await fetch('/api/user/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${refreshToken}`,
        },
      })

      if (!refreshResponse.ok) {
        clearAuth()
        throw new Error('토큰이 만료되었습니다. 다시 로그인해 주세요.')
      }

      const data = await refreshResponse.json()

      if (!data.result) {
        clearAuth()
        throw new Error('토큰 갱신 실패. 다시 로그인해 주세요.')
      }

      // ✅ 새로운 accessToken 저장
      setAccessToken(data.result)

      // ✅ 새로운 accessToken으로 원래 요청 재시도 (retry=false로 설정)
      return await fetcher<T>(url, options, false)
    }

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`)
    }

    return response.json()
  }

  return await fetchRequest(accessToken)
}

export const useGetQuery = <T>(
  queryKey: string[],
  url: string,
  options?: Omit<UseQueryOptions<T, Error>, 'queryKey' | 'queryFn'>,
) => {
  return useQuery<T, Error>({
    queryKey,
    queryFn: () => fetcher<T>(url, { method: 'GET' }),
    staleTime: 1000 * 60 * 5,
    ...options,
  })
}

export const usePostMutation = <T, V>(
  url: string,
  options?: UseMutationOptions<T, Error, V>,
) => {
  return useMutation<T, Error, V>({
    mutationFn: (data: V) =>
      fetcher<T>(url, { method: 'POST', body: JSON.stringify(data) }),
    ...options,
  })
}

export const usePutMutation = <T, V>(
  url: string,
  options?: UseMutationOptions<T, Error, V>,
) => {
  return useMutation<T, Error, V>({
    mutationFn: (data: V) =>
      fetcher<T>(url, { method: 'PUT', body: JSON.stringify(data) }),
    ...options,
  })
}

export const useDeleteMutation = <T>(
  url: string,
  options?: UseMutationOptions<T, Error, void>,
) => {
  return useMutation<T, Error, void>({
    mutationFn: () => fetcher<T>(url, { method: 'DELETE' }),
    ...options,
  })
}
