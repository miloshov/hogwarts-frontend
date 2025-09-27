import React, { useState } from 'react';

function Login({ onLogin }) {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5241/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ UserName: userName, Password: password }),
      });

      if (!response.ok) {
        throw new Error('Prijava neuspešna');
      }

      const data = await response.json();
      onLogin(data.token); // pozivanje callback funkcije sa tokenom
    } catch (err) {
      setError('Neispravno korisničko ime ili lozinka');
    }
  };

  return (
    <div>
      <h2>Prijava</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Korisničko ime:</label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Lozinka:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Prijavi se</button>
      </form>
    </div>
  );
}

export default Login;
