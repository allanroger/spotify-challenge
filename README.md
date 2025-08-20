# 🎵 Spotify Challenge

Aplicação Vite + React + TypeScript + Tailwind que consome a **API do Spotify** para listar artistas, álbuns e faixas, com autenticação OAuth2 (PKCE).  
Projeto inclui testes unitários e de componentes com **Jest** e **React Testing Library**.

## 📋 Pré-requisitos

- **Node.js** 18+  
- **npm** ou **yarn**
- Conta no [Spotify Developer](https://developer.spotify.com/dashboard)

## ⚙️ Configuração do Spotify

1. Acesse o [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).  
2. Clique em **Create an App**.  
3. Defina:
    - **App name** → `Spotify Challenge`  
    - **Redirect URI** → `http://localhost:3000/callback`
4. Salve as alterações.
5. Copie o **Client ID** gerado.

## 🔑 Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_SPOTIFY_CLIENT_ID=SEU_CLIENT_ID_AQUI
VITE_SPOTIFY_REDIRECT_URI=http://localhost:3000/callback
VITE_SPOTIFY_SCOPES=user-read-email user-read-private user-read-recently-played
````

## 🛠️ Instalação

Clone o repositório e instale as dependências:

```
git clone https://github.com/allanroger/spotify-challenge.git
cd spotify-challenge
npm install
```

## 🚀 Rodando a aplicação

Inicie o servidor de desenvolvimento:

```
npm run dev
```

Abra no navegador: http://localhost:3000

## 🧪 Rodando os testes

O projeto usa Jest + React Testing Library.
Cada componente possui sua própria pasta de testes (*.test.tsx).

Rodar todos os testes:
```
npm test
````

Rodar em modo watch:
```
npm run test:watch
````

Rodar com cobertura:
````
npm run test:coverage
````

## 🗂️ Estrutura do projeto

```
src/
  ├── api/              # chamadas à API do Spotify
  ├── assets/           # imagens, vídeos, ícones
  ├── auth/             # fluxo OAuth PKCE
  ├── components/       # componentes React + testes
  │   ├── NavBar/
  │   ├── ArtistCard/
  │   ├── ArtistList/
  │   ├── Pagination/
  │   ├── SearchBar/
  │   └── ...
  ├── context/          # contexto global (useApp)
  ├── hooks/            # custom hooks
  ├── i18n/             # tradução (pt/en)
  ├── pages/            # páginas da aplicação
  ├── utils/            # funções utilitárias
  └── main.tsx          # entrypoint React
````

## ✅ Funcionalidades

* 🔐 Login via OAuth2 + PKCE (Spotify)
* 🎤 Buscar artistas
* 💿 Listar álbuns
* 🎶 Listar faixas do álbum
* 🌍 Suporte a múltiplos idiomas (pt/en)
* 📱 Layout responsivo
* 🧪 Testes unitários e de integração com Jest + RTL

## 📄 Licença

Este projeto é apenas para fins de estudo/desafio.

Spotify é uma marca registrada da Spotify AB.