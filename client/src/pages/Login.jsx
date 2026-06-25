import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const user = await login(form);
      navigate(user.role === 'tutor' ? '/tutor' : '/student');
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto pt-12">
      <div className="glass rounded-2xl p-8 shadow-card">
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="text-text-muted mt-1 text-sm">Sign in to continue learning.</p>

        <form onSubmit={submit} className="mt-8 space-y-4">
          <Input label="Email" type="email" required
            value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          <Input label="Password" type="password" required
            value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
          {error && <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg p-3">{error}</div>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Signing in…' : 'Sign In'}
          </Button>
        </form>

        <p className="text-sm text-text-muted text-center mt-6">
          New here? <Link to="/register" className="text-accent hover:text-accent-hover">Create an account</Link>
        </p>
      </div>
    </div>
  );
}