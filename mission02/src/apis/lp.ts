import axios from 'axios'
import type { SortType, OrderType } from '../types/lp'

const BASE_URL = 'http://localhost:8000'

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  if (user?.accessToken) {
    config.headers.Authorization = `Bearer ${user.accessToken}`
  }
  return config
})

export const fetchLpList = async ({
  pageParam = 0,
  sort = 'latest',
}: {
  pageParam?: number
  sort?: SortType
}) => {
  const order = sort === 'latest' ? 'desc' : 'asc'
  const { data } = await api.get(`/v1/lps?cursor=${pageParam}&order=${order}&limit=10`)
  return data
}

export const fetchLpDetail = async (lpid: string) => {
  const { data } = await api.get(`/v1/lps/${lpid}`)
  return data
}

export const fetchComments = async ({
  pageParam = 0,
  lpId,
  order = 'desc',
}: {
  pageParam?: number
  lpId: string
  order?: OrderType
}) => {
  const { data } = await api.get(
    `/v1/lps/${lpId}/comments?cursor=${pageParam}&order=${order}&limit=10`
  )
  return data
}

export const createComment = async ({
  lpId,
  content,
}: {
  lpId: string
  content: string
}) => {
  const { data } = await api.post(`/v1/lps/${lpId}/comments`, { content })
  return data
}

export const likeLp = async (lpid: string) => {
  await api.post(`/v1/lps/${lpid}/likes`)
}

export const unlikeLp = async (lpid: string) => {
  await api.delete(`/v1/lps/${lpid}/likes`)
}

export const deleteLp = async (lpid: string) => {
  await api.delete(`/v1/lps/${lpid}`)
}