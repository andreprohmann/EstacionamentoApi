# Frontend React — Estacionamento

Frontend em **React + Vite + TypeScript** para a API Minimal (.NET 8) do Estacionamento.

## Requisitos
- Node.js 18+ e npm

## Rodar local
```bash
cd estacionamento-web
cp .env.example .env     # ajuste a URL da API se necessário
npm install
npm run dev
```
Acesse: http://localhost:5173

## Build de produção
```bash
npm run build
npm run preview
```

## Configurar API base
Edite `.env`:
```
VITE_API_BASE_URL=http://localhost:5000
```

> Certifique-se de que sua API .NET esteja rodando e acessível.
