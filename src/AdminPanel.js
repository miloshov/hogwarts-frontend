import React, { useState, useEffect } from 'react';
import Login from './Login';

function AdminPanel() {
  // SVI HOOK-OVI NA VRHU KOMPONENTE
  // Hookovi za autentifikaciju
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // State za zaposlene i zahteve
  const [zaposleni, setZaposleni] = useState([]);
  const [zahtevi, setZahtevi] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // State za unos i uređivanje
  const [noviZaposleni, setNoviZaposleni] = useState({
    Ime: '',
    Prezime: '',
    UserName: '',
    Email: '',
    Pozicija: ''
  });
  const [editZaposleni, setEditZaposleni] = useState(null);

  const [novaPlata, setNovaPlata] = useState({
    ZaposleniId: '',
    Osnovna: '',
    Bonusi: '',
    Otkazi: '',
    Period: '',
    Neto: ''
  });

  const [novaZahtev, setNovaZahtev] = useState({
    ZaposleniId: '',
    DatumOd: '',
    DatumDo: '',
    Razlog: ''
  });

  // Helper za headers
  const authHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  });

  // useEffect odmah nakon hook-ova
  useEffect(() => {
    if (token) {
      fetchZaposleni();
      fetchZahtevi();
    }
  }, [token]);

  // Funkcije za autentifikaciju
  const handleLogin = (token) => {
    setToken(token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setToken(null);
    setIsAuthenticated(false);
  };

  // Funkcija za učitavanje zaposlenih
  const fetchZaposleni = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:5241/api/zaposleni', { headers: authHeaders() });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(`Fetch zaposlenih failed: ${res.status} ${t}`);
      }
      const data = await res.json();
      setZaposleni(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Funkcija za učitavanje zahteva
  const fetchZahtevi = async () => {
    try {
      const res = await fetch('http://localhost:5241/api/zahtevzaodmor', { headers: authHeaders() });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(`Fetch zahtevi failed: ${res.status} ${t}`);
      }
      const data = await res.json();
      setZahtevi(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  // Funkcija za dodavanje zaposlenog
  const dodajZaposlenog = async () => {
    try {
      const res = await fetch('http://localhost:5241/api/zaposleni', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(noviZaposleni),
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(`Dodavanje neuspešno: ${res.status} ${t}`);
      }
      await res.json();
      setNoviZaposleni({ Ime: '', Prezime: '', UserName: '', Email: '', Pozicija: '' });
      fetchZaposleni();
    } catch (err) {
      console.error(err);
      alert(err.message || 'Greška pri dodavanju');
    }
  };

  // Funkcija za brisanje zaposlenog
  const obrisiZaposlenog = async (id) => {
    if (!window.confirm('Da li ste sigurni da želite obrisati?')) return;
    try {
      const res = await fetch(`http://localhost:5241/api/zaposleni/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(`Neuspelo brisanje: ${res.status} ${t}`);
      }
      fetchZaposleni();
    } catch (err) {
      console.error(err);
      alert(err.message || 'Greška pri brisanju');
    }
  };

  // Funkcija za početak uređivanja
  const zapocniEdit = (z) => setEditZaposleni({ ...z });

  // Funkcija za sačuvanje uređivanja
  const sacuvajEdit = async () => {
    if (!editZaposleni) return;
    const id = editZaposleni.Id ?? editZaposleni.ZaposleniId;
    try {
      const res = await fetch(`http://localhost:5241/api/zaposleni/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(editZaposleni),
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(`Ažuriranje nije uspelo: ${res.status} ${t}`);
      }
      await res.json();
      setEditZaposleni(null);
      fetchZaposleni();
    } catch (err) {
      console.error(err);
      alert(err.message || 'Greška pri ažuriranju');
    }
  };

  // DODANE NEDOSTAJUĆE FUNKCIJE
  // Funkcija za dodavanje plate
  const dodajPlatu = async () => {
    try {
      const res = await fetch('http://localhost:5241/api/plata', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(novaPlata),
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(`Dodavanje plate neuspešno: ${res.status} ${t}`);
      }
      await res.json();
      setNovaPlata({
        ZaposleniId: '',
        Osnovna: '',
        Bonusi: '',
        Otkazi: '',
        Period: '',
        Neto: ''
      });
      alert('Plata je uspešno dodana!');
    } catch (err) {
      console.error(err);
      alert(err.message || 'Greška pri dodavanju plate');
    }
  };

  // Funkcija za dodavanje zahteva za odmor
  const dodajZahtev = async () => {
    try {
      const res = await fetch('http://localhost:5241/api/zahtevzaodmor', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(novaZahtev),
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(`Dodavanje zahteva neuspešno: ${res.status} ${t}`);
      }
      await res.json();
      setNovaZahtev({
        ZaposleniId: '',
        DatumOd: '',
        DatumDo: '',
        Razlog: ''
      });
      fetchZahtevi(); // Osvežava listu zahteva
      alert('Zahtev je uspešno poslat!');
    } catch (err) {
      console.error(err);
      alert(err.message || 'Greška pri slanju zahteva');
    }
  };

  // USLOVNI RETURN NA KRAJU, PRE GLAVNOG JSX-a
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  // Glavni JSX
  return (
    <div style={{ padding: 16 }}>
      <button onClick={handleLogout}>Odjavi se</button>

      {error && (
        <div style={{ color: 'red', marginTop: 8 }}>
          Greška: {error}
        </div>
      )}

      {/* Sekcija za zaposlene */}
      <section style={{ marginTop: 16 }}>
        <h3>Zaposleni</h3>
        
        {/* Forma za unos novog zaposlenog */}
        <div style={{ marginBottom: 16 }}>
          <input
            placeholder="Ime"
            value={noviZaposleni.Ime}
            onChange={(e) => setNoviZaposleni({ ...noviZaposleni, Ime: e.target.value })}
            style={{ margin: '0 4px' }}
          />
          <input
            placeholder="Prezime"
            value={noviZaposleni.Prezime}
            onChange={(e) => setNoviZaposleni({ ...noviZaposleni, Prezime: e.target.value })}
            style={{ margin: '0 4px' }}
          />
          <input
            placeholder="Korisničko ime"
            value={noviZaposleni.UserName}
            onChange={(e) => setNoviZaposleni({ ...noviZaposleni, UserName: e.target.value })}
            style={{ margin: '0 4px' }}
          />
          <input
            placeholder="Email"
            value={noviZaposleni.Email}
            onChange={(e) => setNoviZaposleni({ ...noviZaposleni, Email: e.target.value })}
            style={{ margin: '0 4px' }}
          />
          <input
            placeholder="Pozicija"
            value={noviZaposleni.Pozicija}
            onChange={(e) => setNoviZaposleni({ ...noviZaposleni, Pozicija: e.target.value })}
            style={{ margin: '0 4px' }}
          />
          <button onClick={dodajZaposlenog} style={{ margin: '0 4px' }}>Dodaj</button>
        </div>

        {/* Lista zaposlenih */}
        {loading ? (
          <div>Učitavanje...</div>
        ) : (
          <ul>
            {zaposleni.map((z) => (
              <li key={z.Id ?? z.ZaposleniId} style={{ marginTop: 8 }}>
                {editZaposleni && (editZaposleni.Id ?? editZaposleni.ZaposleniId) === (z.Id ?? z.ZaposleniId) ? (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input
                      value={editZaposleni.Ime}
                      onChange={(e) => setEditZaposleni({ ...editZaposleni, Ime: e.target.value })}
                    />
                    <input
                      value={editZaposleni.Prezime}
                      onChange={(e) => setEditZaposleni({ ...editZaposleni, Prezime: e.target.value })}
                    />
                    <input
                      value={editZaposleni.UserName}
                      onChange={(e) => setEditZaposleni({ ...editZaposleni, UserName: e.target.value })}
                    />
                    <input
                      value={editZaposleni.Email}
                      onChange={(e) => setEditZaposleni({ ...editZaposleni, Email: e.target.value })}
                    />
                    <input
                      value={editZaposleni.Pozicija}
                      onChange={(e) => setEditZaposleni({ ...editZaposleni, Pozicija: e.target.value })}
                    />
                    <button onClick={sacuvajEdit}>Sačuvaj</button>
                    <button onClick={() => setEditZaposleni(null)}>Odustani</button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span>
                      {z.Ime} {z.Prezime} ({z.Email}) - {z.Pozicija}
                    </span>
                    <button onClick={() => zapocniEdit(z)}>Edit</button>
                    <button onClick={() => obrisiZaposlenog(z.Id ?? z.ZaposleniId)}>Delete</button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Sekcija za Plata */}
      <section style={{ marginTop: 24 }}>
        <h3>Plata</h3>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <input
            placeholder="ID zaposlenog"
            type="number"
            value={novaPlata.ZaposleniId}
            onChange={(e) => setNovaPlata({ ...novaPlata, ZaposleniId: e.target.value })}
          />
          <input
            placeholder="Osnovna"
            type="number"
            value={novaPlata.Osnovna}
            onChange={(e) => setNovaPlata({ ...novaPlata, Osnovna: e.target.value })}
          />
          <input
            placeholder="Bonusi"
            type="number"
            value={novaPlata.Bonusi}
            onChange={(e) => setNovaPlata({ ...novaPlata, Bonusi: e.target.value })}
          />
          <input
            placeholder="Otkazi"
            type="number"
            value={novaPlata.Otkazi}
            onChange={(e) => setNovaPlata({ ...novaPlata, Otkazi: e.target.value })}
          />
          <input
            placeholder="Period"
            value={novaPlata.Period}
            onChange={(e) => setNovaPlata({ ...novaPlata, Period: e.target.value })}
          />
          <input
            placeholder="Neto"
            type="number"
            value={novaPlata.Neto}
            onChange={(e) => setNovaPlata({ ...novaPlata, Neto: e.target.value })}
          />
          <button onClick={dodajPlatu}>Dodaj Platu</button>
        </div>
      </section>

      {/* Sekcija za zahtev za odmor */}
      <section style={{ marginTop: 24 }}>
        <h3>Zahtev za odmor</h3>
        <div style={{ display: 'flex', gap: 8, flexDirection: 'column', maxWidth: 400 }}>
          <input
            placeholder="ID zaposlenog"
            type="number"
            value={novaZahtev.ZaposleniId}
            onChange={(e) => setNovaZahtev({ ...novaZahtev, ZaposleniId: e.target.value })}
          />
          <input
            type="date"
            placeholder="Datum od"
            value={novaZahtev.DatumOd}
            onChange={(e) => setNovaZahtev({ ...novaZahtev, DatumOd: e.target.value })}
          />
          <input
            type="date"
            placeholder="Datum do"
            value={novaZahtev.DatumDo}
            onChange={(e) => setNovaZahtev({ ...novaZahtev, DatumDo: e.target.value })}
          />
          <input
            placeholder="Razlog"
            value={novaZahtev.Razlog}
            onChange={(e) => setNovaZahtev({ ...novaZahtev, Razlog: e.target.value })}
          />
          <button onClick={dodajZahtev}>Pošalji zahtev</button>
        </div>
      </section>

      {/* Sekcija za prikaz zahteva */}
      <section style={{ marginTop: 24 }}>
        <h3>Lista zahteva za odmor</h3>
        {zahtevi.length === 0 ? (
          <p>Nema zahteva za odmor.</p>
        ) : (
          <ul>
            {zahtevi.map((zahtev, index) => (
              <li key={index} style={{ marginBottom: 8 }}>
                <strong>Zaposleni ID:</strong> {zahtev.ZaposleniId} | 
                <strong> Od:</strong> {zahtev.DatumOd} | 
                <strong> Do:</strong> {zahtev.DatumDo} | 
                <strong> Razlog:</strong> {zahtev.Razlog}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default AdminPanel;