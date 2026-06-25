export default function SlotCard({ slot, onBook, onCancel, actionLabel = 'Book' }) {
  const start = new Date(slot.startTime);
  const end = new Date(slot.endTime);
  const dateStr = start.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
  const timeStr = `${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

  const statusColors = {
    open: 'bg-green-500/10 text-green-400 border-green-500/30',
    booked: 'bg-accent/10 text-accent border-accent/30',
    cancelled: 'bg-red-500/10 text-red-400 border-red-500/30',
  };

  return (
    <div className="glass rounded-xl p-4 flex items-center justify-between gap-4 hover:border-border-hover transition">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold">{dateStr}</span>
          <span className={`badge border ${statusColors[slot.status]}`}>{slot.status}</span>
        </div>
        <div className="text-sm text-text-muted">{timeStr}</div>
      </div>
      {onBook && slot.status === 'open' && (
        <button onClick={() => onBook(slot)} className="btn-primary text-sm">{actionLabel}</button>
      )}
      {onCancel && slot.status === 'open' && (
        <button onClick={() => onCancel(slot)} className="btn-danger text-sm">Cancel</button>
      )}
    </div>
  );
}