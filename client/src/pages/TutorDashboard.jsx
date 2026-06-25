import { useEffect, useState } from 'react';
import { getMyProfile, upsertMyProfile } from '../api/tutors';
import { createSlot, listMySlots, cancelSlot } from '../api/slots';
import { myTutorBookings } from '../api/bookings';
import Input from '../components/Input';
import Button from '../components/Button';
import SlotCard from '../components/SlotCard';
import BookingCard from '../components/BookingCard';

export default function TutorDashboard() {
  const [profile, setProfile] = useState(null);
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [form, setForm] = useState({ headline: '', bio: '', subjects: '', hourlyRate: 0, yearsExperience: 0 });
  const [slotForm, setSlotForm] = useState({ startTime: '', endTime: '' });
  const [msg, setMsg] = useState('');

  const refresh = async () => {
    const [p, s, b] = await Promise.all([getMyProfile(), listMySlots(), myTutorBookings()]);
    setProfile(p.tutor);
    setSlots(s.slots);
    setBookings(b.bookings);
    setForm({
      headline: p.tutor.headline || '',
      bio: p.tutor.bio || '',
      subjects: (p.tutor.subjects || []).join(', '),
      hourlyRate: p.tutor.hourlyRate || 0,
      yearsExperience: p.tutor.yearsExperience || 0,
    });
  };

  useEffect(() => { refresh(); }, []);

  const saveProfile = async (e) => {
    e.preventDefault();
    setMsg('');
    await upsertMyProfile({
      ...form,
      subjects: form.subjects.split(',').map(s => s.trim()).filter(Boolean),
      hourlyRate: Number(form.hourlyRate),
      yearsExperience: Number(form.yearsExperience),
    });
    setMsg('Profile saved.');
    refresh();
  };

  const addSlot = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      await createSlot({
        startTime: new Date(slotForm.startTime).toISOString(),
        endTime: new Date(slotForm.endTime).toISOString(),
      });
      setSlotForm({ startTime: '', endTime: '' });
      refresh();
    } catch (err) {
      setMsg(err.response?.data?.error?.message || 'Failed to add slot');
    }
  };

  const onCancelSlot = async (s) => { await cancelSlot(s._id); refresh(); };

  const earnings = bookings
    .filter(b => b.status !== 'cancelled')
    .length * (profile?.hourlyRate || 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Tutor Dashboard</h1>
        <p className="text-text-muted mt-1">Manage your profile, availability, and bookings.</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Stat label="Slots" value={slots.filter(s => s.status === 'open').length} sub="open" />
        <Stat label="Bookings" value={bookings.filter(b => b.status === 'confirmed').length} sub="confirmed" />
        <Stat label="Est. Earnings" value={`$${earnings}`} sub="lifetime" />
      </div>

      {msg && <div className="text-sm bg-bg-elevated border border-border rounded-lg p-3">{msg}</div>}

      <section className="grid lg:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-6 shadow-card">
          <h2 className="text-lg font-bold mb-4">Profile</h2>
          <form onSubmit={saveProfile} className="space-y-3">
            <Input label="Headline" value={form.headline}
              onChange={e => setForm({ ...form, headline: e.target.value })} />
            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-text-muted">Bio</span>
              <textarea className="input-base min-h-[100px]" value={form.bio}
                onChange={e => setForm({ ...form, bio: e.target.value })} />
            </label>
            <Input label="Subjects (comma-separated)" value={form.subjects}
              onChange={e => setForm({ ...form, subjects: e.target.value })} />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Hourly Rate ($)" type="number" min="0" value={form.hourlyRate}
                onChange={e => setForm({ ...form, hourlyRate: e.target.value })} />
              <Input label="Years Experience" type="number" min="0" value={form.yearsExperience}
                onChange={e => setForm({ ...form, yearsExperience: e.target.value })} />
            </div>
            <Button type="submit">Save Profile</Button>
          </form>
        </div>

        <div className="glass rounded-2xl p-6 shadow-card">
          <h2 className="text-lg font-bold mb-4">Add Slot</h2>
          <form onSubmit={addSlot} className="space-y-3">
            <Input label="Start" type="datetime-local" required value={slotForm.startTime}
              onChange={e => setSlotForm({ ...slotForm, startTime: e.target.value })} />
            <Input label="End" type="datetime-local" required value={slotForm.endTime}
              onChange={e => setSlotForm({ ...slotForm, endTime: e.target.value })} />
            <Button type="submit">Add Slot</Button>
          </form>

          <h3 className="mt-8 font-semibold">My Slots</h3>
          <div className="mt-3 space-y-2 max-h-80 overflow-y-auto pr-1">
            {slots.length === 0 ? (
              <p className="text-sm text-text-muted">No slots yet.</p>
            ) : slots.map(s => <SlotCard key={s._id} slot={s} onCancel={onCancelSlot} />)}
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold mb-4">Incoming Bookings</h2>
        {bookings.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center text-text-muted">No bookings yet.</div>
        ) : (
          <div className="space-y-3">
            {bookings.map(b => <BookingCard key={b._id} booking={b} perspective="tutor" />)}
          </div>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value, sub }) {
  return (
    <div className="glass rounded-2xl p-5 shadow-card">
      <div className="text-xs text-text-dim uppercase tracking-wider">{label}</div>
      <div className="text-3xl font-bold mt-1">{value}</div>
      {sub && <div className="text-xs text-text-muted mt-0.5">{sub}</div>}
    </div>
  );
}