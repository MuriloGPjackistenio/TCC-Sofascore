import React, { useState, useEffect } from 'react';

export default function StandingsTable() {
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournamentId, setSelectedTournamentId] = useState('');
  const [standings, setStandings] = useState([]);

  useEffect(() => {
    // Busca apenas torneios do tipo PONTOS_CORRIDOS
    fetch('http://localhost:3000/tournaments')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const leagueTournaments = data.filter((t) => t.type === 'PONTOS_CORRIDOS');
          setTournaments(leagueTournaments);
          if (leagueTournaments.length > 0) {
            setSelectedTournamentId(leagueTournaments[0].id);
          }
        }
      })
      .catch((err) => console.error('Erro ao buscar torneios:', err));
  }, []);

  useEffect(() => {
    if (!selectedTournamentId) {
      setStandings([]);
      return;
    }

    // Busca a classificação filtrada pelo torneio selecionado
    fetch(`http://localhost:3000/standings?tournamentId=${selectedTournamentId}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setStandings(data);
      })
      .catch((err) => console.error('Erro ao buscar classificação:', err));
  }, [selectedTournamentId]);

  return (
    <div style={{ maxWidth: '900px', margin: '2rem auto', color: '#fff', fontFamily: 'sans-serif', padding: '0 1rem' }}>
      <h2 style={{ color: '#00ff88', textAlign: 'center', marginBottom: '20px' }}>📊 Tabela de Classificação - Pontos Corridos</h2>

      {/* Seletor de Campeonato de Pontos Corridos */}
      <div style={{ marginBottom: '25px', textAlign: 'center' }}>
        <label style={{ marginRight: '10px', fontWeight: 'bold', color: '#aaa' }}>Escolha o Campeonato:</label>
        <select
          value={selectedTournamentId}
          onChange={(e) => setSelectedTournamentId(e.target.value)}
          style={{ padding: '10px 15px', backgroundColor: '#1a1a1a', color: '#00ff88', border: '1px solid #00ff88', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          {tournaments.length === 0 ? (
            <option value="">Nenhum campeonato de Pontos Corridos cadastrado</option>
          ) : (
            tournaments.map((t) => (
              <option key={t.id} value={t.id}>
                🏆 {t.name}
              </option>
            ))
          )}
        </select>
      </div>

      {standings.length === 0 ? (
        <p style={{ color: '#888', textAlign: 'center', marginTop: '30px' }}>
          Nenhum time vinculado ou partida encerrada neste campeonato ainda.
        </p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#141414', borderRadius: '8px', overflow: 'hidden', border: '1px solid #222' }}>
            <thead>
              <tr style={{ backgroundColor: '#1c1c1c', color: '#00ff88', textAlign: 'center', fontSize: '0.85rem', borderBottom: '1px solid #333' }}>
                <th style={{ padding: '12px 8px', width: '40px' }}>#</th>
                <th style={{ textAlign: 'left', padding: '12px' }}>Time</th>
                <th style={{ padding: '12px 8px' }} title="Jogos">J</th>
                <th style={{ padding: '12px 8px' }} title="Vitórias">V</th>
                <th style={{ padding: '12px 8px' }} title="Empates">E</th>
                <th style={{ padding: '12px 8px' }} title="Derrotas">D</th>
                <th style={{ padding: '12px 8px' }} title="Gols Pró">GP</th>
                <th style={{ padding: '12px 8px' }} title="Gols Contra">GC</th>
                <th style={{ padding: '12px 8px' }} title="Saldo de Gols">SG</th>
                <th style={{ padding: '12px 12px', color: '#00ff88' }} title="Pontos">PTS</th>
              </tr>
            </thead>
            <tbody>
              {standings.map((team, index) => (
                <tr key={team.id} style={{ borderBottom: '1px solid #222', textAlign: 'center', fontSize: '0.9rem', backgroundColor: index === 0 ? '#00ff8811' : 'transparent' }}>
                  <td style={{ padding: '12px 8px', fontWeight: 'bold', color: index === 0 ? '#00ff88' : '#aaa' }}>
                    {index + 1}
                  </td>
                  <td style={{ textAlign: 'left', padding: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {team.logoUrl ? (
                      <img src={team.logoUrl} alt="" style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#333' }} />
                    )}
                    <span style={{ fontWeight: '500' }}>{team.name}</span>
                  </td>
                  <td style={{ padding: '12px 8px', color: '#ccc' }}>{team.played}</td>
                  <td style={{ padding: '12px 8px', color: '#ccc' }}>{team.won}</td>
                  <td style={{ padding: '12px 8px', color: '#ccc' }}>{team.drawn}</td>
                  <td style={{ padding: '12px 8px', color: '#ccc' }}>{team.lost}</td>
                  <td style={{ padding: '12px 8px', color: '#ccc' }}>{team.gf}</td>
                  <td style={{ padding: '12px 8px', color: '#ccc' }}>{team.ga}</td>
                  <td style={{ padding: '12px 8px', color: '#ccc' }}>{team.gd}</td>
                  <td style={{ padding: '12px 12px', fontWeight: 'bold', color: '#00ff88', fontSize: '1rem' }}>{team.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}