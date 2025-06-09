import { useGetQuery, usePostMutation, usePutMutation } from '@/api/lib/fetcher'
import {
  RefreshTokenResponse,
  DefaultResponse,
  User,
  UserResponse,
} from './model'

export const useUserInfo = () => {
  return useGetQuery<UserResponse>(['user'], '/user/info')
}

export const useUserJoin = () => {
  return usePostMutation<UserResponse, User>('/user/join')
}

export const useUserEdit = () => {
  return usePutMutation<UserResponse, User>('/user/edit')
}

export const useUserActivity = (updateInterval = 5 * 60 * 1000) => {
  return usePostMutation<DefaultResponse>('/user/activity')
}

export const useRefreshAccessToken = () => {
  return usePostMutation<RefreshTokenResponse>('/user/refresh')
}
