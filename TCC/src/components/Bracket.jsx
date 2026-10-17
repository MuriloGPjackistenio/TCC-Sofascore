import React, { useState, useEffect } from 'react';

export default function Bracket() {
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resM, resT] = await Promise.all([
          fetch('http://localhost:3000/matches'),
          fetch('http://localhost:3000/teams')
        ]);
        setMatches(await resM.json());
        setTeams(await resT.json());
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const getTeamName = (id) => {
    const t = teams.find((item) => item.id === Number(id));
    return t ? t.name : 'A definir';
  };

  // Filtros precisos para cada fase do torneio
  const oitavas = matches.filter((m) => m.phase?.toLowerCase().includes('oitava'));
  const quartas = matches.filter((m) => m.phase?.toLowerCase().includes('quarta'));
  const semifinals = matches.filter((m) => m.phase?.toLowerCase().includes('semi'));
  const finals = matches.filter((m) => {
    const p = m.phase?.toLowerCase() || '';
    return p.includes('final') && !p.includes('semi') && !p.includes('quarta') && !p.includes('oitava');
  });

  const renderMatchCard = (m, isFinal = false) => (
    <div
      key={m.id}
      style={{
        backgroundColor: '#111',
        border: isFinal ? '1px solid #00ff88' : '1px solid #333',
        borderRadius: '6px',
        padding: '12px',
        marginBottom: '10px'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
        <span>{getTeamName(m.home_team_id ?? m.homeTeamId)}</span>
        <strong>{m.home_score ?? m.homeScore ?? 0}</strong>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>{getTeamName(m.away_team_id ?? m.awayTeamId)}</span>
        <strong>{m.away_score ?? m.awayScore ?? 0}</strong>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: '1100px', margin: '2rem auto', color: '#fff', padding: '0 1rem' }}>
      <h2 style={{ color: '#00ff88', marginBottom: '1.5rem' }}>Chaveamento do Torneio</h2>

      <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', overflowX: 'auto' }}>
        {oitavas.length > 0 && (
          <div style={{ flex: 1, minWidth: '180px' }}>
            <h3 style={{ fontSize: '0.85rem', color: '#aaa', marginBottom: '10px' }}>OITAVAS DE FINAL</h3>
            {oitavas.map((m) => renderMatchCard(m))}
          </div>
        )}

        {quartas.length > 0 && (
          <div style={{ flex: 1, minWidth: '180px' }}>
            <h3 style={{ fontSize: '0.85rem', color: '#aaa', marginBottom: '10px' }}>QUARTAS DE FINAL</h3>
            {quartas.map((m) => renderMatchCard(m))}
          </div>
        )}

        <div style={{ flex: 1, minWidth: '180px' }}>
          <h3 style={{ fontSize: '0.85rem', color: '#aaa', marginBottom: '10px' }}>SEMIFINAIS</h3>
          {semifinals.length === 0 ? <p style={{ fontSize: '0.8rem', color: '#666' }}>Nenhuma semifinal.</p> : semifinals.map((m) => renderMatchCard(m))}
        </div>

        <div style={{ flex: 1, minWidth: '180px' }}>
          <h3 style={{ fontSize: '0.85rem', color: '#00ff88', marginBottom: '10px' }}>★ GRANDE FINAL</h3>
          {finals.length === 0 ? <p style={{ fontSize: '0.8rem', color: '#666' }}>Nenhuma final.</p> : finals.map((m) => renderMatchCard(m, true))}
        </div>
      </div>
    </div>
  );
}