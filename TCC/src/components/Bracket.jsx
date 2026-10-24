import React, { useState, useEffect } from 'react';

export default function Bracket() {
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/matches')
      .then((res) => res.json())
      .then((data) => {
        // Garante que é sempre um Array
        if (Array.isArray(data)) {
          setMatches(data);
        } else {
          setMatches([]);
        }
      })
      .catch((err) => {
        console.error('Erro ao buscar partidas:', err);
        setMatches([]);
      });

    fetch('http://localhost:3000/teams')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setTeams(data);
      })
      .catch((err) => console.error(err));
  }, []);

  const getTeam = (id) => teams.find((t) => t.id === Number(id));

  // Proteção contra erro: só faz filter se for Array
  const safeMatches = Array.isArray(matches) ? matches : [];

  return (
    <div style={{ padding: '20px', color: '#fff', textAlign: 'center' }}>
      <h3 style={{ color: '#00ff88' }}>⚔️ Chaveamento do Torneio</h3>

      {safeMatches.length === 0 ? (
        <p style={{ color: '#888', marginTop: '20px' }}>Nenhum jogo agendado para o chaveamento ainda.</p>
      ) : (
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '20px' }}>
          {safeMatches.map((m) => {
            const home = getTeam(m.homeTeamId ?? m.home_team_id);
            const away = getTeam(m.awayTeamId ?? m.away_team_id);

            return (
              <div key={m.id} style={{ backgroundColor: '#1f1f1f', padding: '15px', borderRadius: '8px', border: '1px solid #333', minWidth: '200px' }}>
                <span style={{ fontSize: '0.8rem', color: '#00ff88', display: 'block', marginBottom: '8px' }}>
                  {m.phase || 'Mata-Mata'}
                </span>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span>{home?.name || 'A definir'}</span>
                  <strong>{m.homeScore ?? 0}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{away?.name || 'A definir'}</span>
                  <strong>{m.awayScore ?? 0}</strong>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}