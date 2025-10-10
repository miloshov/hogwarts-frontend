# Hogwarts HR - Frontend

## 📋 Pregled

Moderna React aplikacija za Hogwarts HR sistem izgrađena sa TypeScript, Material-UI dizajnom i responzivnim korisničkim interfejsom.

## 🚀 Funkcionalnosti

### 👥 Upravljanje Zaposlenima
- Lista zaposlenih sa pretraga
- Kreiranje i editovanje profila
- Organizaciona struktura

### 💰 Plate
- Pregled plata zaposlenih
- Mesečni obračuni
- Izveštavanje

### 🏖️ Zahtevi za Odmor
- Kreiranje zahteva za odmor
- Praćenje statusa
- Kalendar pregled

### 📦 **NOVO: Inventar Modul**
- 📊 **Dashboard sa statistikama**
- 📝 **Lista inventara** - pretraga, filtriranje, paginacija
- ➕ **Kreiranje stavki** - kompletna forma sa validacijom
- ✏️ **Editovanje** - izmena postojećih stavki
- 🔍 **Detalji** - prikaz svih informacija o stavci
- 📱 **QR kodovi** - generisanje i download
- 👤 **Dodela/Vraćanje** - upravljanje dodeljena oprema
- 📈 **Statistike** - grafici i vizuelni prikazi

## 🛠️ Tehnologije

- **React 18** - Frontend framework
- **TypeScript** - Type safety
- **Material-UI (MUI)** - UI komponente
- **React Router** - Navigacija
- **TanStack Query** - State management i API
- **DayJS** - Date manipulation
- **Recharts** - Grafici i statistike
- **Vite** - Build tool

## 📁 Struktura Projekta

```
src/
├── components/
│   ├── Layout/           # Layout komponente
│   ├── inventar/         # Inventar komponente
│   │   ├── InventarLista.tsx
│   │   ├── InventarForma.tsx
│   │   ├── InventarDetalji.tsx
│   │   └── InventarStatistike.tsx
│   └── Dashboard/        # Dashboard komponente
├── pages/
│   ├── InventarPage.tsx  # Glavni inventar page
│   ├── Dashboard.tsx
│   └── Login.tsx
├── services/
│   ├── inventarService.ts # API komunikacija
│   └── authService.ts
└── contexts/
    └── AuthContext.tsx   # Autentifikacija
```

## 🎨 Inventar Komponente

### InventarPage
Glavni kontejner sa tab navigacijom:
- Lista inventara
- Kreiranje nove stavke
- Statistike

### InventarLista
Tabela sa funkcionalnostima:
- ✅ Pretraga po nazivu, opisu, serijskom broju
- ✅ Paginacija
- ✅ Sort funkcionalnost
- ✅ Akcije (Edit, Delete, QR, Dodeli/Vrati)
- ✅ Status indikatori (stanje, dostupnost)

### InventarForma
Komprehenzivna forma:
- ✅ Osnovne informacije (naziv, kategorija, lokacija)
- ✅ Identifikatori (serijski broj, bar kod)
- ✅ Finansijske informacije (nabavna cena, vrednost)
- ✅ Datumi (nabavka, garancija) - DayJS integracija
- ✅ Validacija svih polja
- ✅ Auto-generisanje kodova

### InventarDetalji
Detaljni prikaz:
- ✅ Sve informacije o stavci
- ✅ QR kod generisanje
- ✅ Dodela/vraćanje funkcionalnost
- ✅ Audit trail (datum kreiranja, izmene)

### InventarStatistike
Vizuelni dashboard:
- ✅ Ukupan broj stavki
- ✅ Ukupna vrednost
- ✅ Distribucija po stanju (Pie chart)
- ✅ Stavke po kategorijama (Bar chart)
- ✅ Stavke po lokacijama (Bar chart)
- ✅ KPI kartice

## 🔗 API Integracija

### inventarService.ts
```typescript
// Glavni API calls
getAllStavke()           // Lista svih stavki
getStavkaById(id)        // Detalji stavke
createStavka(data)       // Kreiranje
updateStavka(id, data)   // Ažuriranje
deleteStavka(id)         // Brisanje
dodelilStavku(request)   // Dodela korisniku
vratiStavku(id, note)    // Vraćanje
generateQrCode(id)       // QR kod download
getStatistike()          // Dashboard statistike
```

## 📱 UI/UX Features

### Responzivnost
- ✅ Desktop optimizovan
- ✅ Tablet podržan
- ✅ Mobile ready

### Korisničko iskustvo
- ✅ Loading indikatori
- ✅ Error handling sa user-friendly porukama
- ✅ Confirmation dialozi
- ✅ Toast notifikacije
- ✅ Intuitivna navigacija

### Accessibility
- ✅ ARIA labeli
- ✅ Keyboard navigacija
- ✅ High contrast support
- ✅ Screen reader friendly

## ⚙️ Pokretanje

```bash
# Instaliraj dependencies
npm install

# Development server
npm run dev

# Build za produkciju
npm run build

# Preview build-a
npm run preview
```

## 📦 Dependencies

### Core
- react, react-dom
- typescript
- vite

### UI
- @mui/material
- @mui/icons-material
- @mui/x-date-pickers

### Utilities
- @tanstack/react-query
- react-router-dom
- dayjs
- recharts

## 🔐 Autentifikacija

Aplikacija koristi JWT tokene za autentifikaciju. AuthContext upravlja stanjem korisnika kroz cellu aplikaciju.

## 🎯 Trenutni Status

### ✅ Kompletno
- Osnovni layout i navigacija
- Autentifikacija sistem
- Dashboard sa osnovnim funkcionalnostima
- Inventar UI komponente kreiranje

### 🚧 U razvoju
- Inventar API integracija (401 Unauthorized greške)
- Error handling poboljšanje
- Loading states optimizacija
- Validacija formi

### 📋 Planirano
- Unit testovi
- E2E testiranje
- Performance optimizacije
- PWA funkcionalnosti
- Dark mode tema

## 🐛 Poznati problemi

1. **API 401 errors** - backend autentifikacija treba podešavanje
2. **Date picker locale** - DayJS srpski jezik podešavanje
3. **Responsive charts** - optimizacija za manje ekrane

## 🚀 Sledeći koraci

1. Rešavanje API autentifikacije
2. Testiranje svih CRUD operacija
3. UI polish i optimizacije
4. Performance monitoring
5. Accessibility testiranje

---

**Autor:** MiniMax Agent  
**Datum poslednje izmene:** 11. Oktobar 2025