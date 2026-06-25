import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';

export default function Register() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const user = await register(form);
      navigate(user.role === 'tutor' ? '/tutor' : '/student');
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto pt-12">
      <div className="glass rounded-2xl p-8 shadow-card">
        <h1 className="text-2xl font-bold">Create your account</h1>
        <p className="text-text-muted mt-1 text-sm">Join as a student or tutor.</p>

        <div className="mt-6 grid grid-cols-2 gap-2 p-1 rounded-lg bg-bg-elevated border border-border">
          {['student', 'tutor'].map(r => (
            <button key={r} type="button" onClick={() => setForm({ ...form, role: r })}
              className={`py-2 rounded-md text-sm font-medium transition ${
                form.role === r ? 'bg-accent text-white shadow-glow' : 'text-text-muted hover:text-text'
              }`}>
              {r === 'student' ? 'I want to learn' : 'I want to teach'}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <Input label="Full name" required value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })} />
          <Input label="Email" type="email" required value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })} />
          <Input label="Password" type="password" required minLength={8} value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })} />
          {error && <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg p-3">{error}</div>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Creating…' : 'Create Account'}
          </Button>
        </form>

        <p className="text-sm text-text-muted text-center mt-6">
          Already have an account? <Link to="/login" className="text-accent hover:text-accent-hover">Sign in</Link>
        </p>
      </div>
    </div>
  );
}