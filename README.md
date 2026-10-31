# Explorador de Séries

## Autor
Mateus de Oliveira Mota — Matrícula 22505243

## Descrição
Aplicação que consulta a TVMaze API e exibe pôster, gêneros, status, nota e sinopse de séries de TV buscadas por nome. Nesta etapa ganhou persistência (séries favoritas salvas no Supabase) e foi empacotada em Docker.

## API utilizada
- TVMaze API — https://www.tvmaze.com/api
- Endpoint: `GET https://api.tvmaze.com/singlesearch/shows?q={nome-da-serie}`

## Funcionalidades
- Buscar série por nome
- Visualizar pôster, gêneros e status (em exibição/encerrada)
- Ver nota média e sinopse da série
- Mensagem amigável quando a série não é encontrada
- Favoritar séries, listar os favoritos ao abrir a página e excluí-los (salvos em banco de dados)

## Links
- Repositório GitHub: https://github.com/X-Mota/bootcamp2-app
- Aplicação no ar (GitHub Pages): https://x-mota.github.io/bootcamp2-app/
- Docker Hub: https://hub.docker.com/r/SEUUSER/bootcamp2-app

## Como executar com Docker
```
docker run -d -p 8080:80 SEUUSER/bootcamp2-app:1.1
```
Depois abra http://localhost:8080

## Como executar localmente (sem Docker)
1. Clone: `git clone https://github.com/X-Mota/bootcamp2-app.git`
2. Abra o arquivo `index.html` no navegador

## Persistência de dados
- **Banco escolhido:** Supabase (PostgreSQL), acessado direto do frontend com a biblioteca supabase-js.
- **O que é salvo:** as séries favoritas do usuário.
- **Tabela `favoritos`:**

| Coluna | Tipo | Descrição |
|---|---|---|
| id | bigint (identity, chave primária) | identificador |
| criado_em | timestamptz | data de criação (padrão now()) |
| nome_item | text | nome da série |
| dados_extra | jsonb | tvmaze_id, imagem, nota e status |

- **Operações:** criar (botão "Favoritar" no card), listar (seção "Meus favoritos", carregada ao abrir a página) e excluir (botão "Excluir" em cada item).
- **Limitação conhecida:** as políticas RLS estão abertas para a role `anon`, ou seja, qualquer visitante pode ler, inserir e excluir, e não há login de usuários. Isso é aceitável nesta etapa; em produção seriam necessários autenticação e políticas por usuário.

## Evidências das sidequests

### SQ1 · .dockerignore
O arquivo `.dockerignore` na raiz exclui `.git`, `README.md`, `docs/`, imagens e arquivos do próprio Docker. Assim eles não entram no contexto de build: o Docker envia menos dados ao daemon (build mais rápido) e a imagem final não carrega arquivos desnecessários (imagem menor e mais limpa, sem o histórico do git).

### SQ2 · Versionamento de imagem
Tags publicadas no Docker Hub: `1.0` (primeira versão funcional), `1.1` (rodapé atualizado) e `latest` (aponta para a 1.1).

### SQ3 · Descrição no Docker Hub
Overview preenchido com a descrição da aplicação, o comando `docker run` e o link do GitHub: https://hub.docker.com/r/SEUUSER/bootcamp2-app

### SQ4 · Dois containers e orquestração
![docker ps](docs/sq4-docker-ps.png)

Dois containers da mesma imagem rodando ao mesmo tempo, nas portas 8080 e 8081.

**E se eu tivesse 100 containers?** Subir, monitorar e reiniciar 100 containers manualmente seria inviável. O Kubernetes resolve isso como orquestrador. Um *cluster* é o conjunto de máquinas (nós) gerenciadas em conjunto. O *pod* é a menor unidade do Kubernetes e agrupa um ou mais containers que rodam juntos. Uma *réplica* é uma cópia idêntica de um pod: eu declaro quantas réplicas quero (por exemplo, 100) e o Kubernetes mantém esse número, recria pods que falham, distribui a carga entre os nós, escala para mais ou menos réplicas conforme a demanda e atualiza versões sem derrubar o serviço.
