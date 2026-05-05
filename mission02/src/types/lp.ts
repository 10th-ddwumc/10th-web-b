export interface Lp {
  id: number
  title: string
  content: string
  thumbnail: string
  likes: { id: number }[]
  author: { id: number; name: string; avatar?: string }
  authorId: number
  createdAt: string
  updatedAt: string
  tags: string[]
}

export interface Comment {
  id: number
  content: string
  authorId: number
  lpId: number
  createdAt: string
  author: { id: number; name: string; avatar?: string }
}

export interface User {
  id: number
  name: string
  accessToken: string
  refreshToken: string
}

export type SortType = 'latest' | 'oldest'
export type OrderType = 'desc' | 'asc'