import React, { useState } from 'react';

export default function LoginModal({ onLoginSuccess, onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    // Credenciais de teste de Administrador
    if (email === 'admin@knockr.com' && password === 'knockr123') {
      onLoginSuccess({ name: 'Administrador', role: 'ADMIN', email });
    } else if (email === 'user@knockr.com' && password === '123456') {
      onLoginSuccess({ name: 'Torcedor', role: 'USER', email });
    } else {
      setError('E-mail ou senha incorretos! (Dica: admin@knockr.com / admin123)');
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
      <div style={{ backgroundColor: '#141414', padding: '30px', borderRadius: '10px', border: '1px solid #00ff88', width: '90%', maxWidth: '400px', boxShadow: '0 0 20px rgba(0, 255, 136, 0.2)' }}>
        <h3 style={{ color: '#00ff88', textAlign: 'center', marginTop: 0, marginBottom: '20px' }}>🔐 Entrar no KNOCKR</h3>

        {error && (
          <div style={{ backgroundColor: '#ff333322', border: '1px solid #ff3333', color: '#ff4444', padding: '10px', borderRadius: '5px', fontSize: '0.85rem', marginBottom: '15px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', color: '#aaa', fontSize: '0.85rem', marginBottom: '5px' }}>E-mail:</label>
            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '10px', backgroundColor: '#222', color: '#fff', border: '1px solid #333', borderRadius: '5px', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: '#aaa', fontSize: '0.85rem', marginBottom: '5px' }}>Senha:</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '10px', backgroundColor: '#222', color: '#fff', border: '1px solid #333', borderRadius: '5px', boxSizing: 'border-box' }}
            />
          </div>

          <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#00ff88', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '5px', cursor: 'pointer', marginBottom: '10px' }}>
            Entrar
          </button>
        </form>

        <button onClick={onClose} style={{ width: '100%', padding: '8px', backgroundColor: 'transparent', color: '#aaa', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}>
          Cancelar / Continuar como Visitante
        </button>

        <div style={{ marginTop: '20px', borderTop: '1px solid #222', paddingTop: '10px', fontSize: '0.75rem', color: '#666', textAlign: 'center' }}>
          <strong>Acesso para Apresentação:</strong><br />
          Admin: <code>admin@knockr.com</code> / <code>admin123</code>
        </div>
      </div>
    </div>
  );
}