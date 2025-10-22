
# EstacionamentoApi (exemplo com Vagas)

API ASP.NET Core com endpoints de **GET/POST/PUT/DELETE** para `Vagas`, Swagger habilitado e CORS liberado para desenvolvimento.

## Como rodar

```bash
# Requisitos: .NET 8 SDK
cd EstacionamentoApi

# Restore e run
dotnet restore
dotnet run
```

Acesse o Swagger:
- https://localhost:5001/swagger
- ou http://localhost:5000/swagger

## Endpoints
- `GET    /api/Vagas`
- `GET    /api/Vagas/{id}`
- `POST   /api/Vagas`
- `PUT    /api/Vagas/{id}`
- `DELETE /api/Vagas/{id}`

## Exemplos (curl)

```bash
# Criar (POST)
curl -k -i -X POST https://localhost:5001/api/Vagas   -H "Content-Type: application/json"   -d '{"placa":"ABC-1234","numeroVaga":10,"ocupada":false}'

# Atualizar (PUT)
curl -k -i -X PUT https://localhost:5001/api/Vagas/1   -H "Content-Type: application/json"   -d '{"placa":"DEF-5678","ocupada":true}'

# Excluir (DELETE)
curl -k -i -X DELETE https://localhost:5001/api/Vagas/1
```

## Observações
- O armazenamento é **em memória** (perde ao reiniciar).
- Ajuste o front para usar a mesma base URL/rota do Swagger (ex.: `https://localhost:5001/api/Vagas`).
- Se tiver erro de certificado HTTPS em dev: `dotnet dev-certs https --trust`.
