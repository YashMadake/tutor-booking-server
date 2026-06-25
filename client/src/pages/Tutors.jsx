import { useEffect, useState } from 'react';
import { listTutors } from '../api/tutors';
import TutorCard from '../components/TutorCard';

export default function Tutors() {
  const [tutors, setTutors] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    listTutors({ q }).then(d => setTutors(d.tutors)).finally(() => setLoading(false));
  }, [q]);

  return (
    <div>
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Browse Tutors</h1>
          <p className="text-text-muted mt-1">Find the perfect match for your goals.</p>
        </div>
        <input className="input-base max-w-xs" placeholder="Search by name or topic…"
          value={q} onChange={e => setQ(e.target.value)} />
      </div>

      {loading ? (
        <div className="text-text-muted">Loading…</div>
      ) : tutors.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center text-text-muted">No tutors yet.</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {tutors.map(t => <TutorCard key={t._id} tutor={t} />)}
        </div>
      )}
    </div>
  );
}