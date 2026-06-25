export default function BookingCard({ booking, onCancel, perspective = 'student' }) {
  const slot = booking.slot;
  const other = perspective === 'student' ? booking.tutor : booking.student;
  const start = new Date(slot.startTime);
  const end = new Date(slot.endTime);

  const statusColors = {
    confirmed: 'bg-green-500/10 text-green-400 border-green-500/30',
    cancelled: 'bg-red-500/10 text-red-400 border-red-500/30',
    completed: 'bg-accent/10 text-accent border-accent/30',
  };

  return (
    <div className="glass rounded-xl p-5 flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-purple-500 grid place-items-center text-white font-bold shrink-0">
          {other?.name?.[0] || '?'}
        </div>
        <div>
          <div className="font-semibold">{other?.name}</div>
          <div className="text-sm text-text-muted">
            {start.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })} – {end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className={`badge border ${statusColors[booking.status]}`}>{booking.status}</span>
        {onCancel && booking.status === 'confirmed' && (
          <button onClick={() => onCancel(booking)} className="btn-danger text-sm">Cancel</button>
        )}
      </div>
    </div>
  );
}