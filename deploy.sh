#!/bin/bash

# Caminhos
PROJETO_DIR=~/sistema-caixa/sistema-caixa
BUILD_DIR=$PROJETO_DIR/dist
DESTINO_NGINX=/var/www/html
PM2_PROCESS_NAME=api  # 👈 Altere para o nome real do processo no pm2

echo "📦 Acessando o diretório do projeto..."
cd $PROJETO_DIR || { echo "❌ Projeto não encontrado"; exit 1; }

echo "📥 Atualizando código com git pull..."
git pull origin main || { echo "❌ Falha no git pull"; exit 1; }

echo "📦 Instalando dependências (npm install)..."
npm install || { echo "❌ Falha no npm install"; exit 1; }

echo "⚙️ Gerando build de produção..."
npm run build || { echo "❌ Falha no build"; exit 1; }

echo "🧹 Limpando arquivos antigos do Nginx..."
sudo rm -rf $DESTINO_NGINX/*

echo "🚚 Copiando novos arquivos do build para o Nginx..."
sudo cp -r $BUILD_DIR/* $DESTINO_NGINX/

echo "♻️ Reiniciando processo PM2: $PM2_PROCESS_NAME"
pm2 restart $PM2_PROCESS_NAME || { echo "❌ Falha ao reiniciar PM2"; exit 1; }

echo "✅ Deploy concluído! Front e backend atualizados."
