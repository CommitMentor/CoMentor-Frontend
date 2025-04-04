export enum stackNames {
  프론트엔드 = 'FRONTEND',
  백엔드 = 'BACKEND',
  데이터베이스 = 'DB',
  알고리즘 = 'ALGORITHM',
}

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
