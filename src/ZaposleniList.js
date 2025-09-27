import React, { useEffect, useState } from 'react';

function ZaposleniList({ token }) {
  const [zaposleni, setZaposleni] = useState([]);

  useEffect(() => {
    // U API zahtevu dodaj token iz props-a
    fetch('http://localhost:5241/api/zaposleni', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => setZaposleni(data))
      .catch(err => console.error('Greška:', err));
  }, [token]);

  return (
    <div>
      <h2>Lista zaposlenih</h2>
      <ul>
        {zaposleni.map(z => (
          <li key={z.id}>{z.ime} {z.prezime}</li>
        ))}
      </ul>
    </div>
  );
}

export default ZaposleniList;
