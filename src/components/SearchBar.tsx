type Props = {
  value: string
  onChange: (v: string) => void
  onSubmit?: () => void
}

export default function SearchBar({ value, onChange, onSubmit }: Props) {
  return (
    <form
      className="flex gap-2"
      onSubmit={e => {
        e.preventDefault();
        onSubmit && onSubmit();
      }}
    >
      <input
        type="text"
        className="flex-1 border rounded px-3 py-2"
        placeholder="Buscar por nome..."
        value={value}
        onChange={e => onChange(e.target.value)}
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Buscar
      </button>
    </form>
  );
}