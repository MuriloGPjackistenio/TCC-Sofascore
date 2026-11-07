import React from 'react';

export default function HomeLanding({ onNavigate }) {
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem', color: '#fff', fontFamily: 'sans-serif' }}>
      {/* Hero Section */}
      <div style={{ textAlign: 'center', padding: '40px 20px', backgroundColor: '#141414', borderRadius: '16px', border: '1px solid #00ff8844', marginBottom: '40px', boxShadow: '0 0 30px rgba(0, 255, 136, 0.1)' }}>
        <h1 style={{ fontSize: '2.8rem', color: '#00ff88', margin: '0 0 10px 0', letterSpacing: '1px' }}>
          KNOCKR
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#ccc', maxWidth: '650px', margin: '0 auto 25px auto', lineHeight: '1.5' }}>
          A plataforma completa de gestão e acompanhamento de torneios de futebol em tempo real para <strong>Peladas/Rachas</strong>.
        </p>

        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button 
            onClick={() => onNavigate('dashboard')} 
            style={{ padding: '12px 24px', backgroundColor: '#00ff88', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', transition: 'transform 0.2s' }}
          >
            📱 Ver Jogos Ao Vivo
          </button>
          <button 
            onClick={() => onNavigate('bracket')} 
            style={{ padding: '12px 24px', backgroundColor: '#222', color: '#00ff88', border: '1px solid #00ff88', fontWeight: 'bold', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem' }}
          >
            ⚔️ Chaveamento Mata-Mata
          </button>
        </div>
      </div>

      {/* Seção de Funcionalidades */}
      <h2 style={{ textAlign: 'center', color: '#00ff88', marginBottom: '30px' }}>⚡ O que você encontra no KNOCKR?</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        
        {/* Card 1 */}
        <div style={{ backgroundColor: '#181818', padding: '20px', borderRadius: '12px', border: '1px solid #282828' }}>
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>⏱️</div>
          <h3 style={{ color: '#00ff88', margin: '0 0 10px 0' }}>Mesa & VAR em Tempo Real</h3>
          <p style={{ color: '#aaa', fontSize: '0.9rem', lineHeight: '1.4' }}>
            Acompanhamento ao vivo de golos, cartões vermelhos que impedem atletas de continuar no jogo, revisão do VAR e gestão de acréscimos.
          </p>
        </div>

        {/* Card 2 */}
        <div style={{ backgroundColor: '#181818', padding: '20px', borderRadius: '12px', border: '1px solid #282828' }}>
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>⚔️</div>
          <h3 style={{ color: '#00ff88', margin: '0 0 10px 0' }}>Mata-Mata & Pênaltis</h3>
          <p style={{ color: '#aaa', fontSize: '0.9rem', lineHeight: '1.4' }}>
            Chaveamento dinâmico para eliminatórias, prorrogação de 120 minutos, disputa de pênaltis estilo SofaScore e coroação automática do Campeão!
          </p>
        </div>

        {/* Card 3 */}
        <div style={{ backgroundColor: '#181818', padding: '20px', borderRadius: '12px', border: '1px solid #282828' }}>
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📊</div>
          <h3 style={{ color: '#00ff88', margin: '0 0 10px 0' }}>Pontos Corridos</h3>
          <p style={{ color: '#aaa', fontSize: '0.9rem', lineHeight: '1.4' }}>
            Tabela de classificação calculada automaticamente por saldo de golos, vitórias e pontos conforme os jogos vão sendo encerrados.
          </p>
        </div>
      </div>

      {/* Rodapé Informativo */}
      <div style={{ textAlign: 'center', borderTop: '1px solid #222', paddingTop: '20px', color: '#666', fontSize: '0.85rem' }}>
        KNOCKR — Desenvolvido para melhorar as peladas do Brasil
      </div>
    </div>
  );
}