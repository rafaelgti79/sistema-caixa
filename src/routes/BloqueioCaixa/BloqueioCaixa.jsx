import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export const BloqueioCaixa = ({ children }) => {
  const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
  const usuarioKey = usuario?.nome;
  const location = useLocation();

  const caixaAberto = localStorage.getItem(`caixaAberto_${usuarioKey}`);
  const caixaFechado = localStorage.getItem(`caixaFechado_${usuarioKey}`);

  const rotaAtual = location.pathname;

  // ✅ Bloqueia apenas se estiver tentando ir para a rota de abrir caixa
  if (
    rotaAtual === '/app/abrir-caixa' && 
    caixaAberto === 'true' && 
    caixaFechado === 'false'
  ) {
    return <Navigate to="/app/home-caixa" replace />;
  }

  return children;
};





/*
// src/routes/BloqueioCaixa.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

export const BloqueioCaixa = ({ children }) => {
  const caixaAberto = localStorage.getItem('caixaAberto');
  const caixaFechado = localStorage.getItem('caixaFechado');

  // Se o caixa está aberto e ainda não foi fechado, bloqueia o acesso
  if (caixaAberto === 'true' && caixaFechado === 'false') {
    return <Navigate to="/app/home-caixa" replace />;
  }

  return children;
}; */
