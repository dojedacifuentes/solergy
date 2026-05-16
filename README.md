# Solergy — Demo Estratégica de Independencia Energética

Demo funcional para Solergy, empresa chilena de energía solar. Construida con Next.js 15, TypeScript, TailwindCSS, Framer Motion y Recharts.

## Stack

- **Next.js 16 (App Router)** — framework principal
- **TypeScript** — tipado completo
- **TailwindCSS** — estilos utility-first con dark mode por defecto
- **Framer Motion** — animaciones y transiciones
- **Recharts** — gráficos de analytics y simulación
- **React Hook Form + Zod** (disponible) — validación
- **Mock data local** — sin backend, sin Supabase

## Estructura

```
app/
├── page.tsx                    → Landing pública (/)
├── layout.tsx                  → Root layout
├── (public)/
│   ├── layout.tsx              → Layout público (navbar + footer)
│   └── simulador/page.tsx      → Simulador inteligente (/simulador)
├── (dashboard)/
│   ├── layout.tsx              → Layout dashboard (sidebar)
│   └── dashboard/
│       ├── page.tsx            → Resumen + KPIs (/dashboard)
│       ├── leads/page.tsx      → Tabla de leads (/dashboard/leads)
│       ├── casos/page.tsx      → Casos de éxito (/dashboard/casos)
│       ├── zonas/page.tsx      → Mapa estratégico (/dashboard/zonas)
│       └── analytics/page.tsx  → Analytics (/dashboard/analytics)
└── (auth)/
    └── login/page.tsx          → Login mock (/login)

components/
├── layout/         → Navbar, Footer
├── ui/             → Button, Card, Badge, Input, Select, Progress, Logo
├── dashboard/      → Sidebar, Header, StatsCard
├── simulator/      → SimulatorForm, SimulatorResults
└── sections/       → Hero, Benefits, HowItWorks, CasesPreview,
                       TrustModule, Zones, ContactCTA

lib/
├── utils.ts        → formatCLP, formatKWh, calcSavings, cn, etc.
├── simulator.ts    → Lógica del simulador de escenarios
└── mock-data.ts    → Todos los datos mock editables

types/
└── index.ts        → Tipos TypeScript completos
```

## Rutas disponibles

| Ruta | Descripción |
|------|-------------|
| `/` | Landing page completa |
| `/simulador` | Simulador de ahorro energético |
| `/login` | Acceso al panel comercial |
| `/dashboard` | Resumen + KPIs |
| `/dashboard/leads` | Lista de leads con filtros |
| `/dashboard/casos` | Casos de éxito |
| `/dashboard/zonas` | Mapa estratégico por región |
| `/dashboard/analytics` | Gráficos y proyecciones |

## Credenciales de demo

```
Email:      admin@solergy.cl
Contraseña: demo123
```

## Ejecutar localmente

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build de producción
npm run build
npm start
```

Abre [http://localhost:3000](http://localhost:3000)

## Deploy en Vercel

### Opción 1 — Desde GitHub (recomendado)

1. Sube el proyecto a un repositorio GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: Solergy demo inicial"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/solergy.git
   git push -u origin main
   ```

2. Ve a [vercel.com](https://vercel.com) → "New Project"
3. Importa el repositorio GitHub
4. Sin configuración adicional — Vercel detecta Next.js automáticamente
5. Click "Deploy"

### Opción 2 — CLI de Vercel

```bash
npm i -g vercel
vercel
```

### Variables de entorno

No requiere variables de entorno. Todo funciona con mock data local.

## Personalización rápida

### Cambiar datos de contacto
Editar `lib/mock-data.ts`:
```ts
export const WHATSAPP_NUMBER = "+56995019476";
export const CONTACT_EMAIL = "Solergy.soluciones@gmail.com";
```

### Cambiar leads / casos mock
Editar `mockLeads` y `mockCases` en `lib/mock-data.ts`

### Cambiar lógica del simulador
Editar `lib/simulator.ts` → función `runSimulator()`

### Cambiar paleta de colores
Editar `tailwind.config.ts` → `colors.solar` y el CSS en `globals.css`

## Contacto Solergy

- WhatsApp: +56 9 9501 9476
- Email: Solergy.soluciones@gmail.com
- Cobertura: V Región · VI Región · Región Metropolitana
