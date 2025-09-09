import React from "react";
import { Person } from "../types";

// Função para formatar data no padrão brasileiro
function formatDate(dateStr?: string | null) {
  if (!dateStr) return "Sem data confirmada";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "Data inválida";
  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function PersonCard({
  person,
  onReport,
}: {
  person: Person;
  onReport: (p: Person) => void;
}) {
  const fotoSrc = person.urlFoto || "/placeholder.png";
  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    if (!e.currentTarget.src.endsWith("/placeholder.png")) {
      e.currentTarget.src = "/placeholder.png";
    }
  };

  let vivoStatus = "Sem informação";
  if (person.encontradoVivo === true) vivoStatus = "Vivo";
  else if (person.encontradoVivo === false) vivoStatus = "Morto";

  return (
    <article className="bg-white rounded shadow p-4 flex gap-4">
      <img
        src={fotoSrc}
        alt={person.nome}
        className="w-24 h-24 object-cover rounded"
        onError={handleImageError}
      />
      <div className="flex-1">
        <h3 className="font-bold text-lg mb-2">{person.nome}</h3>
        <div className="space-y-1">
          <p className="text-base text-gray-700">
            <span className="font-semibold">Idade:</span>{" "}
            {person.idade ? `${person.idade} anos` : "Não informada"}
          </p>
          <p className="text-base text-gray-700">
            <span className="font-semibold">Sexo:</span>{" "}
            {person.sexo || "Não informado"}
          </p>
          <p className="text-base text-gray-700">
            <span className="font-semibold">Status:</span>{" "}
            <span
              className={
                person.status === "LOCALIZADO"
                  ? "px-2 py-1 rounded text-sm bg-green-100 text-green-800"
                  : "px-2 py-1 rounded text-sm bg-red-100 text-red-800"
              }
            >
              {person.status === "LOCALIZADO" ? "LOCALIZADO" : "DESAPARECIDO"}
            </span>
          </p>
          <p className="text-base text-gray-700">
            <span className="font-semibold">Situação:</span>{" "}
            <span
              className={
                vivoStatus === "Vivo"
                  ? "text-green-700"
                  : vivoStatus === "Morto"
                  ? "text-red-700"
                  : "text-gray-600"
              }
            >
              {vivoStatus}
            </span>
          </p>
          <p className="text-base text-gray-700">
            <span className="font-semibold">Desaparecimento:</span>{" "}
            {formatDate(person.dataDesaparecimento)}
          </p>
          <p className="text-base text-gray-700">
            <span className="font-semibold">Local desaparecimento:</span>{" "}
            {person.localDesaparecimento || "Não informado"}
          </p>
          <p className="text-base text-gray-700">
            <span className="font-semibold">Informações:</span>{" "}
            {person.informacao || "Não informado"}
          </p>
          <p className="text-base text-gray-700">
            <span className="font-semibold">Vestimenta:</span>{" "}
            {person.vestimentasDesaparecido || "Não informado"}
          </p>
        </div>
        <button
          className="text-blue-600 underline mt-4"
          onClick={() => onReport(person)}
        >
          Incluir informações
        </button>
      </div>
    </article>
  );
}