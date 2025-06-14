import React from 'react';
import { Navigate } from 'react-router-dom';

export function PrivateRoute({ children, allowed }) {
  const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));

  if (!usuario) return <Navigate to="/login" />;
  if (allowed && !allowed.includes(usuario.tipo)) return <Navigate to="/app/nao-autorizado" />;

  return children;
}