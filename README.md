# Hogwarts Management System - Frontend

## 📋 Pregled

Moderna React aplikacija za upravljanje sistemom zaposlenih u Hogwarts školi. Aplikacija pruža intuitivni korisnički interfejs za administraciju zaposlenih, korisničkih podešavanja i autentifikaciju.

## 🚀 Tehnologije

- **React 18** - JavaScript library za kreiranje korisničkih interfejsa
- **TypeScript** - Tipiziran JavaScript za bolju developer experience
- **Material-UI (MUI)** - React komponente za brz razvoj UI-ja
- **React Query (TanStack Query)** - Powerful data synchronization za React
- **React Router** - Declarative routing za React aplikacije
- **Axios** - HTTP client za API pozive
- **Vite** - Next generation frontend tooling

## 🏗️ Struktura projekta

```
frontend/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── Layout.tsx              # Glavna layout komponenta
│   │   ├── Navigation.tsx          # Navigacioni meni
│   │   └── ProtectedRoute.tsx      # Route guard za autentifikaciju
│   ├── pages/
│   │   ├── Login.tsx              # Stranica za prijavu
│   │   ├── Zaposleni.tsx          # Upravljanje zaposlenima
│   │   └── Podesavanja.tsx        # Korisnička podešavanja
│   ├── services/
│   │   ├── authService.ts         # API pozivi za autentifikaciju
│   │   ├── zaposleniService.ts    # API pozivi za zaposlene
│   │   └── podesavanjaService.ts  # API pozivi za podešavanja
│   ├── types/
│   │   ├── auth.ts                # TypeScript tipovi za auth
│   │   ├── zaposleni.ts           # TypeScript tipovi za zaposlene
│   │   └── podesavanja.ts         # TypeScript tipovi za podešavanja
│   ├── utils/
│   │   ├── api.ts                 # Axios konfiguracija
│   │   └── constants.ts           # Aplikacione konstante
│   ├── App.tsx                    # Glavna App komponenta
│   ├── main.tsx                   # Entry point
│   └── index.css                  # Globalni stilovi
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## ✨ Funkcionalnosti

### 🔐 Autentifikacija
- Sigurna prijava sa JWT tokenima
- Automatska provera autentifikacije
- Redirect na login ako korisnik nije autentifikovan
- Logout funkcionalnost

### 👥 Upravljanje zaposlenima
- 📋 Pregled liste zaposlenih sa paginacijom
- ➕ Dodavanje novog zaposlenog
- ✏️ Uređivanje postojećeg zaposlenog
- 🗑️ Brisanje zaposlenog
- 🔍 Pretraga i filtriranje
- 📊 Tabela sa sortiranjem

### ⚙️ Korisnička podešavanja
- 🎨 Promena teme (svetla/tamna)
- 🌐 Izbor jezika aplikacije
- 📧 Kontrola email notifikacija
- 🔔 Kontrola push notifikacija
- 💾 Automatsko čuvanje postavki
- 📄 Podešavanje broja redova po stranici

## 🎨 UI/UX Karakteristike

- **Responsive design** - Prilagođava se svim uređajima
- **Material Design** - Moderna i intuitivna User Experience
- **Dark/Light tema** - Korisnik može da bira temu
- **Loading states** - Indikatori učitavanja za bolje UX
- **Error handling** - Graciozno rukovanje greškama
- **Toast notifikacije** - Feedback za korisničke akcije

## ⚙️ Instalacija i pokretanje

### Preduslovi
- Node.js 18.x ili noviji
- npm ili yarn package manager
- Backend API pokrenuta na `http://localhost:5241`

### Korak po korak:

1. **Kloniranje repozitorijuma**
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Instaliranje paketa**
   ```bash
   npm install
   # ili
   yarn install
   ```

3. **Konfiguracija environment varijabli**
   
   Kreiraj `.env` fajl u root direktorijumu:
   ```env
   VITE_API_BASE_URL=http://localhost:5241/api
   VITE_APP_TITLE=Hogwarts Management System
   ```

4. **Pokretanje development servera**
   ```bash
   npm run dev
   # ili
   yarn dev
   ```

5. **Otvaranje u browseru**
   
   Aplikacija će biti dostupna na `http://localhost:3000`

## 🛠️ Dostupni skriptovi

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Linting
npm run lint

# Linting sa automatskim popravkama
npm run lint:fix

# Unit testovi
npm run test

# Unit testovi sa watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

## 📦 Zavisnosti

### Glavni paketi:
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "@mui/material": "^5.14.0",
  "@mui/icons-material": "^5.14.0",
  "@tanstack/react-query": "^5.0.0",
  "react-router-dom": "^6.15.0",
  "axios": "^1.5.0",
  "typescript": "^5.2.0"
}
```

### Dev zavisnosti:
```json
{
  "@vitejs/plugin-react": "^4.0.3",
  "vite": "^4.4.5",
  "@types/react": "^18.2.15",
  "@types/react-dom": "^18.2.7",
  "eslint": "^8.45.0",
  "@typescript-eslint/eslint-plugin": "^6.0.0"
}
```

## 🔧 Konfiguracija

### Vite konfiguracija (vite.config.ts)
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true
      }
    }
  }
})
```

### TypeScript konfiguracija (tsconfig.json)
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

## 🔌 API Integration

Aplikacija komunicira sa backend API-jem preko Axios-a. Svi API pozivi su centralizovani u service fajlovima:

```typescript
// services/api.ts
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Automatsko dodavanje JWT tokena
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

## 🎯 State Management

Aplikacija koristi **React Query** za server state management:

```typescript
// Učitavanje podataka
const { data: zaposleni, isLoading } = useQuery({
  queryKey: ['zaposleni'],
  queryFn: zaposleniService.getAll
})

// Mutacije (kreiranje, ažuriranje, brisanje)
const createMutation = useMutation({
  mutationFn: zaposleniService.create,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['zaposleni'] })
  }
})
```

## 🧪 Testiranje

### Unit testovi sa Vitest
```bash
# Pokretanje testova
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

### Test primer:
```typescript
import { render, screen } from '@testing-library/react'
import { Login } from './Login'

test('renders login form', () => {
  render(<Login />)
  expect(screen.getByLabelText(/username/i)).toBeInTheDocument()
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
})
```

## 🚀 Production Build

```bash
# Kreiranje production build-a
npm run build

# Preview build-a lokalno
npm run preview
```

Build fajlovi će biti kreirani u `dist/` direktorijumu.

## 🐳 Docker (opciono)

```dockerfile
# Dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 📝 Najnovije izmene

### v1.1.0 (Datum: 2025-10-12)
- ✅ **Popravljen bug u Zaposleni.tsx** - forma za dodavanje zaposlenog se sada pravilno prikazuje
- ✅ **Implementiran modul Podesavanja** - kompletna funkcionalnost za korisnička podešavanja
- ✅ **Dodana navigacija za Settings** - nova stavka u glavnom meniju
- ✅ **React Query optimizacija** - poboljšano upravljanje server state-om
- ✅ **TypeScript tipovi** - dodani tipovi za nova podešavanja

### v1.0.0
- ✅ Osnovna React aplikacija sa TypeScript
- ✅ Material-UI dizajn sistem
- ✅ JWT autentifikacija
- ✅ CRUD operacije za zaposlene
- ✅ Responsive design

## 🤝 Doprinošenje

1. Fork repozitorijum
2. Kreiraj feature branch (`git checkout -b feature/nova-funkcionalnost`)
3. Commit izmene (`git commit -am 'Dodaj novu funkcionalnost'`)
4. Push na branch (`git push origin feature/nova-funkcionalnost`)
5. Kreiraj Pull Request

### Coding standardi:
- Koristi TypeScript za sve komponente
- Prati Material-UI design patterns
- Piši unit testove za nove funkcionalnosti
- Koristi React Query za server state
- Prati ESLint i Prettier pravila

## 🔧 Troubleshooting

### Česti problemi:

**API pozivi ne rade:**
- Proveri da li je backend pokrenut na `http://localhost:5001`
- Proveri `.env` fajl sa ispravnom API URL-om

**JWT token greške:**
- Obriši localStorage i prijavi se ponovo
- Proveri da li je token valjan u browser dev tools

**Build greške:**
- Obriši `node_modules` i `package-lock.json`, zatim `npm install`
- Proveri TypeScript greške sa `npm run type-check`

## 📄 Licenca

Ovaj projekat je licenciran pod MIT licencom.
