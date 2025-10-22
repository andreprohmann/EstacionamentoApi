
// Usando proxy do Vite: chamadas relativas (sem base URL)
const API_BASE = 'http://localhost:5000/api'

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE'

async function request<T>(path: string, method: Method = 'GET', body?: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || res.statusText)
  }
  const contentType = res.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    return res.json() as Promise<T>
  }
  return undefined as unknown as T
}

export const api = {
  listVagas: () => request<any[]>('/vagas'),
  getVaga: (id: number) => request<any>(`/vagas/${id}`),
  createVaga: (dto: { numero: string, nivel?: string | null, ativa?: boolean }) => request<any>('/vagas', 'POST', dto),
  updateVaga: (id: number, dto: Partial<{ numero: string, nivel?: string | null, ativa?: boolean }>) => request<void>(`/vagas/${id}`, 'PUT', dto),
  deleteVaga: (id: number) => request<void>(`/vagas/${id}`, 'DELETE'),

  listVeiculos: () => request<any[]>('/veiculos'),
  getVeiculo: (id: number) => request<any>(`/veiculos/${id}`),
  createVeiculo: (dto: { placa: string, modelo?: string | null, cor?: string | null, ano?: number | null, vagaId?: number | null }) => request<any>('/veiculos', 'POST', dto),
  updateVeiculo: (id: number, dto: { placa?: string, modelo?: string | null, cor?: string | null, ano?: number | null, vagaIdHasValue?: boolean, vagaId?: number | null }) => request<void>(`/veiculos/${id}`, 'PUT', dto),
  deleteVeiculo: (id: number) => request<void>(`/veiculos/%7Bid%7D`, 'DELETE'),
  ocupar: (id: number, vagaId: number) => request<any>(`/veiculos/${id}/ocupar/${vagaId}`, 'POST'),
  liberar: (id: number) => request<any>(`/veiculos/${id}/liberar`, 'POST'),
}

export default api
