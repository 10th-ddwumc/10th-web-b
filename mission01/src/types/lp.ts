export interface Lp {
  id: number
  title: string
  content: string
  thumbnail: string
  likes: { id: number }[] 
  author: { id: number; name: string }
  authorId: number
  createdAt: string
  updatedAt: string
  tags: string[]
}

export interface User {
  id: number
  name: string  
  accessToken: string
  refreshToken: string
}

export type SortType = 'latest' | 'oldest'