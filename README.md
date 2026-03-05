# Comparison movie project

Installation process

# Pre-requisites

---

- Node 22
- Docker
- docker-compose
-

first install both UI and API projects

- Install dependancies

```bash
docker-compose up
```

```bash
cd UI
npm install
```

```bash
cd api
npm install
```

- Run the projects

```bash
cd UI
npm run dev
```

```bash
cd api
npm run dev
```

To test the UI please do in the UI directory

```bash
npx playwright install
```

## Front-end selection

On the front-end I selected `TanStack Query` for data-fetching for it's robust
caching mechanisms, and built-in support for loading and error states.

While `zustand` was initially considered for global state managment, further
analysis revealed that a state managment library was unnecesary.

### Front-end Changed requirements

In section 1.1.3 Requirements for Modal to view the result of the search The
`button` to start comparing the current movie selected in the modal, was moved,
from the left column, to the footer of the modal, where it is always available,
clear, and already a well known UX design.

## Backend Selection

The backend selection framework was driven by the project constraints and
development velocity, although I have extensive experience with `Oak` and
`Hono`, they were excluded to maintain a pure JavaScript environment. I opted
for `Fastify` over `Koa` or `Express` to capitalize on its superior performance
while maintaining a familiar architectural pattern. I evaluated `Koa` over
`Fastify`, but the `Sequalize` constraint let me to chose a more familiar
framework over a new library

## Chart Selection

The MUI charts library was selected mainly, because the project was already
using MUI, and it will keep the same design language, UI in the application
