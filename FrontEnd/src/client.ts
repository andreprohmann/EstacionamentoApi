export type Vaga = { id: number; placa: string; numeroVaga: number; ocupada: boolean }
export type VagaCreate = { placa: string; numeroVaga: number; ocupada: boolean }
export type VagaUpdate = Partial<VagaCreate>

export type Veiculo = { id: number; placa: string; marca: string; modelo: string; cor?: string; ano?: number; observacoes?: string }
export type VeiculoCreate = { placa: string; marca: string; modelo: string; cor?: string; ano?: number; observacoes?: string }
export type VeiculoUpdate = Partial<VeiculoCreate>

const base = (import.meta.env.VITE_API_URL ?? '').toString().trim()
const apiBase = base ? `${base.replace(/\/$/, '')}/api` : '/api'

async function request<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const resp = await fetch(input, { headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) }, ...init })
  const isJson = (resp.headers.get('content-type') || '').includes('application/json')
  const txt = await resp.text().catch(() => '')
  const data = isJson && txt ? JSON.parse(txt) : (txt as any)
  if (!resp.ok) throw new Error(`HTTP ${resp.status} ${resp.statusText} - ${typeof data==='string'?data:JSON.stringify(data)}`)
  return data as T
}

// Vagas
const VAGAS_URL = `${apiBase}/Vagas`
export const getVagas = () => request<Vaga[]>(VAGAS_URL)
export const getVaga = (id:number) => request<Vaga>(`${VAGAS_URL}/${id}`)
export const createVaga = (p: VagaCreate) => request<Vaga>(VAGAS_URL,{ method:'POST', body: JSON.stringify({ placa:String(p.placa).trim(), numeroVaga:Number(p.numeroVaga), ocupada:Boolean(p.ocupada) }) })
export const updateVaga = (id:number, p: VagaUpdate) => request<Vaga>(`${VAGAS_URL}/${id}`,{ method:'PUT', body: JSON.stringify({ placa:p.placa!=null?String(p.placa).trim():undefined, numeroVaga:p.numeroVaga!=null?Number(p.numeroVaga):undefined, ocupada:p.ocupada!=null?Boolean(p.ocupada):undefined }) })
export const deleteVaga = (id:number) => request<void>(`${VAGAS_URL}/${id}`,{ method:'DELETE' })

// Veículos
const VEICULOS_URL = `${apiBase}/Veiculos`
export const getVeiculos = () => request<Veiculo[]>(VEICULOS_URL)
export const getVeiculo = (id:number) => request<Veiculo>(`${VEICULOS_URL}/${id}`)
export const createVeiculo = (p: VeiculoCreate) => request<Veiculo>(VEICULOS_URL,{ method:'POST', body: JSON.stringify({ placa:String(p.placa).trim(), marca:String(p.marca).trim(), modelo:String(p.modelo).trim(), cor:p.cor?String(p.cor).trim():undefined, ano:p.ano!=null?Number(p.ano):undefined, observacoes:p.observacoes?String(p.observacoes).trim():undefined }) })
export const updateVeiculo = (id:number, p: VeiculoUpdate) => request<Veiculo>(`${VEICULOS_URL}/${id}`,{ method:'PUT', body: JSON.stringify({ placa:p.placa!=null?String(p.placa).trim():undefined, marca:p.marca!=null?String(p.marca).trim():undefined, modelo:p.modelo!=null?String(p.modelo).trim():undefined, cor:p.cor!=null?String(p.cor).trim():undefined, ano:p.ano!=null?Number(p.ano):undefined, observacoes:p.observacoes!=null?String(p.observacoes).trim():undefined }) })
export const deleteVeiculo = (id:number) => request<void>(`${VEICULOS_URL}/${id}`,{ method:'DELETE' })
