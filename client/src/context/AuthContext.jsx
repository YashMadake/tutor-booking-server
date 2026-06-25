import { createContext, useContext, useState, useEffect } from 'react';
import * as authApi from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

  const login = async (creds) => {
    setLoading(true);
    try {
      const { user, token } = await authApi.login(creds);
      localStorage.setItem('token', token);
      setUser(user);
      return user;
    } finally { setLoading(false); }
  };

  const register = async (data) => {
    setLoading(true);
    try {
      const { user, token } = await authApi.register(data);
      localStorage.setItem('token', token);
      setUser(user);
      return user;
    } finally { setLoading(false); }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);