# ReadFlow — Frontend

ReadFlow es una plataforma web de gestión de lectura y estudio. Permite a los usuarios crear sesiones de estudio, generar quizzes, hacer seguimiento de su progreso y mantener rachas de actividad. Incluye un panel de administración con analíticas globales.

## Tech Stack

- **Next.js** con App Router y React
- **TypeScript** con modo estricto
- **Tailwind CSS** para estilos y componentes
- **Recharts** para visualización de estadísticas
- **Zod** para validación de esquemas

## Requisitos previos

- Node.js 18+
- npm, yarn, pnpm o bun
- Una instancia del backend de ReadFlow corriendo (ver variable `EXTERNAL_API_URL`)

## Instalación

1. **Clona el repositorio**

```bash
git clone https://github.com/AngelChame/readflow-frontend.git
cd ReadFlow-frontend
```

2. **Instala las dependencias**

```bash
npm install
```

3. **Configura las variables de entorno**

Copia el archivo de ejemplo y rellena los valores correspondientes:

```bash
cp .env.example .env.local
```

Edita `.env.local` con los valores de tu entorno (ver sección [Variables de entorno](#variables-de-entorno)).

4. **Inicia el servidor de desarrollo**

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo en `localhost:3000` |
| `npm run build` | Genera el build de producción |
| `npm run start` | Inicia el servidor de producción (requiere build previo) |
| `npm run lint` | Ejecuta ESLint sobre el proyecto |

## Variables de entorno

| Variable | Requerida | Descripción |
|---|---|---|
| `EXTERNAL_API_URL` | Sí | URL base del backend de ReadFlow (ej. `http://localhost:8080/api/v1`) |
| `ADMIN_TOKEN` | Sí | Token de autenticación para las rutas de administración |

Consulta `.env.example` para ver un ejemplo de cada variable.

## Estructura del proyecto

```
src/
├── app/                  # Rutas y páginas (Next.js App Router)
│   ├── (admin)/          # Layout y páginas del panel admin
│   ├── (auth)/           # Login y registro
│   ├── (main)/           # Páginas autenticadas (dashboard, historial, stats)
│   └── api/              # API routes (proxy hacia el backend)
├── components/           # Componentes React (atoms → molecules → organisms)
├── services/             # Lógica de negocio y llamadas a la API
├── hooks/                # Custom hooks
├── schemas/              # Esquemas de validación con Zod
├── types/                # Definiciones de tipos TypeScript
└── lib/                  # Utilidades y helpers
```
