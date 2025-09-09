import { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import PersonCard from "../components/PersonCard";
import Pagination from "../components/Pagination";
import { fetchPeople } from "../api/api";
import { Person } from "../types";

type InfoExtra = {
  personId: number;
  informacao: string;
  vestimenta: string;
  local: string;
  data: string;
  fotoName?: string;
};

export default function Home() {
  const [q, setQ] = useState("");
  const [sexo, setSexo] = useState<string | undefined>();
  const [status, setStatus] = useState<string | undefined>();
  const [faixaIdadeInicial, setFaixaIdadeInicial] = useState<
    number | undefined
  >();
  const [faixaIdadeFinal, setFaixaIdadeFinal] = useState<number | undefined>();
  const [page, setPage] = useState(1);
  const [people, setPeople] = useState<Person[]>([]);
  const [total, setTotal] = useState(0);
  const pageSize = 10;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  // Estados do formulário imaginário
  const [info, setInfo] = useState("");
  const [vestimenta, setVestimenta] = useState("");
  const [local, setLocal] = useState("");
  const [data, setData] = useState("");
  const [foto, setFoto] = useState<File | null>(null);

  // Salvar localmente as informações extras
  const [infosExtras, setInfosExtras] = useState<InfoExtra[]>([]);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchPeople(
        page,
        pageSize,
        q,
        sexo,
        status,
        faixaIdadeInicial,
        faixaIdadeFinal
      );
      setPeople(res.content || []);
      setTotal(res.totalElements || 0);
    } catch (err: any) {
      setError(err.message || "Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, [page, q, sexo, status, faixaIdadeInicial, faixaIdadeFinal]);

  function handleReport(person: Person) {
    setSelectedPerson(person);
    setInfo("");
    setVestimenta("");
    setLocal("");
    setData("");
    setFoto(null);
  }

  function closeModal() {
    setSelectedPerson(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedPerson) return;

    // Atualiza o array de pessoas com as novas informações
    setPeople((prev) =>
      prev.map((p) =>
        p.id === selectedPerson.id
          ? {
              ...p,
              informacao: info,
              vestimentasDesaparecido: vestimenta,
              localDesaparecimento: local,
              dataDesaparecimento: data,
            }
          : p
      )
    );

    // Salva também no array de informações extras, se quiser manter o histórico
    setInfosExtras((prev) => [
      ...prev,
      {
        personId: selectedPerson.id,
        informacao: info,
        vestimenta,
        local,
        data,
        fotoName: foto?.name,
      },
    ]);
    closeModal();
  }

  // Função para mostrar informações extras salvas localmente
  function renderInfosExtras(personId: number) {
    const infos = infosExtras.filter((i) => i.personId === personId);
    if (infos.length === 0) return null;
    return (
      <div className="mt-2 border-t pt-2">
        <div className="font-semibold text-sm text-gray-700 mb-1">
          Informações enviadas:
        </div>
        {infos.map((i, idx) => (
          <div key={idx} className="text-xs text-gray-700 mb-2">
            <div>
              <b>Informação:</b> {i.informacao}
            </div>
            {i.vestimenta && (
              <div>
                <b>Vestimenta:</b> {i.vestimenta}
              </div>
            )}
            {i.local && (
              <div>
                <b>Local:</b> {i.local}
              </div>
            )}
            {i.data && (
              <div>
                <b>Data:</b> {i.data}
              </div>
            )}
            {i.fotoName && (
              <div>
                <b>Foto:</b> {i.fotoName}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <header className="bg-blue-700 py-6 mb-6 shadow">
        <h1 className="text-center text-white text-2xl md:text-3xl font-bold tracking-wide">
          Portal de Pessoas Desaparecidas - PJC-MT
        </h1>
      </header>

      {/* Barra de busca centralizada */}
      <div className="flex justify-center mb-4">
        <div className="w-full max-w-4xl">
          <SearchBar value={q} onChange={setQ} onSubmit={() => setPage(1)} />
        </div>
      </div>

      {/* Filtros adicionais */}
      <div className="flex flex-wrap gap-4 justify-center mb-6">
        <select
          className="border rounded px-3 py-2"
          value={sexo || ""}
          onChange={(e) => setSexo(e.target.value || undefined)}
        >
          <option value="">Sexo (todos)</option>
          <option value="MASCULINO">Masculino</option>
          <option value="FEMININO">Feminino</option>
        </select>
        <select
          className="border rounded px-3 py-2"
          value={status || ""}
          onChange={(e) => setStatus(e.target.value || undefined)}
        >
          <option value="">Status (todos)</option>
          <option value="DESAPARECIDO">Desaparecido</option>
          <option value="LOCALIZADO">Localizado</option>
        </select>
        <input
          type="number"
          className="border rounded px-3 py-2 w-32"
          placeholder="Idade inicial"
          value={faixaIdadeInicial ?? ""}
          onChange={(e) =>
            setFaixaIdadeInicial(
              e.target.value ? Number(e.target.value) : undefined
            )
          }
        />
        <input
          type="number"
          className="border rounded px-3 py-2 w-32"
          placeholder="Idade final"
          value={faixaIdadeFinal ?? ""}
          onChange={(e) =>
            setFaixaIdadeFinal(
              e.target.value ? Number(e.target.value) : undefined
            )
          }
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => setPage(1)}
        >
          Filtrar
        </button>
        <button
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
          onClick={() => {
            setSexo(undefined);
            setStatus(undefined);
            setFaixaIdadeInicial(undefined);
            setFaixaIdadeFinal(undefined);
            setPage(1);
          }}
        >
          Limpar filtros
        </button>
      </div>

      {loading && <div>Carregando registros...</div>}
      {error && <div className="text-red-600">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {people.map((p) => (
          <PersonCard key={p.id} person={p} onReport={handleReport} />
        ))}
      </div>

      <Pagination
        page={page}
        total={total}
        pageSize={pageSize}
        onPageChange={setPage}
      />

      {/* Modal para incluir informações (salva localmente) */}
      {selectedPerson && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <form
            className="bg-white p-6 rounded shadow-lg max-w-md w-full space-y-4"
            onSubmit={handleSubmit}
          >
            <h2 className="font-bold text-lg mb-2">
              Incluir informações para {selectedPerson.nome}
            </h2>
            <div>
              <label className="block font-semibold mb-1">Informações</label>
              <textarea
                className="w-full border rounded px-2 py-1"
                value={info}
                onChange={(e) => setInfo(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Vestimenta</label>
              <input
                className="w-full border rounded px-2 py-1"
                value={vestimenta}
                onChange={(e) => setVestimenta(e.target.value)}
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">
                Local de avistamento
              </label>
              <input
                className="w-full border rounded px-2 py-1"
                value={local}
                onChange={(e) => setLocal(e.target.value)}
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">
                Data do avistamento
              </label>
              <input
                className="w-full border rounded px-2 py-1"
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Foto</label>
              <input
                className="w-full"
                type="file"
                accept="image/*"
                onChange={(e) => setFoto(e.target.files?.[0] || null)}
              />
            </div>
            <div className="flex gap-2 mt-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Enviar
              </button>
              <button
                type="button"
                className="bg-gray-300 px-4 py-2 rounded"
                onClick={closeModal}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
