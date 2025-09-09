type Props = {
  page: number
  total: number
  pageSize: number
  onPageChange: (p: number) => void
}

export default function Pagination({ page, total, pageSize, onPageChange }: Props) {
  const totalPages = Math.ceil(total / pageSize)
  return (
    <div className="flex gap-2 items-center justify-center mt-4">
      <button disabled={page <= 1} onClick={() => onPageChange(page - 1)} className="px-3 py-1 border rounded">Anterior</button>
      <span>Página {page} de {totalPages}</span>
      <button disabled={page >= totalPages} onClick={() => onPageChange(page + 1)} className="px-3 py-1 border rounded">Próxima</button>
    </div>
  )
}