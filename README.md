# Hogwarts HR Management System - Frontend

Moderna React aplikacija za upravljanje ljudskim resursima, izgrađena sa TypeScript-om i Material-UI komponentama.

## 🛠️ Tech Stack

- **React 18** sa **TypeScript**
- **Vite** (za brže buildovanje)
- **Material-UI (MUI)** za komponente i dizajn
- **React Router** za navigaciju
- **Axios** za API komunikaciju
- **React Hook Form** za formulare
- **TanStack Query** za state management API poziva
- **Day.js** za rad sa datumima

## 📋 Preduslovи

- **Node.js** (verzija 18 ili novija)
- **npm** ili **yarn**
- **Backend API** pokrenut na `http://localhost:5241`

## 🚀 Instaliranje

1. **Navigirajte u frontend direktorijum:**
   ```bash
   cd frontend
   ```

2. **Instalirajte dependencies:**
   ```bash
   npm install
   ```

3. **Pokrenite development server:**
   ```bash
   npm run dev
   ```

4. **Otvorite aplikaciju u browser-u:**
   ```
   http://localhost:3000
   ```

## 📁 Struktura projekta

```
frontend/
├── src/
│   ├── components/           # Reusable komponente
│   │   ├── Layout/          # Layout komponente
│   │   └── LoadingSpinner.tsx
│   ├── contexts/            # React Context providers
│   │   └── AuthContext.tsx  # Authentication context
│   ├── pages/               # Stranice aplikacije
│   │   ├── Dashboard.tsx    # Glavna stranica
│   │   ├── Login.tsx        # Stranica za prijavu
│   │   ├── Zaposleni.tsx    # Upravljanje zaposlenim
│   │   ├── Plate.tsx        # Upravljanje platama
│   │   └── ZahteviZaOdmor.tsx # Zahtevi za odmor
│   ├── services/            # API servisi
│   │   ├── authService.ts   # Autentifikacija
│   │   ├── zaposleniService.ts
│   │   ├── plataService.ts
│   │   └── zahtevZaOdmorService.ts
│   ├── types/               # TypeScript tipovi
│   │   └── index.ts
│   ├── App.tsx              # Glavna komponenta
│   ├── main.tsx             # Entry point
│   └── index.css            # Globalni stilovi
├── package.json
├── vite.config.ts
└── README.md
```

## 🔧 Komande

- **Development server:**
  ```bash
  npm run dev
  ```

- **Build za produkciju:**
  ```bash
  npm run build
  ```

- **Preview build-a:**
  ```bash
  npm run preview
  ```

- **Linting:**
  ```bash
  npm run lint
  ```

## ⚙️ Konfiguracija

### API Endpoint

API endpoint je konfigurisan u `vite.config.ts` fajlu:

```typescript
server: {
  port: 3000,
  proxy: {
    '/api': {
      target: 'http://localhost:5241',
      changeOrigin: true,
      secure: false,
    },
  },
}
```

### Environment Variables

Kreiranje `.env` fajla u root direktorijumu za custom konfiguraciju:

```env
VITE_API_BASE_URL=http://localhost:5241/api
VITE_APP_TITLE=Hogwarts HR System
```

## 🎯 Funkcionalnosti

### 🔐 Autentifikacija
- Login sa email i lozinkom
- Automatska redirectiя na login stranu pri 401 greškama
- Token-based authentication

### 📊 Dashboard
- Pregled statistika (zaposleni, odseci, plate, zahtevi)
- Kartice sa key metrics
- Liste najnovijih aktivnosti

### 👥 Upravljanje zaposlenim
- CRUD operacije (Create, Read, Update, Delete)
- Pretraga i filtriranje
- Validacija formi
- Pregled detaljnih informacija

### 💰 Upravljanje platama
- Kreiranje i editovanje plata
- Statistike (ukupne, prosečne, najviše, najniže plate)
- Automatska kalkulacija neto iznosa
- Linkovanje sa zaposlenim

### 🏖️ Zahtevi za odmor
- Kreiranje novih zahteva
- Odobravanje/odbijanje zahteva
- Kalkulacija broja dana
- Status tracking (Na čekanju, Odobren, Odbijen)
- Napomene za administratore

## 🔌 API Integration

Aplikacija koristi Axios za API komunikaciju sa backend-om. Svi API pozivi su organizовани u servise:

- `authService.ts` - Login, logout, token management
- `zaposleniService.ts` - CRUD za zaposlene i odseke
- `plataService.ts` - CRUD za plate
- `zahtevZaOdmorService.ts` - CRUD i odobravanje zahteva

## 🎨 UI/UX

- **Responsive design** - optimizovan za desktop i mobilne uređaje
- **Material Design** komponente via MUI
- **Dark/Light mode** support
- **Loading states** i **error handling**
- **Form validation** sa clear error messages
- **Confirmation dialogs** za kritične akcije

## 🐛 Troubleshooting

### Česti problemi:

1. **"Network Error" ili connection refused:**
   - Proverite da li je backend pokrenut na `http://localhost:5241`
   - Proverite CORS konfiguraciju na backend-u

2. **"401 Unauthorized" greške:**
   - Obriкajte localStorage (`localStorage.clear()`)
   - Prijavite se ponovo

3. **Dependencies konflikti:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

## 🔄 Development Workflow

1. **Pokrenite backend** (`dotnet run` u backend direktorijumu)
2. **Pokrenite frontend** (`npm run dev` u frontend direktorijumu)
3. **Aplikacija je dostupna** na `http://localhost:3000`
4. **Hot reload** je omogućen - promene se automatski učitavaju

## 📝 Licenca

Ovaj projekat je kreiran za edukacione svrhe.
