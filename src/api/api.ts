import axios from 'axios'
import { Person } from '../types'

export const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://abitus-api.geia.vip'
const timeout = Number(import.meta.env.VITE_API_TIMEOUT || 15000)

export const api = axios.create({
  baseURL,
  timeout,
  headers: { 'Content-Type': 'application/json' },
})

// Interceptor para lidar com erros globalmente
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err.response?.data?.detail || err.response?.statusText || err.message
    console.error('Erro na API:', message)
    return Promise.reject(new Error(message))
  }
)

// --- Função auxiliar para mapear Person
function mapPerson(apiPerson: any): Person {
  return {
    id: apiPerson.id,
    nome: apiPerson.nome,
    idade: apiPerson.idade,
    sexo: apiPerson.sexo,
    vivo: apiPerson.vivo,
    urlFoto: apiPerson.urlFoto,
    dataDesaparecimento: apiPerson.ultimaOcorrencia?.dtDesaparecimento ?? null,
    dataLocalizacao: apiPerson.ultimaOcorrencia?.dataLocalizacao ?? null,
    encontradoVivo: apiPerson.ultimaOcorrencia?.encontradoVivo ?? undefined,
    ocorrenciaId: apiPerson.ultimaOcorrencia?.ocoId ?? undefined,
    status: apiPerson.ultimaOcorrencia?.dataLocalizacao ? "LOCALIZADO" : "DESAPARECIDO",
    localDesaparecimento: apiPerson.ultimaOcorrencia?.localDesaparecimentoConcat ?? undefined,
    informacao: apiPerson.ultimaOcorrencia?.ocorrenciaEntrevDesapDTO?.informacao ?? undefined,
    vestimentasDesaparecido: apiPerson.ultimaOcorrencia?.ocorrenciaEntrevDesapDTO?.vestimentasDesaparecido ?? undefined,
  };
}

// --- Funções da API
export const fetchPeople = async (
  page = 1,
  pageSize = 10,
  nome = '',
  sexo?: string,
  status?: string,
  faixaIdadeInicial?: number,
  faixaIdadeFinal?: number
) => {
  const params: any = { pagina: page - 1, porPagina: pageSize };
  if (nome) params.nome = nome;
  if (sexo) params.sexo = sexo;
  if (status) params.status = status;
  if (faixaIdadeInicial !== undefined) params.faixaIdadeInicial = faixaIdadeInicial;
  if (faixaIdadeFinal !== undefined) params.faixaIdadeFinal = faixaIdadeFinal;

  const res = await api.get('/v1/pessoas/aberto/filtro', { params });
  const data = res.data;
  return {
    ...data,
    content: data.content.map(mapPerson),
  };
};

// Busca pessoa por ID
export async function fetchPersonById(id: string): Promise<Person> {
  const res = await fetch(`/api/persons/${id}`);
  if (!res.ok) throw new Error("Pessoa não encontrada");
  return res.json(); 
}

// Envia informações adicionais
export const sendReportForPerson = async (id: string, payload: FormData) => {
  try {
    const res = await api.post(`/v1/pessoas/${id}/informacoes`, payload, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return res.data
  } catch (err: any) {
    console.error("Erro ao enviar informações:", err.response?.data || err.message)
    throw err
  }
}

