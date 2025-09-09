// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem('usuarioLogado');
    if (usuarioSalvo) {
      setUser(JSON.parse(usuarioSalvo));
    }
    setLoading(false);
  }, []);

  const login = (usuario) => {
    localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
    setUser(usuario);
    // ❌ Removido o navigate daqui
  };

  const logout = () => {
    localStorage.removeItem('usuarioLogado');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
