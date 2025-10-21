export interface Vaga {
  id: number
  numero: string
  nivel?: string | null
  ativa: boolean
}

export interface Veiculo {
  id: number
  placa: string
  modelo?: string | null
  cor?: string | null
  ano?: number | null
  vagaId?: number | null
  vaga?: Vaga | null
}

export interface ApiError { message: string }
