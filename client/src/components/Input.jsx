export default function Input({ label, error, ...props }) {
  return (
    <label className="block space-y-1.5">
      {label && <span className="text-sm font-medium text-text-muted">{label}</span>}
      <input className="input-base" {...props} />
      {error && <span className="text-xs text-red-400">{error}</span>}
    </label>
  );
}