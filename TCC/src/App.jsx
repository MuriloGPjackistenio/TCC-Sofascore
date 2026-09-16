import { useState } from 'react';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel';
import Bracket from './components/Bracket';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div style={{ padding: '24px', maxWidth: '1100px', margin: '0 auto' }}>
      {/* Cabeçalho Ajustado */}
      <header style={{
        display: 'flex', 
        justify: 'space-between', 
        alignItems: 'center', 
        paddingBottom: '20px',
        borderBottom: '1px solid #222235',
        marginBottom: '32px'
      }}>
        {/* Logo */}
        <h1 style={{ 
          color: '#00e87a', 
          fontSize: '26px', 
          fontWeight: 'bold', 
          letterSpacing: '2px',
          margin: 0 
        }}>
          KNOCKR
        </h1>
        
        {/* Menu de Navegação */}
        <nav style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={() => setActiveTab('dashboard')} 
            style={{ 
              background: activeTab === 'dashboard' ? '#12121e' : 'transparent', 
              border: activeTab === 'dashboard' ? '1px solid #00e87a' : '1px solid transparent', 
              color: activeTab === 'dashboard' ? '#00e87a' : '#8a8a9e', 
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer', 
              fontWeight: 'bold',
              fontSize: '13px',
              transition: 'all 0.2s'
            }}>
            DASHBOARD
          </button>

          <button 
            onClick={() => setActiveTab('bracket')} 
            style={{ 
              background: activeTab === 'bracket' ? '#12121e' : 'transparent', 
              border: activeTab === 'bracket' ? '#00e87a' : '1px solid transparent', 
              color: activeTab === 'bracket' ? '#00e87a' : '#8a8a9e', 
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer', 
              fontWeight: 'bold',
              fontSize: '13px',
              transition: 'all 0.2s'
            }}>
            CHAVEAMENTO
          </button>

          <button 
            onClick={() => setActiveTab('admin')} 
            style={{ 
              background: activeTab === 'admin' ? '#12121e' : 'transparent', 
              border: activeTab === 'admin' ? '#00e87a' : '#8a8a9e', 
              color: activeTab === 'admin' ? '#00e87a' : '#8a8a9e', 
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer', 
              fontWeight: 'bold',
              fontSize: '13px',
              transition: 'all 0.2s'
            }}>
            ADMIN
          </button>
        </nav>
      </header>

      {/* Exibição das Telas */}
      <main>
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'bracket' && <Bracket />}
        {activeTab === 'admin' && <AdminPanel />}
      </main>
    </div>
    
  );
}