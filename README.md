# GameLog

Plataforma de catálogo e resenhas de jogos construída com arquitetura de microservices (Spring Boot + Spring Cloud).

Trabalho da disciplina de Microservices - TP1 (Entrega 1).

## Integrantes

- Everton Rocha (trabalho individual, turma de segunda e quarta)

Por ser individual, todos os componentes (Discovery Server, API Gateway, microservices, bancos e documentação) são de minha responsabilidade.

## Descrição do Projeto

O GameLog resolve um problema simples: quem joga não tem um lugar único pra registrar o que jogou, dar nota e escrever uma resenha estruturada (prós, contras, horas jogadas, plataforma). Sites de review misturam nota de crítica com nota de usuário e não deixam o jogador organizar o próprio histórico.

O sistema tem dois domínios bem separados, e é por isso que a divisão em microservices faz sentido aqui:

- **Catálogo**: dados cadastrais dos jogos. Estrutura estável, muda pouco, é a "fonte da verdade".
- **Resenhas**: conteúdo gerado por usuário. Cresce muito mais rápido que o catálogo, tem estrutura flexível e é o que mais recebe escrita.

Separar os dois permite escalar e evoluir cada um no seu ritmo, com o banco certo pra cada carga.

## Arquitetura

```
                         ┌─────────────────────┐
        cliente ────────►│     api-gateway     │
                         │       :8080         │
                         └─────┬──────────┬────┘
                               │          │
              /api/games/**    │          │   /api/reviews/**
                               ▼          ▼
                    ┌────────────────┐  ┌────────────────┐
                    │ catalog-service│◄─┤ review-service │
                    │     :8081      │  │     :8082      │
                    └───────┬────────┘  └───────┬────────┘
                            │        Feign +    │
                            │        Resilience4j
                            ▼                   ▼
                     ┌────────────┐      ┌────────────┐
                     │ PostgreSQL │      │  MongoDB   │
                     │ catalogdb  │      │ reviewsdb  │
                     └────────────┘      └────────────┘

                    ┌─────────────────────────────────┐
                    │   discovery-server (Eureka)     │
                    │            :8761                │
                    │  todos os serviços se registram │
                    └─────────────────────────────────┘
```

- O **API Gateway** é o único ponto de entrada. O cliente nunca acessa as portas internas.
- O **Discovery Server (Eureka)** registra os serviços. Gateway e review-service resolvem os destinos pelo nome lógico (`lb://catalog-service`), não por host/porta fixos.
- Cada microservice é **dono dos seus dados**: o catálogo usa o database `catalogdb` (PostgreSQL) e as resenhas usam o `reviewsdb` (MongoDB). Nenhum serviço acessa o banco do outro.

## Microservices

| Serviço | Responsabilidade | Porta | Banco |
|---|---|---|---|
| discovery-server | Registro e descoberta de serviços (Eureka) | 8761 | - |
| api-gateway | Ponto único de entrada, roteamento | 8080 | - |
| catalog-service | CRUD do catálogo de jogos | 8081 | PostgreSQL (`catalogdb`) |
| review-service | Resenhas e notas dos jogos | 8082 | MongoDB (`reviewsdb`) |

Todas as portas e conexões são externalizáveis por variável de ambiente (`SERVER_PORT`, `EUREKA_URL`, `DB_URL`, `DB_USER`, `DB_PASSWORD`, `MONGO_URI`).

## Tecnologias

- Java 21
- Spring Boot 3.3.6
- Spring Cloud 2023.0.5 (Eureka, Gateway, OpenFeign, Circuit Breaker/Resilience4j)
- PostgreSQL 16 e MongoDB 7 (via Docker Compose)
- Maven

## Como executar

Pré-requisitos: JDK 21, Maven 3.9+ e Docker.

1. Suba os bancos:

```bash
docker compose up -d
```

O Postgres sobe em `localhost:5433` e o Mongo em `localhost:27018` (portas alternativas de propósito, pra não conflitar com instâncias locais).

2. Compile tudo:

```bash
mvn clean package -DskipTests
```

3. Suba os serviços, **nesta ordem**, cada um em um terminal:

```bash
java -jar discovery-server/target/discovery-server-1.0.0.jar
java -jar catalog-service/target/catalog-service-1.0.0.jar
java -jar review-service/target/review-service-1.0.0.jar
java -jar api-gateway/target/api-gateway-1.0.0.jar
```

(ou `mvn spring-boot:run` dentro de cada pasta)

4. Aguarde uns 30 segundos até todos aparecerem no Eureka e teste:

```bash
curl http://localhost:8080/api/games
```

O catalog-service já sobe com 4 jogos de exemplo.

> Se a porta 8081 ou 8082 estiver ocupada na sua máquina, rode com `SERVER_PORT` diferente. O gateway acha o serviço pelo Eureka, então a porta interna não importa.

## Discovery Server

- Dashboard: http://localhost:8761
- Os serviços `API-GATEWAY`, `CATALOG-SERVICE` e `REVIEW-SERVICE` aparecem registrados na seção "Instances currently registered with Eureka".
- Listagem via API: `curl -H "Accept: application/json" http://localhost:8761/eureka/apps`

## API Gateway

Rotas configuradas (`api-gateway/src/main/resources/application.yml`):

| Rota externa | Serviço destino |
|---|---|
| `/api/games/**` | `lb://catalog-service` |
| `/api/reviews/**` | `lb://review-service` |

## Endpoints

### catalog-service (via gateway)

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/games` | Lista os jogos |
| GET | `/api/games/{id}` | Busca um jogo |
| POST | `/api/games` | Cadastra um jogo |
| PUT | `/api/games/{id}` | Atualiza um jogo |
| DELETE | `/api/games/{id}` | Remove um jogo |

### review-service (via gateway)

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/reviews` | Lista as resenhas |
| GET | `/api/reviews/{id}` | Busca uma resenha |
| GET | `/api/reviews/game/{gameId}` | Resenhas de um jogo |
| GET | `/api/reviews/game/{gameId}/summary` | Nota média e total de resenhas |
| POST | `/api/reviews` | Cria uma resenha |
| DELETE | `/api/reviews/{id}` | Remove uma resenha |

## Exemplos de requisições

Tem uma coleção pronta no arquivo [requests.http](requests.http) (funciona no VS Code com a extensão REST Client e no IntelliJ).

Criar uma resenha:

```bash
curl -X POST http://localhost:8080/api/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "gameId": 2,
    "author": "Everton",
    "rating": 5,
    "text": "Dificil na medida certa.",
    "pros": ["exploracao", "chefes marcantes"],
    "cons": ["curva de aprendizado ingreme"],
    "platform": "PC",
    "hoursPlayed": 120
  }'
```

Cadastrar um jogo:

```bash
curl -X POST http://localhost:8080/api/games \
  -H "Content-Type: application/json" \
  -d '{"title": "Celeste", "genre": "Plataforma", "platform": "PC", "releaseYear": 2018, "developer": "EMD"}'
```

## Resiliência

O `review-service` chama o `catalog-service` (via OpenFeign) pra validar o jogo e copiar o título na hora de criar uma resenha. Essa comunicação está protegida com **Timeout + Circuit Breaker + Fallback** (Resilience4j).

Comportamento com o catálogo fora do ar:

- A resenha **é aceita mesmo assim** (HTTP 201), mas gravada com `gameVerified: false` e sem título. Degradar é melhor que rejeitar o usuário por causa de um serviço interno.
- Depois de 50% de falha em uma janela de 10 chamadas, o circuito **abre** e as chamadas seguintes nem tentam bater no catálogo (respondem direto pelo fallback).
- Estado do circuito: `curl http://localhost:8082/actuator/circuitbreakers`

Como testar: derrube o catalog-service (Ctrl+C no terminal dele), crie uma resenha via gateway e observe o `gameVerified: false`. Suba o catálogo de novo e, após alguns segundos, as novas resenhas voltam a ser verificadas.

Mais detalhes (com evidências de execução) no documento da proposta: [docs/proposta.md](docs/proposta.md).
