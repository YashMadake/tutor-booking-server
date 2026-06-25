import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTutor } from '../api/tutors';
import { listTutorOpenSlots } from '../api/slots';
import { createBooking } from '../api/bookings';
import { useAuth } from '../context/AuthContext';
import SlotCard from '../components/SlotCard';

export default function TutorDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tutor, setTutor] = useState(null);
  const [slots, setSlots] = useState([]);
  const [msg, setMsg] = useState('');

  const refresh = async () => {
    const [t, s] = await Promise.all([getTutor(id), listTutorOpenSlots(id)]);
    setTutor(t.tutor);
    setSlots(s.slots);
  };

  useEffect(() => { refresh(); }, [id]);

  const book = async (slot) => {
    if (!user) return navigate('/login');
    if (user.role !== 'student') return setMsg('Only students can book.');
    try {
      await createBooking(slot._id);
      setMsg('Booked! Check your dashboard.');
      refresh();
    } catch (err) {
      setMsg(err.response?.data?.error?.message || 'Booking failed');
    }
  };

  if (!tutor) return <div className="text-text-muted">Loading…</div>;
  const initials = tutor.user?.name?.split(' ').map(s => s[0]).slice(0, 2).join('');

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <aside className="lg:col-span-1">
        <div className="glass rounded-2xl p-6 shadow-card">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent to-purple-500 grid place-items-center text-white font-bold text-2xl shadow-glow">{initials}</div>
          <h1 className="mt-4 text-2xl font-bold">{tutor.user.name}</h1>
          <p className="text-text-muted">{tutor.headline}</p>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-text-dim uppercase">Rate</div>
              <div className="text-xl font-bold">${tutor.hourlyRate}<span className="text-sm font-normal text-text-muted">/hr</span></div>
            </div>
            <div>
              <div className="text-xs text-text-dim uppercase">Experience</div>
              <div className="text-xl font-bold">{tutor.yearsExperience}<span className="text-sm font-normal text-text-muted"> yrs</span></div>
            </div>
          </div>

          {tutor.subjects?.length > 0 && (
            <div className="mt-6">
              <div className="text-xs text-text-dim uppercase mb-2">Subjects</div>
              <div className="flex flex-wrap gap-1.5">
                {tutor.subjects.map(s => (
                  <span key={s} className="badge bg-bg-elevated border border-border text-text-muted">{s}</span>
                ))}
              </div>
            </div>
          )}

          {tutor.bio && (
            <div className="mt-6">
              <div className="text-xs text-text-dim uppercase mb-2">About</div>
              <p className="text-sm text-text-muted leading-relaxed">{tutor.bio}</p>
            </div>
          )}
        </div>
      </aside>

      <section className="lg:col-span-2">
        <h2 className="text-xl font-bold mb-4">Available Slots</h2>
        {msg && <div className="mb-4 text-sm bg-bg-elevated border border-border rounded-lg p-3">{msg}</div>}
        {slots.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center text-text-muted">No open slots right now.</div>
        ) : (
          <div className="space-y-3">
            {slots.map(s => <SlotCard key={s._id} slot={s} onBook={book} />)}
          </div>
        )}
      </section>
    </div>
  );
}