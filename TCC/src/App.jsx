import React, { useState } from 'react';
import HomeLanding from './components/HomeLanding';
import Dashboard from './components/Dashboard';
import Bracket from './components/Bracket';
import StandingsTable from './components/StandingsTable';
import AdminPanel from './components/AdminPanel';
import LoginModal from './components/LoginModal';

export default function App() {
  const [currentTab, setCurrentTab] = useState('home');
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setShowLoginModal(false);
    if (userData.role === 'ADMIN') {
      setCurrentTab('admin');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentTab('home');
  };

  return (
    <div style={{ backgroundColor: '#0d0d0d', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif' }}>
      {/* Barra de Navegação Superior */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px', borderBottom: '1px solid #222', backgroundColor: '#111', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <h1 onClick={() => setCurrentTab('home')} style={{ color: '#00ff88', margin: 0, fontSize: '1.4rem', letterSpacing: '1px', cursor: 'pointer' }}>
            KNOCKR
          </h1>

          <button onClick={() => setCurrentTab('home')} style={navBtnStyle(currentTab === 'home')}>
            🏠 INÍCIO
          </button>
          <button onClick={() => setCurrentTab('dashboard')} style={navBtnStyle(currentTab === 'dashboard')}>
            📱 AO VIVO & DADOS
          </button>
          <button onClick={() => setCurrentTab('bracket')} style={navBtnStyle(currentTab === 'bracket')}>
            ⚔️ MATA-MATA
          </button>
          <button onClick={() => setCurrentTab('standings')} style={navBtnStyle(currentTab === 'standings')}>
            📊 PONTOS CORRIDOS
          </button>

          {user?.role === 'ADMIN' && (
            <button onClick={() => setCurrentTab('admin')} style={navBtnStyle(currentTab === 'admin', true)}>
              ⚙️ ADMIN
            </button>
          )}
        </div>

        {/* Login / Usuário */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '0.85rem', color: '#aaa' }}>
                Olá, <strong style={{ color: user.role === 'ADMIN' ? '#00ff88' : '#fff' }}>{user.name}</strong>
              </span>
              <button onClick={handleLogout} style={{ padding: '6px 12px', backgroundColor: '#333', color: '#ff4444', border: '1px solid #ff444444', borderRadius: '5px', cursor: 'pointer', fontSize: '0.8rem' }}>
                Sair
              </button>
            </div>
          ) : (
            <button onClick={() => setShowLoginModal(true)} style={{ padding: '8px 16px', backgroundColor: '#00ff88', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>
              🔑 Entrar
            </button>
          )}
        </div>
      </nav>

      {showLoginModal && (
        <LoginModal
          onLoginSuccess={handleLoginSuccess}
          onClose={() => setShowLoginModal(false)}
        />
      )}

      {/* Conteúdo da Aba */}
      <main style={{ paddingBottom: '40px' }}>
        {currentTab === 'home' && <HomeLanding onNavigate={(tab) => setCurrentTab(tab)} />}
        {currentTab === 'dashboard' && <Dashboard />}
        {currentTab === 'bracket' && <Bracket />}
        {currentTab === 'standings' && <StandingsTable />}
        {currentTab === 'admin' && user?.role === 'ADMIN' && <AdminPanel />}
      </main>
    </div>
  );
}

const navBtnStyle = (isActive, isAdminTab = false) => ({
  background: isActive ? (isAdminTab ? '#00ff8844' : '#00ff8822') : 'none',
  border: isActive ? '1px solid #00ff88' : '1px solid #333',
  color: isActive ? '#00ff88' : isAdminTab ? '#00ff88' : '#aaa',
  fontWeight: 'bold',
  cursor: 'pointer',
  fontSize: '0.85rem',
  padding: '8px 14px',
  borderRadius: '6px',
  transition: 'all 0.2s ease',
});