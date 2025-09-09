import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { fetchPersonById } from "../api/api"
import { Person } from "../types"
import ReportModal from "../components/ReportModal"

export default function Details() {
  const { id } = useParams<{ id: string }>()
  const [person, setPerson] = useState<Person | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    if (!id) {
      setError("ID da pessoa não informado")
      setLoading(false)
      return
    }

    setLoading(true)
    fetchPersonById(id)
      .then((data) => {
        setPerson(data)
        setError(null)
      })
      .catch((err) => {
        setError(err.message || "Erro ao buscar dados")
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="p-4">Carregando...</div>
  if (error) return <div className="p-4 text-red-500">{error}</div>
  if (!person) return <div className="p-4">Nenhuma pessoa encontrada</div>

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "—"
    const d = new Date(dateStr)
    return d.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
      <div className="flex gap-6">
        <img
          src={person.urlFoto || "/placeholder.png"}
          alt={person.nome}
          className="w-40 h-40 object-cover rounded"
          onError={(e) => (e.currentTarget.src = "/placeholder.png")}
        />
        <div className="flex-1">
          <h2 className="text-2xl font-bold">{person.nome}</h2>
          <p className="text-gray-600">
            {person.idade ? `${person.idade} anos` : ""} {person.sexo || ""}
          </p>
          <span
            className={`inline-block mt-2 px-3 py-1 rounded text-sm font-medium ${
              person.status === "DESAPARECIDO"
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {person.status}
          </span>
        </div>
      </div>

      <dl className="mt-4 space-y-2">
        <div>
          <dt className="font-semibold">Data do desaparecimento:</dt>
          <dd>{formatDate(person.dataDesaparecimento)}</dd>
        </div>
        <div>
          <dt className="font-semibold">Data da localização:</dt>
          <dd>{formatDate(person.dataLocalizacao)}</dd>
        </div>
        <div>
          <dt className="font-semibold">Encontrado com vida?</dt>
          <dd>{person.encontradoVivo ? "Sim" : "Não"}</dd>
        </div>
      </dl>

      <button
        onClick={() => setIsModalOpen(true)}
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Enviar informação
      </button>

      {/* Modal */}
      {isModalOpen && person.id !== undefined && (
        <ReportModal
          personId={person.id.toString()}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  )
}
