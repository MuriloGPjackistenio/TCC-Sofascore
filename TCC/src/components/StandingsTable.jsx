import React, { useState, useEffect } from 'react';

export default function StandingsTable({ tournamentId }) {
  const [standings, setStandings] = useState([]);

  const fetchStandings = async () => {
    try {
      const url = tournamentId 
        ? `http://localhost:3000/standings?tournamentId=${tournamentId}` 
        : 'http://localhost:3000/standings';
      
      const res = await fetch(url);
      const data = await res.json();
      if (Array.isArray(data)) setStandings(data);
    } catch (err) {
      console.error('Erro ao carregar tabela de classificação:', err);
    }
  };

  useEffect(() => {
    fetchStandings();
    const interval = setInterval(fetchStandings, 5000); // Atualiza ao vivo a cada 5s
    return () => clearInterval(interval);
  }, [tournamentId]);

  return (
    <div style={{ maxWidth: '900px', margin: '2rem auto', color: '#fff', fontFamily: 'sans-serif', padding: '0 1rem' }}>
      <h3 style={{ color: '#00ff88', textAlign: 'center', marginBottom: '20px' }}>
        📊 Tabela de Classificação - Pontos Corridos
      </h3>

      <div style={{ backgroundColor: '#141414', borderRadius: '10px', overflow: 'hidden', border: '1px solid #262626' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#1c1c1c', color: '#888', borderBottom: '1px solid #262626' }}>
              <th style={{ padding: '12px', textAlign: 'left' }}># Equipa</th>
              <th title="Jogos">J</th>
              <th title="Vitórias">V</th>
              <th title="Empates">E</th>
              <th title="Derrotas">D</th>
              <th title="Gols Pró">GP</th>
              <th title="Gols Sofridos">GC</th>
              <th title="Saldo de Gols">SG</th>
              <th style={{ color: '#00ff88', padding: '12px' }} title="Pontos">PTS</th>
            </tr>
          </thead>
          <tbody>
            {standings.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ padding: '25px', color: '#666' }}>
                  Nenhum jogo finalizado neste torneio ainda.
                </td>
              </tr>
            ) : (
              standings.map((team, index) => (
                <tr
                  key={team.id}
                  style={{
                    borderBottom: '1px solid #222',
                    backgroundColor: index % 2 === 0 ? '#141414' : '#191919',
                  }}
                >
                  <td style={{ padding: '12px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontWeight: 'bold', color: index === 0 ? '#00ff88' : '#aaa', width: '20px' }}>
                      {index + 1}
                    </span>
                    {team.logoUrl && (
                      <img src={team.logoUrl} alt={team.name} style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }} />
                    )}
                    <strong style={{ color: '#fff' }}>{team.name}</strong>
                  </td>
                  <td>{team.played}</td>
                  <td>{team.won}</td>
                  <td>{team.drawn}</td>
                  <td>{team.lost}</td>
                  <td>{team.gf}</td>
                  <td>{team.ga}</td>
                  <td style={{ color: team.gd > 0 ? '#00ff88' : team.gd < 0 ? '#ff4444' : '#fff', fontWeight: 'bold' }}>
                    {team.gd > 0 ? `+${team.gd}` : team.gd}
                  </td>
                  <td style={{ fontWeight: 'bold', color: '#00ff88', fontSize: '1rem', padding: '12px' }}>
                    {team.points}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}