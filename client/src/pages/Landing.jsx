import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="relative">
      <div className="absolute inset-0 -z-10 bg-radial-glow opacity-60 pointer-events-none" />

      <section className="text-center pt-16 pb-24">
        <span className="badge bg-accent/10 text-accent border border-accent/30 mb-6">
          ✦ Built for serious learners
        </span>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
          Find your next <span className="bg-gradient-to-r from-accent to-purple-400 bg-clip-text text-transparent">breakthrough</span>
        </h1>
        <p className="mt-6 text-lg text-text-muted max-w-2xl mx-auto">
          Connect with expert tutors, book sessions instantly, and track your progress — all from one premium dashboard.
        </p>
        <div className="mt-10 flex items-center justify-center gap-3">
          <Link to="/register" className="btn-primary">Get Started Free</Link>
          <Link to="/tutors" className="btn-ghost">Browse Tutors</Link>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-6 pb-16">
        {[
          { t: 'Instant Booking', d: 'Reserve open slots in seconds, with zero double-booking.' },
          { t: 'Verified Tutors', d: 'Browse profiles, subjects, and rates before you commit.' },
          { t: 'Clean Dashboards', d: 'Track your sessions and earnings from one elegant interface.' },
        ].map(f => (
          <div key={f.t} className="glass rounded-2xl p-6 shadow-card">
            <div className="w-10 h-10 rounded-lg bg-accent/15 text-accent grid place-items-center mb-4">✦</div>
            <h3 className="font-semibold text-lg">{f.t}</h3>
            <p className="text-text-muted mt-2 text-sm">{f.d}</p>
          </div>
        ))}
      </section>
    </div>
  );
}