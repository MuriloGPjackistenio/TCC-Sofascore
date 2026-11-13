import React, { useState, useEffect } from 'react';
import { API_URL } from '../api';

export default function Dashboard() {
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [matchEvents, setMatchEvents] = useState({}); // Guarda os eventos por ID de partida

  const fetchData = async () => {
    try {
      const [resMatches, resTeams] = await Promise.all([
        fetch(`${API_URL}/matches`),
        fetch(`${API_URL}/teams`)
      ]);

      const matchesData = await resMatches.json();
      const teamsData = await resTeams.json();

      if (Array.isArray(matchesData)) {
        setMatches(matchesData);

        // Busca os eventos de cada partida individualmente
        const eventsMap = {};
        for (const m of matchesData) {
          const resEv = await fetch(`${API_URL}/matches/${m.id}/events`);
          const evData = await resEv.json();
          eventsMap[m.id] = Array.isArray(evData) ? evData : [];
        }
        setMatchEvents(eventsMap);
      }

      if (Array.isArray(teamsData)) setTeams(teamsData);
    } catch (err) {
      console.error('Erro ao carregar dados do dashboard:', err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // Atualiza a cada 5 segundos em tempo real
    return () => clearInterval(interval);
  }, []);

  const getTeam = (id) => teams.find((t) => t.id === Number(id));

  // Ícones e cores para cada tipo de evento do SofaScore
  const renderEventIcon = (type) => {
    switch (type) {
      case 'GOAL':
      case 'PENALTY_GOAL': return '⚽';
      case 'OWN_GOAL': return '🤡';
      case 'VAR_REVIEW': return '🖥️';
      case 'VAR_CANCEL': return '❌';
      case 'YELLOW_CARD': return '🟨';
      case 'RED_CARD': return '🟥';
      case 'SUBSTITUTION': return '🔄';
      default: return '⚡';
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', color: '#fff', fontFamily: 'sans-serif', padding: '0 1rem' }}>
      <h2 style={{ color: '#00ff88', textAlign: 'center', marginBottom: '25px' }}>Jogos & Acontecimentos ao Vivo</h2>

      {(!Array.isArray(matches) || matches.length === 0) ? (
        <div style={{ textAlign: 'center', padding: '30px', backgroundColor: '#111', borderRadius: '8px', color: '#888' }}>
          Nenhum jogo cadastrado no momento.
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {matches.map((m) => {
            const home = getTeam(m.homeTeamId ?? m.home_team_id);
            const away = getTeam(m.awayTeamId ?? m.away_team_id);
            const events = matchEvents[m.id] || [];

            return (
              <div key={m.id} style={{ backgroundColor: '#141414', border: '1px solid #262626', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
                
                {/* Cabeçalho do Card (Fase e Status) */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: '1px solid #222', paddingBottom: '10px' }}>
                  <span style={{ fontSize: '0.85rem', color: '#00ff88', fontWeight: 'bold' }}>{m.phase || 'Partida Oficial'}</span>
                  <span style={{ fontSize: '0.75rem', backgroundColor: m.status === 'EM_ANDAMENTO' ? '#ff333333' : '#222', color: m.status === 'EM_ANDAMENTO' ? '#ff4444' : '#aaa', padding: '3px 10px', borderRadius: '4px', fontWeight: 'bold' }}>
                    {m.status === 'EM_ANDAMENTO' ? '🟢 AO VIVO' : m.status}
                  </span>
                </div>

                {/* Placar Principal */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                  {/* Mandante */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, justifyContent: 'flex-start' }}>
                    {home?.logoUrl && <img src={home.logoUrl} alt={home.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />}
                    <strong style={{ fontSize: '1.1rem' }}>{home?.name || 'Mandante'}</strong>
                  </div>

                  {/* Placar */}
                  <div style={{ textAlign: 'center', padding: '0 20px' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#00ff88', letterSpacing: '2px' }}>
                      {m.homeScore ?? 0} - {m.awayScore ?? 0}
                    </div>
                  </div>

                  {/* Visitante */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, justifyContent: 'flex-end' }}>
                    <strong style={{ fontSize: '1.1rem', textAlign: 'right' }}>{away?.name || 'Visitante'}</strong>
                    {away?.logoUrl && <img src={away.logoUrl} alt={away.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />}
                  </div>
                </div>

                {/* Timeline de Eventos Estilo SofaScore */}
                <div style={{ backgroundColor: '#1a1a1a', borderRadius: '8px', padding: '12px', border: '1px solid #222' }}>
                  <h4 style={{ color: '#aaa', fontSize: '0.85rem', margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '1px' }}>Acontecimentos da Partida</h4>
                  
                  {events.length === 0 ? (
                    <p style={{ color: '#666', fontSize: '0.85rem', margin: 0, textAlign: 'center' }}>Nenhum evento registrado até o momento.</p>
                  ) : (
                    <div style={{ display: 'grid', gap: '8px' }}>
                      {events.map((ev, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem', backgroundColor: '#222', padding: '6px 10px', borderRadius: '4px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>{renderEventIcon(ev.type)}</span>
                            <span style={{ fontWeight: 'bold' }}>{ev.playerName || 'Evento'}</span>
                            {ev.playerOutName && <span style={{ color: '#888' }}>(Sai: {ev.playerOutName})</span>}
                          </div>
                          <span style={{ color: '#00ff88', fontWeight: 'bold', backgroundColor: '#111', padding: '2px 6px', borderRadius: '4px' }}>
                            {ev.minute ? `${ev.minute}'` : ''}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}