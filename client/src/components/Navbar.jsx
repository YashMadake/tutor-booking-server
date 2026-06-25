import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition ${
      isActive ? 'text-white bg-bg-elevated' : 'text-text-muted hover:text-text'
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/70 backdrop-blur-xl">
      <div className="container-app flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-purple-500 grid place-items-center shadow-glow">
            <span className="text-white font-bold">T</span>
          </div>
          <span className="font-bold text-lg tracking-tight">TutorHub</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <NavLink to="/tutors" className={linkClass}>Browse Tutors</NavLink>
          {user?.role === 'student' && <NavLink to="/student" className={linkClass}>My Bookings</NavLink>}
          {user?.role === 'tutor' && <NavLink to="/tutor" className={linkClass}>My Dashboard</NavLink>}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg-elevated border border-border">
                <span className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]" />
                <span className="text-sm text-text-muted">{user.name}</span>
                <span className="badge bg-accent/15 text-accent border border-accent/30">{user.role}</span>
              </span>
              <button onClick={handleLogout} className="btn-ghost text-sm">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost text-sm">Login</Link>
              <Link to="/register" className="btn-primary text-sm">Get Started</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}