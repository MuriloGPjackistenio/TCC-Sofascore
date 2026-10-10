import React, { useState, useEffect } from 'react';

export default function Dashboard() {
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const [resMatches, resTeams] = await Promise.all([
        fetch('http://localhost:3000/matches'),
        fetch('http://localhost:3000/teams')
      ]);

      const dataMatches = await resMatches.json();
      const dataTeams = await resTeams.json();

      if (Array.isArray(dataMatches)) setMatches(dataMatches);
      if (Array.isArray(dataTeams)) setTeams(dataTeams);
    } catch (error) {
      console.error('Erro ao buscar dados do Dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    // Atualização automática a cada 5 segundos (Polling para tempo real)
    const interval = setInterval(fetchDashboardData, 5000);
    return () => clearInterval(interval);
  }, []);

  // Função auxiliar para obter dados do time pelo ID
  const getTeam = (id) => teams.find((t) => t.id === id) || { name: 'Time', code: '---' };

  if (loading) return <div style={{ color: '#fff', textAlign: 'center', marginTop: '2rem' }}>Carregando partidas...</div>;

  return (
    <div style={{ maxWidth: '1000px', margin: '2rem auto', color: '#fff', padding: '0 1rem' }}>
      <h2 style={{ color: '#00ff88', marginBottom: '1.5rem' }}>Partidas ao Vivo / Agendadas</h2>

      {matches.length === 0 ? (
        <p>Nenhuma partida cadastrada no momento.</p>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {matches.map((match) => {
            const home = getTeam(match.home_team_id);
            const away = getTeam(match.away_team_id);

            return (
              <div
                key={match.id}
                style={{
                  backgroundColor: '#111',
                  border: '1px solid #333',
                  borderRadius: '8px',
                  padding: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                {/* Time Mandante */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, justifyContent: 'flex-end' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{home.name}</span>
                </div>

                {/* Placar e Status */}
                <div style={{ padding: '0 2rem', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: '#00ff88', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                    {match.phase} — {match.status}
                  </span>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', letterSpacing: '2px' }}>
                    {match.home_score} : {match.away_score}
                  </div>
                </div>

                {/* Time Visitante */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{away.name}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}