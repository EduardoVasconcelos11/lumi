# api-fatura - API para o Painel de Energia

Este é o backend API para o projeto Painel de Energia. Ele é responsável por gerenciar dados relacionados a faturas de energia, autenticação de usuários e processamento de dados.

## Descrição

Este projeto utiliza o framework [NestJS](https://github.com/nestjs/nest), um framework Node.js para construção de aplicações server-side eficientes e escaláveis.

## Funcionalidades

*   **Gerenciamento de Faturas:**
    *   Upload de faturas de energia (PDF em base64).
    *   Armazenamento e recuperação de dados de faturas.
    *   Extração de dados relevantes das faturas.
*   **Dados do Painel:**
    *   Fornecimento de dados resumidos de consumo de energia.
    *   Fornecimento de dados de resultados financeiros.
    *   Filtragem de dados por cliente e intervalo de datas.
*   **Autenticação:**
    *   [Descreva o método de autenticação, por exemplo, JWT, OAuth]
*   **Processamento de Dados:**
    *   [Descreva a lógica de processamento de dados, por exemplo, análise de faturas PDF, cálculo de economias]

## Tecnologias Utilizadas

*   [NestJS](https://nestjs.com/) (Node.js framework)
*   TypeScript
*   [Liste outras tecnologias, por exemplo, PostgreSQL, MongoDB, etc.]
*   [Liste quaisquer outras bibliotecas ou frameworks]

## Pré-requisitos

*   [Node.js](https://nodejs.org/) (versão 18 ou superior recomendada)
*   [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
*   [Banco de dados, por exemplo, PostgreSQL]
*   [Descreva como configurar o banco de dados]

## Instalação

1.  Clone o repositório:
    ```bash
    git clone [url-do-repositorio]
    cd api-fatura
    ```
2.  Instale as dependências:
    ```bash
    npm install
    # ou
    yarn install
    ```
3.  Configure as variáveis de ambiente:
    *   Crie um arquivo `.env` na raiz do diretório.
    *   Adicione as variáveis necessárias (por exemplo, string de conexão do banco de dados, chaves de API).
    *   Exemplo:
        ```
        DATABASE_URL=postgres://usuario:senha@host:porta/banco_de_dados
        JWT_SECRET=sua_chave_secreta_jwt
        ```
4.  [Descreva quaisquer migrações de banco de dados ou etapas de configuração]

## Executando a API

```bash
# Modo de desenvolvimento
npm run start:dev

# Modo de produção
npm run start:prod
Isso iniciará o servidor da API.
```


# 2. front-lumi

# front-lumi - Frontend do Painel de Energia

Este é o aplicativo frontend para o projeto Painel de Energia. Ele é construído com React e fornece uma interface de usuário para interagir com o backend `api-fatura`.

## Funcionalidades

*   **Painel (Dashboard):**
    *   Visualização de dados de consumo de energia (kWh).
    *   Visualização de resultados financeiros (R$).
    *   Filtragem de dados por cliente e intervalo de datas.
    *   Exibição de cards de resumo (consumo total, energia compensada, etc.).
*   **Biblioteca de Faturas:**
    *   Upload de faturas de energia (PDF).
    *   Visualização de uma lista de faturas carregadas.
    *   [Adicione mais recursos relacionados a faturas]
*   **Design Responsivo:**
    *   O aplicativo é projetado para funcionar em vários tamanhos de tela.
*   **Navegação por Barra Lateral:**
    *   Navegação fácil entre o Painel e a Biblioteca de Faturas.

## Tecnologias Utilizadas

*   React
*   TypeScript
*   Vite
*   React Router
*   Radix UI (para componentes de UI)
*   Tailwind CSS (para estilização)
*   Recharts (para gráficos)
*   Date-fns (para formatação de datas)
*   Lucide React (para ícones)
*   [Liste outras dependências do frontend]

## Pré-requisitos

*   Node.js (versão 18 ou superior recomendada)
*   npm ou yarn

## Instalação

1.  Clone o repositório:
    ```bash
    git clone [url-do-repositorio]
    cd front-lumi
    ```
2.  Instale as dependências:
    ```bash
    npm install
    # ou
    yarn install
    ```
3.  Configure as variáveis de ambiente:
    *   Crie um arquivo `.env` na raiz do diretório.
    *   Adicione as variáveis necessárias (por exemplo, URL base da API).
    *   Exemplo:
        ```
        VITE_API_BASE_URL=http://localhost:3000
        ```

## Executando o Frontend

```bash
npm run dev
# ou
yarn dev
Isso iniciará o servidor de desenvolvimento, e você poderá acessar o aplicativo em http://localhost:5173 (ou a URL fornecida no console).
```
```
Estrutura do Projeto
plaintext
front-lumi/
├── public/              # Assets estáticos
├── src/                 # Código fonte
│   ├── App.tsx          # Componente principal do aplicativo
│   ├── main.tsx         # Ponto de entrada
│   ├── components/      # Componentes de UI reutilizáveis
│   │   ├── ui/          # Componentes Radix UI
│   │   ├── dashboard/   # Componentes específicos do Painel
│   │   └── faturas/     # Componentes específicos da Biblioteca de Faturas
│   ├── pages/           # Páginas do aplicativo
│   ├── hooks/           # Hooks React personalizados
│   ├── lib/             # Funções utilitárias
│   ├── services/        # Lógica de interação com a API
│   └── ...
├── index.html           # Template HTML
├── ...
└── README.md            # Este arquivo
```
