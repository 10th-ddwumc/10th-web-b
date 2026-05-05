import axios from 'axios'
import type { Lp, SortType } from '../types/lp'

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

export const fetchLpList = async (sort: SortType = 'latest') => {
  const { data } = await api.get(`/v1/lps?sort=${sort}`)
  return data  
}

export const fetchLpDetail = async (lpid: string) => {
  const { data } = await api.get(`/v1/lps/${lpid}`)
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

export interface LpListResponse {
  data: Lp[]
  nextCursor: number
  hasNext: boolean
}