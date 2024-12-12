// src/types.ts

export interface User {
  DeletedAt: string | null
  ID: number
  Username: string
  Name: string
  Email: string
  FollowingCount: number
  FollowersCount: number
  Following: User[]
  Followers: User[]
  IsPrivate: boolean
  CreatedAt: string
  UpdatedAt: string
}

export interface Post {
  DeletedAt: string | null
  ID: number
  Content: string
  UserID: number
  User: User
  CreatedAt: string
  UpdatedAt: string
}

export interface LoginResponse {
  data: string
}

export interface RegisterResponse {
  code: number
  data: User
  token: string
}

export interface ErrorResponse {
  error?: string
}

export interface PostResponse {
  data: Post[]
}

export interface UserResponse {
  data: User
}
