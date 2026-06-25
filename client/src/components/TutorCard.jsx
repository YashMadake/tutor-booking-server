import { Link } from 'react-router-dom';

export default function TutorCard({ tutor }) {
  const initials = tutor.user?.name?.split(' ').map(s => s[0]).slice(0, 2).join('') || 'T';
  return (
    <Link
      to={`/tutors/${tutor.user._id}`}
      className="group glass rounded-2xl p-6 shadow-card hover:border-border-hover hover:shadow-glow transition"
    >
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent to-purple-500 grid place-items-center text-white font-bold text-lg shadow-glow shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-text truncate">{tutor.user?.name}</h3>
          <p className="text-sm text-text-muted line-clamp-1">{tutor.headline || 'Tutor'}</p>
        </div>
      </div>
      <p className="mt-4 text-sm text-text-muted line-clamp-2 min-h-[2.5rem]">{tutor.bio || 'No bio yet.'}</p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {(tutor.subjects || []).slice(0, 3).map(s => (
          <span key={s} className="badge bg-bg-elevated border border-border text-text-muted">{s}</span>
        ))}
      </div>
      <div className="mt-5 flex items-center justify-between pt-4 border-t border-border">
        <div>
          <div className="text-xs text-text-dim uppercase tracking-wider">Rate</div>
          <div className="text-lg font-bold text-text">${tutor.hourlyRate || 0}<span className="text-sm font-normal text-text-muted">/hr</span></div>
        </div>
        <span className="text-sm text-accent group-hover:translate-x-1 transition">View →</span>
      </div>
    </Link>
  );
}