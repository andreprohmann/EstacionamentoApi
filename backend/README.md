
# EstacionamentoApi (Minimal API .NET 8 + EF Core + MySQL)

CRUD de **Veículos** relacionado a **Vagas** com regra de negócio que impede duas entidades usarem a mesma vaga simultaneamente.

## Pré-requisitos
- [.NET 8 SDK](https://dotnet.microsoft.com/en-us/download)
- MySQL 8.x (local ou Docker)
- CLI do EF Core:
  ```bash
  dotnet tool install --global dotnet-ef
  ```

## Configurar conexão
Edite `appsettings.json` e ajuste a **ConnectionStrings:Default**:
```json
"Server=localhost;Port=3306;Database=EstacionamentoDb;User Id=seu_usuario;Password=sua_senha;"
```

> Dica: com o **Pomelo.EntityFrameworkCore.MySql**, `ServerVersion.AutoDetect` descobre a versão do MySQL a partir da connection string.

## Subir MySQL com Docker (opcional)
Arquivo `docker-compose.yml` incluído. Para subir:
```bash
docker compose up -d
```
Credenciais padrão:
- servidor: `localhost:3307`
- db: `EstacionamentoDb`
- usuário: `dev`
- senha: `devpass`

Neste caso, use a string:
```json
"Server=localhost;Port=3307;Database=EstacionamentoDb;User Id=dev;Password=devpass;"
```

## Criar banco (EF Core Migrations)
```bash
cd EstacionamentoApi
# criar primeira migration
dotnet ef migrations add InitialCreate
# aplicar
dotnet ef database update
```

## Rodar
```bash
dotnet run
```
Abra o Swagger: `http://localhost:5080/swagger` (a porta exata aparece no console).

## Endpoints principais
- `GET /vagas` | `POST /vagas` | `PUT /vagas/{id}` | `DELETE /vagas/{id}`
- `GET /veiculos` | `POST /veiculos` | `PUT /veiculos/{id}` | `DELETE /veiculos/{id}`
- `POST /veiculos/{id}/ocupar/{vagaId}`
- `POST /veiculos/{id}/liberar`

### Observações
- `Placa` e `Numero` são únicos.
- `VagaId` em veículo é **opcional**; validações garantem que uma vaga não seja ocupada por dois veículos.
- Ao apagar uma **Vaga**, os veículos vinculados têm o FK definido como **NULL**.

## Exemplo de atualização para mover/liberar veículo
Mover para a vaga 1:
```json
{
  "vagaId": 1,
  "vagaIdHasValue": true
}
```
Liberar a vaga:
```json
{
  "vagaId": null,
  "vagaIdHasValue": true
}
```
