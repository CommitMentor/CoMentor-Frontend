export interface User {
  email: string
  notification: boolean
  stackNames: string[]
  avatarUrl?: string
  userName?: string
}

export interface UserResponse {
  code: number
  message: string
  result: User
}

export interface DefaultResponse {
  code: number
  message: string
  result: null
}

export interface RefreshTokenResponse {
  code: number
  message: string
  result: string
}
