import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import Bracket from './components/Bracket';
import StandingsTable from './components/StandingsTable';
import AdminPanel from './components/AdminPanel';

export default function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');

  return (
    <div style={{ backgroundColor: '#0d0d0d', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif' }}>
      {/* Barra de Navegação Superior */}
      <nav style={{ display: 'flex', justifyContent: 'center', gap: '15px', padding: '18px 10px', borderBottom: '1px solid #222', backgroundColor: '#111', flexWrap: 'wrap' }}>
        <h1 style={{ color: '#00ff88', margin: 0, fontSize: '1.3rem', alignSelf: 'center', marginRight: '20px', letterSpacing: '1px' }}>KNOCKR</h1>
        
        <button onClick={() => setCurrentTab('dashboard')} style={navBtnStyle(currentTab === 'dashboard')}>
          📱 AO VIVO & DADOS
        </button>
        <button onClick={() => setCurrentTab('bracket')} style={navBtnStyle(currentTab === 'bracket')}>
          ⚔️ MATA-MATA (CHAVEAMENTO)
        </button>
        <button onClick={() => setCurrentTab('standings')} style={navBtnStyle(currentTab === 'standings')}>
          📊 PONTOS CORRIDOS (TABELA)
        </button>
        <button onClick={() => setCurrentTab('admin')} style={navBtnStyle(currentTab === 'admin')}>
          ⚙️ ADMIN
        </button>
      </nav>

      {/* Conteúdo Dinâmico */}
      <main style={{ paddingBottom: '40px' }}>
        {currentTab === 'dashboard' && <Dashboard />}
        {currentTab === 'bracket' && <Bracket />}
        {currentTab === 'standings' && <StandingsTable />}
        {currentTab === 'admin' && <AdminPanel />}
      </main>
    </div>
  );
}

const navBtnStyle = (isActive) => ({
  background: isActive ? '#00ff8822' : 'none',
  border: isActive ? '1px solid #00ff88' : '1px solid #333',
  color: isActive ? '#00ff88' : '#aaa',
  fontWeight: 'bold',
  cursor: 'pointer',
  fontSize: '0.85rem',
  padding: '8px 16px',
  borderRadius: '6px',
  transition: 'all 0.2s ease',
});