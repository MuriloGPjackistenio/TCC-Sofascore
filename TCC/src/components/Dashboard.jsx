import React, { useState, useEffect } from 'react';

export default function Dashboard() {
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [events, setEvents] = useState([]);
  const [homeSquad, setHomeSquad] = useState([]);
  const [awaySquad, setAwaySquad] = useState([]);

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

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenMatchDetails = async (match) => {
    setSelectedMatch(match);
    const homeId = match.homeTeamId ?? match.home_team_id;
    const awayId = match.awayTeamId ?? match.away_team_id;

    const [resEv, resH, resA] = await Promise.all([
      fetch(`http://localhost:3000/matches/${match.id}/events`),
      fetch(`http://localhost:3000/teams/${homeId}/players`),
      fetch(`http://localhost:3000/teams/${awayId}/players`)
    ]);

    setEvents(await resEv.json());
    setHomeSquad(await resH.json());
    setAwaySquad(await resA.json());
  };

  const getTeam = (id) => teams.find((t) => t.id === Number(id));

  return (
    <div style={{ maxWidth: '1000px', margin: '2rem auto', color: '#fff', padding: '0 1rem', fontFamily: 'sans-serif' }}>
      <h2 style={{ color: '#00ff88', marginBottom: '1.5rem', textAlign: 'center' }}>Painel do Racha ao Vivo</h2>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {matches.map((match) => {
          const home = getTeam(match.homeTeamId ?? match.home_team_id);
          const away = getTeam(match.awayTeamId ?? match.away_team_id);

          return (
            <div
              key={match.id}
              onClick={() => handleOpenMatchDetails(match)}
              style={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px', padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
            >
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{home?.name || 'Time A'}</span>
                {home?.logoUrl && <img src={home.logoUrl} alt="escudo" style={{ width: '35px', height: '35px', borderRadius: '50%' }} />}
              </div>

              <div style={{ padding: '0 2rem', textAlign: 'center', minWidth: '150px' }}>
                <span style={{ fontSize: '0.8rem', color: '#00ff88' }}>{match.phase}</span>
                <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{match.homeScore} : {match.awayScore}</div>
              </div>

              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '10px' }}>
                {away?.logoUrl && <img src={away.logoUrl} alt="escudo" style={{ width: '35px', height: '35px', borderRadius: '50%' }} />}
                <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{away?.name || 'Time B'}</span>
              </div>
            </div>
          );
        })}
      </div>

      {selectedMatch && (
        <div onClick={() => setSelectedMatch(null)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: '#181818', padding: '2rem', borderRadius: '10px', maxWidth: '750px', width: '90%', border: '1px solid #00ff88', maxHeight: '85vh', overflowY: 'auto' }}>
            <h3 style={{ color: '#00ff88', textAlign: 'center' }}>{selectedMatch.phase}</h3>

            <h4 style={{ color: '#00ff88', marginTop: '20px' }}>Escalação dos Atletas:</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '10px' }}>
              <div>
                <h5>{getTeam(selectedMatch.homeTeamId)?.name}</h5>
                {homeSquad.map((p) => (
                  <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#222', padding: '8px', borderRadius: '6px', marginBottom: '8px' }}>
                    <img src={p.photoUrl || 'https://via.placeholder.com/40'} alt="atleta" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                    <div>
                      <strong style={{ display: 'block', color: '#00ff88' }}>#{p.number} {p.fullName}</strong>
                      <span style={{ fontSize: '0.75rem', color: '#aaa' }}>{p.email}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <h5>{getTeam(selectedMatch.awayTeamId)?.name}</h5>
                {awaySquad.map((p) => (
                  <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#222', padding: '8px', borderRadius: '6px', marginBottom: '8px' }}>
                    <img src={p.photoUrl || 'https://via.placeholder.com/40'} alt="atleta" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                    <div>
                      <strong style={{ display: 'block', color: '#00ff88' }}>#{p.number} {p.fullName}</strong>
                      <span style={{ fontSize: '0.75rem', color: '#aaa' }}>{p.email}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={() => setSelectedMatch(null)} style={{ width: '100%', padding: '10px', backgroundColor: '#00ff88', color: '#000', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', marginTop: '20px' }}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}