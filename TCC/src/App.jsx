import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import Bracket from './components/Bracket';
import StandingsTable from './components/StandingsTable';
import AdminPanel from './components/AdminPanel';

export default function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');

  return (
    <div style={{ backgroundColor: '#0d0d0d', minHeight: '100vh', color: '#fff' }}>
      {/* Barra de Navegação Superior */}
      <nav style={{ display: 'flex', justifyContent: 'center', gap: '20px', padding: '20px', borderBottom: '1px solid #222' }}>
        <h1 style={{ color: '#00ff88', margin: 0, fontSize: '1.2rem', alignSelf: 'center', marginRight: '20px' }}>KNOCKR</h1>
        
        <button onClick={() => setCurrentTab('dashboard')} style={navBtnStyle(currentTab === 'dashboard')}>DASHBOARD</button>
        <button onClick={() => setCurrentTab('bracket')} style={navBtnStyle(currentTab === 'bracket')}>CHAVEAMENTO</button>
        <button onClick={() => setCurrentTab('standings')} style={navBtnStyle(currentTab === 'standings')}>📊 TABELA</button>
        <button onClick={() => setCurrentTab('admin')} style={navBtnStyle(currentTab === 'admin')}>ADMIN</button>
      </nav>

      {/* Conteúdo Dinâmico */}
      {currentTab === 'dashboard' && <Dashboard />}
      {currentTab === 'bracket' && <Bracket />}
      {currentTab === 'standings' && <StandingsTable />}
      {currentTab === 'admin' && <AdminPanel />}
    </div>
  );
}

const navBtnStyle = (isActive) => ({
  background: 'none',
  border: 'none',
  color: isActive ? '#00ff88' : '#aaa',
  fontWeight: 'bold',
  cursor: 'pointer',
  fontSize: '0.9rem',
  padding: '5px 10px',
  borderBottom: isActive ? '2px solid #00ff88' : 'none'
});