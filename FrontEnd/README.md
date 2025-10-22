
# Front Estacionamento (Home + Vagas + Veículos) — Estilizado

- **Home** com KPIs e ações rápidas
- **Vagas** (CRUD) — inputs controlados, validação e tabela
- **Veículos** (CRUD) — formulário completo (placa, marca, modelo, cor, ano, observações)

## Rodar
```bash
npm i
npm run dev
```

## API
- Proxy do Vite encaminha `/api` para `https://localhost:5001` (certificado de dev aceito).
- Alternativa: `.env` com `VITE_API_URL=https://localhost:5001` para usar base direta.

## Rotas
- `/` — Home
- `/vagas` — Vagas
- `/veiculos` — Veículos

> As chamadas de **Veículos** esperam endpoints REST em `/api/Veiculos` (GET/POST/PUT/DELETE). Ajuste `src/client.ts` se sua API usar outro caminho/nome.
