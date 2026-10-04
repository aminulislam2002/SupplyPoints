# Agent Instructions

## Project Overview

- This is a React 19 SPA built with Vite 7 and JavaScript/JSX. The active app entry is `src/main.jsx`; `src/App.jsx` is still the Vite starter component and is not the application shell.
- Routes are defined in `src/routers/Router/Router.jsx`. Public pages use `RootLayout`; authenticated dashboard pages use `DashLayout`; authentication pages use `AuthLayout`.
- Cross-cutting state is provided in `src/main.jsx` through TanStack Query, auth, sidebar, theme, variants, cart, address, and subscription-payment providers. Preserve provider ordering when changing global state.

## Commands

- `npm run dev` starts the Vite development server.
- `npm run lint` runs ESLint across the project.
- `npm run build` creates the production build and is the primary compile check.
- `npm run preview` serves the built output locally.
- There is no test script or test suite currently defined in `package.json`.

## Conventions

- Keep feature pages under `src/pages/<area>/` and reusable UI under `src/components/<ComponentName>/`. Follow nearby file and naming patterns before introducing a new abstraction.
- Use React Router imports from `react-router` to match the existing router setup. Keep authentication and authorization behavior in `PrivateRoute` and `AdminRoute` rather than duplicating redirects in pages.
- Use `useAxiosPublic` for unauthenticated API calls and `useAxiosSecure` for authenticated calls. Both clients target `${import.meta.env.VITE_BASE_URL}/api`; the secure client manages the bearer token and refresh flow.
- Use TanStack Query for server-backed data and existing context providers for shared client state. Preserve existing query keys and invalidate or update caches when mutating local or remote data.
- Runtime configuration is supplied through Vite environment variables, notably `VITE_BASE_URL` and `VITE_CART_NAME`. Do not hard-code environment-specific API URLs or storage keys.
- Styling is Tailwind CSS 4 with DaisyUI. Shared theme tokens, Montserrat, Noto Sans Bengali, and global CSS behavior live in `src/index.css`; reuse those tokens and existing utility patterns.
- Use the existing libraries for established concerns: `react-icons` for icons, `react-hook-form` for forms, `sweetalert2` or `react-hot-toast` for feedback, and `framer-motion`/`keen-slider` where nearby code already uses them.

## Change Workflow

- Start from the nearest route, page, hook, provider, or component that owns the behavior. Check a neighboring implementation before adding new patterns.
- Keep API response handling and auth/token behavior consistent with the existing hooks. Treat user-facing payment, cart, order, and dashboard flows as high-risk and verify loading, error, and empty states.
- After changes, run `npm run lint` and `npm run build`. Since automated tests are not configured, manually exercise the affected route or interaction in the Vite app when practical.

## Documentation

- The root [README.md](README.md) is the available project documentation; keep it updated if setup or workflow requirements change.
