import React, { useState } from "react"
import { sendReportForPerson } from "../api/api"

interface Props {
  personId: string
  onClose: () => void
}

export default function ReportModal({ personId, onClose }: Props) {
  const [observacao, setObservacao] = useState("")
  const [telefone, setTelefone] = useState("")
  const [dataInfo, setDataInfo] = useState("")
  const [localizacao, setLocalizacao] = useState("")
  const [fotos, setFotos] = useState<FileList | null>(null)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Máscara simples de telefone
  const handleTelefoneChange = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11)
    let formatted = digits
    if (digits.length > 2) {
      formatted = `(${digits.slice(0, 2)}) ${digits.slice(2)}`
    }
    if (digits.length > 6) {
      formatted = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
    }
    setTelefone(formatted)
  }

  // Obter geolocalização
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocalização não suportada")
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = `${pos.coords.latitude}, ${pos.coords.longitude}`
        setLocalizacao(coords)
      },
      () => setError("Não foi possível obter localização")
    )
  }

  // Envio do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append("observacao", observacao)
      formData.append("telefone", telefone)
      formData.append("dataInformacao", dataInfo)
      formData.append("localizacao", localizacao)
      if (fotos) {
        Array.from(fotos).forEach((file) => formData.append("fotos", file))
      }

      await sendReportForPerson(personId, formData)
      setSuccess(true)
      setTimeout(() => {
        onClose()
      }, 1500)
    } catch (err: any) {
      setError(err.message || "Erro ao enviar informações")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6">
        <h2 className="text-xl font-bold mb-4">Enviar informação</h2>

        {error && <div className="text-red-600 mb-2">{error}</div>}
        {success && <div className="text-green-600 mb-2">Enviado com sucesso!</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Observação</label>
            <textarea
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              className="w-full border rounded p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Telefone</label>
            <input
              type="text"
              value={telefone}
              onChange={(e) => handleTelefoneChange(e.target.value)}
              className="w-full border rounded p-2"
              placeholder="(65) 99999-9999"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Data da informação</label>
            <input
              type="date"
              value={dataInfo}
              onChange={(e) => setDataInfo(e.target.value)}
              className="w-full border rounded p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Localização</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={localizacao}
                onChange={(e) => setLocalizacao(e.target.value)}
                className="flex-1 border rounded p-2"
                placeholder="latitude, longitude"
              />
              <button
                type="button"
                onClick={handleGetLocation}
                className="bg-gray-200 px-3 rounded hover:bg-gray-300"
              >
                Usar GPS
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Fotos</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setFotos(e.target.files)}
              className="w-full"
            />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border border-gray-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              {loading ? "Enviando..." : "Enviar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
