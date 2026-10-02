
![Student reference](references/linkin-brand.png)

# Documentação do Projeto: Linkin (Aplicação Web MVC)

**Disciplina:** Desenvolvimento Web 1 (DW1) – 3º Bimestre 2026  
**Atividade Avaliativa:** Aplicação Web Funcional Baseada na Arquitetura Cliente/Servidor e Padrão MVC  
**Data da Entrega:** 01/10/2026  

---

## 1. Escopo e Visão Geral do Tema

O **Linkin** é uma rede social simples para compartilhamento de publicações com imagens e descrições, inspirada em plataformas como Instagram/LinkedIn. O sistema opera sob o modelo de arquitetura **Cliente/Servidor** com o padrão **MVC (Model-View-Controller)**, integrado ao banco de dados relacional **PostgreSQL**.

### Funcionalidades Principais:
* **Feed Principal (Home):** Visualização dinâmica de todas as publicações cadastradas.
* **Gestão de Postagens (Manage Posts):** CRUD completo de postagens com pesquisa, inserção, alteração, exclusão e gerenciamento/upload de imagens (`.png`).
* **Gestão de Contas (Manage Accounts):** Interface para controle e visualização das contas cadastradas.
* **Página Institucional/Marca (Linkin):** Tela com identidade visual da aplicação.

---

## 2. Requisitos do Front-End (Cliente)

### 2.1 Estrutura Semântica HTML5
O front-end é construído utilizando tags semânticas do HTML5 (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`).

### 2.2 Navegação e Componentes Obrigatórios
A aplicação possui 4 páginas interligadas que utilizam o mesmo componente de navegação lateral (`menu.html` / `menu.js` / `menu.css`):
1. `frontend/home/home.html` – Feed de postagens.
2. `frontend/post/post.html` – Interface de gerenciamento do CRUD de postagens.
3. `frontend/account/account.html` – Gestão e visualização de contas/usuários.
4. `frontend/linkin/linkin.html` – Tela de boas-vindas / Marca.

### 2.3 Gerenciamento de Imagens
No gerenciamento de posts (`post.html`), o usuário pode selecionar ou arrastar uma imagem (`.png`), que é processada via `multer` e `sharp` no backend e armazenada localmente na pasta `backend/public/images/` com a referência armazenada na coluna `img_id` da tabela `POST`.

---

## 3. Requisitos do Back-End e Banco de Dados (Servidor)

### 3.1 Tecnologias e Dependências
* **Node.js** com **Express**: Servidor web e mapeamento de rotas.
* **pg (node-postgres)**: Driver de conexão com o banco PostgreSQL.
* **dotenv**: Gerenciamento de variáveis de ambiente.
* **multer** & **sharp**: Manipulação, upload e redimensionamento/conversão de imagens.
* **cors**: Permissão de requisições cross-origin entre front-end e back-end.

### 3.2 Estrutura do Padrão MVC (Inspirada no modelo `candyshop`)
```text
NomeDoAluno_3bim_Linkin/
├── backend/
│   ├── config/
│   │   └── database.js         # Conexão com PostgreSQL utilizando pg.Pool
│   ├── controllers/
│   │   ├── accountController.js # Lógica de negócios de contas/usuários
│   │   └── postController.js    # Lógica de negócios de posts e uploads
│   ├── routes/
│   │   ├── accountRoutes.js     # Mapeamento de endpoints de contas
│   │   └── postRoutes.js        # Mapeamento de endpoints de posts
│   ├── public/
│   │   └── images/             # Armazenamento das imagens estáticas (.png)
│   ├── .env                    # Variáveis de ambiente (DB e Server)
│   └── server.js               # Ponto de entrada do servidor Node.js
├── frontend/
│   ├── home/                   # View: Feed de Notícias
│   ├── post/                   # View: CRUD de Publicações
│   ├── account/                # View: Gestão de Contas
│   ├── menu/                   # Componente Reutilizável de Menu
│   └── linkin/                 # View: Splash/Marca
├── sql-files/
│   ├── create.sql              # DDL (Criação de Tabelas)
│   └── insert.sql              # DML (Carga Inicial - 20 registros por tabela)
├── references/                 # Logos, ícones e assets estáticos
├── package.json
└── README.md