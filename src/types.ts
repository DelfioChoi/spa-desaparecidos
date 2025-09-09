export type Person = {
  id: number
  nome: string
  idade?: number
  sexo?: string
  vivo?: boolean
  urlFoto?: string | null
  dataDesaparecimento?: string | null
  dataLocalizacao?: string | null
  encontradoVivo?: boolean
  ocorrenciaId?: number
  status?: 'DESAPARECIDO' | 'LOCALIZADO'
  localDesaparecimento?: string | null
  informacao?: string | null
  vestimentasDesaparecido?: string | null
}

export type PagedAPIResponse<T> = {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}
