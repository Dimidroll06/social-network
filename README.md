<div align="center">

# social-network

**Multi-service social network built with npm workspaces: Express 5 + TypeScript on the backend, React + Vite on the client**

[🇷🇺 Read in Russian](./README-RU.md)

![License](https://img.shields.io/github/license/Dimidroll06/social-network?style=for-the-badge&color=blue)
![Node](https://img.shields.io/badge/node-22.12%2B-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?style=for-the-badge&logo=express&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Status](https://img.shields.io/badge/status-in%20development-orange?style=for-the-badge)

</div>

---

## About

`social-network` is a pet project — a social network split into separate services: auth, users and feed. All the infrastructure lives in a single npm workspaces repository:

- **auth-service** — registration, login and tokens;
- **user-service** — user profiles and data;
- **feed-service** — posts and the feed;
- **frontend-service** — React client that talks to the services over HTTP;
- **@shared/common** — shared backend code (middleware, later logger, zod, error classes);
- **@shared/types** — shared types for the services and the client.

---

## Stack

| Layer | Technologies |
| --- | --- |
| Backend | Node.js 22.12+, Express 5, TypeScript 5.9, `tsx` |
| Frontend | React 19, Vite 8, TypeScript 5.9 |
| Monorepo | npm workspaces |
| Code quality | ESLint 10 (flat config), `tsc --noEmit` |
| Security | `helmet`, `express-rate-limit` |

---

## Requirements

- Node.js **>= 22.12.0** (required by Vite 8);
- npm 10+.

---

## Installation and Usage

Clone the repository and install dependencies:

```bash
git clone https://github.com/Dimidroll06/social-network.git
cd social-network
npm install
```

Start everything at once (services and the client in parallel):

```bash
npm run dev
```

Start individual parts:

```bash
npm run dev:backend      # auth, user and feed only
npm run dev:auth         # auth-service only
npm run dev:user         # user-service only
npm run dev:feed         # feed-service only
npm run dev:frontend     # React client only
```

### Addresses

| Service | Port | Check |
| --- | --- | --- |
| auth-service | 4001 | http://localhost:4001/api/auth/health |
| user-service | 4002 | http://localhost:4002/api/user/health |
| feed-service | 4003 | http://localhost:4003/api/feed/health |
| frontend-service | 5173 | http://localhost:5173 |

---

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | All services and the client in parallel |
| `npm run dev:backend` | Backend services only |
| `npm run dev:<service>` | A single service or the client (`auth`, `user`, `feed`, `frontend`) |
| `npm run start:<service>` | Start without watch mode |
| `npm run typecheck` | `tsc --noEmit` across all workspaces |
| `npm run lint` / `lint:fix` | ESLint for the repo / with autofix |
| `npm run build` | Production build of the frontend |

---

## Project Structure

```text
social-network/
├── apps/
│   ├── auth-service/              # Express + TypeScript, port 4001
│   │   └── src/
│   │       ├── controllers/       # HTTP controllers
│   │       ├── services/          # business logic
│   │       ├── routes/            # main routes, sub-routes are mounted in index.ts
│   │       ├── app.ts             # Express app setup
│   │       └── index.ts           # entry point
│   ├── user-service/              # same structure, port 4002
│   ├── feed-service/              # same structure, port 4003
│   └── frontend-service/          # React + Vite, port 5173
│       └── src/                   # client application
├── packages/
│   ├── common/                    # reusable code for all microservices
│   └── types/                     # shared application types
├── eslint.config.mjs              # single ESLint config
├── tsconfig.base.json             # shared tsconfig
├── package.json                   # workspaces and scripts
├── README.md                      # English version
└── README-RU.md                   # Russian version
```

---

## Architecture

Each service is split into layers: **Service** — business logic, **Controller** — HTTP layer, **Route** — registers controller methods on a `Router`.

**Runtime.** Service code runs through `tsx` without a separate build step; types are checked with `npm run typecheck`. The frontend is built with Vite.

---

## License

This project is distributed under the **MIT** license. See the [LICENSE](./LICENSE) file for details.
