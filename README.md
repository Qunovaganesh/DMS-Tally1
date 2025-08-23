# BizzPlus DMS (Prototype)

A lightweight UI-first prototype for distributor management system.

## Demo Credentials

- **Admin**: admin@demo.com / 123456
- **Manufacturer**: manu@demo.com / 123456  
- **Distributor**: dist@demo.com / 123456

## Development

```bash
npm run dev
```

This starts:
- API server on http://localhost:4000
- Web app on http://localhost:5173

## Architecture

- **Frontend**: React 18 + TypeScript + Vite + React Router + Tailwind + shadcn/ui
- **Backend**: Express + TypeScript (mock API, in-memory data)
- **State**: React Query + Zustand
- **Theme**: Strict Mac design system

## Notes

- API data resets on server restart (in-memory only)
- Frontend caches auth token in localStorage
- All integrations (Tally, emails, etc.) are stubbed with toasts