
# Estacionamento API

Este projeto é uma API para gerenciamento de estacionamento, desenvolvida com ASP.NET Core no back-end e React no front-end. Ele permite o controle de entrada e saída de veículos, cálculo de tempo e valor de permanência, e gerenciamento de vagas.

## Tecnologias Utilizadas
- Back-end: ASP.NET Core
- Banco de Dados: MySQL
- ORM: Entity Framework Core
- Front-end: React
- Ferramentas: Swagger para documentação da API

## Configuração do Banco de Dados
A conexão com o banco de dados MySQL é configurada no arquivo appsettings.json:

"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=estacionamento;User=root;Password=123456;"
}

No Program.cs, o serviço do Entity Framework é registrado:

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(builder.Configuration.GetConnectionString("DefaultConnection"),
    new MySqlServerVersion(new Version(8, 0, 29))));

## Estrutura do Projeto
- Models/: Contém as classes que representam as entidades do sistema (Veiculo, Vaga, Movimentacao).
- Controllers/: Define as rotas da API e os métodos CRUD.
- Data/AppDbContext.cs: Contexto do banco de dados.
- Program.cs: Configuração geral da aplicação.

## Rotas da API
### Veículos
- GET /api/veiculos – Lista todos os veículos
- GET /api/veiculos/{id} – Retorna um veículo específico
- POST /api/veiculos – Cadastra um novo veículo
- PUT /api/veiculos/{id} – Atualiza os dados de um veículo
- DELETE /api/veiculos/{id} – Remove um veículo

### Vagas
- GET /api/vagas – Lista todas as vagas
- POST /api/vagas – Cadastra uma nova vaga
- PUT /api/vagas/{id} – Atualiza uma vaga
- DELETE /api/vagas/{id} – Remove uma vaga

### Movimentações
- GET /api/movimentacoes – Lista todas as movimentações
- POST /api/movimentacoes – Registra entrada de veículo
- PUT /api/movimentacoes/{id} – Registra saída e calcula valor
- DELETE /api/movimentacoes/{id} – Remove movimentação

## Funcionalidades
- Cadastro de veículos
- Controle de entrada e saída
- Cálculo automático de tempo e valor
- Gerenciamento de vagas
- Integração com front-end React

## Como Executar
1. Clone o repositório:
   git clone https://github.com/andreprohmann/estacionamento_C-_React.git

2. Configure o banco de dados MySQL e atualize appsettings.json.

3. Execute as migrações:
   dotnet ef database update

4. Inicie a API:
   dotnet run

5. Acesse o Swagger em http://localhost:{porta}/swagger para testar as rotas.
