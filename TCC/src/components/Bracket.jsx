import React, { useState, useEffect } from 'react';

export default function Bracket() {
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournamentId, setSelectedTournamentId] = useState('');
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [penaltiesByMatch, setPenaltiesByMatch] = useState({});

  useEffect(() => {
    fetch('http://localhost:3000/tournaments')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const knockouts = data.filter((t) => t.type === 'MATA_MATA' || t.type === 'GRUPOS');
          setTournaments(knockouts);
          if (knockouts.length > 0) setSelectedTournamentId(knockouts[0].id);
        }
      })
      .catch((err) => console.error(err));

    fetch('http://localhost:3000/teams')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setTeams(data);
      })
      .catch((err) => console.error(err));
  }, []);

  const fetchMatchesAndPenalties = async () => {
    try {
      const resMatches = await fetch('http://localhost:3000/matches');
      const dataMatches = await resMatches.json();

      if (Array.isArray(dataMatches)) {
        setMatches(dataMatches);

        const penMap = {};
        for (const m of dataMatches) {
          const resEv = await fetch(`http://localhost:3000/matches/${m.id}/events`);
          const events = await resEv.json();

          if (Array.isArray(events)) {
            const penEvents = events.filter((e) => e.type === 'PENALTY_SHOOTOUT');
            let homePen = 0;
            let awayPen = 0;
            const hId = m.homeTeamId ?? m.home_team_id;
            const aId = m.awayTeamId ?? m.away_team_id;

            penEvents.forEach((p) => {
              if (p.detail === 'GOAL') {
                if (Number(p.teamId) === Number(hId)) homePen++;
                if (Number(p.teamId) === Number(aId)) awayPen++;
              }
            });

            if (penEvents.length > 0) {
              penMap[m.id] = { homePen, awayPen, hasPenalties: true };
            }
          }
        }
        setPenaltiesByMatch(penMap);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMatchesAndPenalties();
    const interval = setInterval(fetchMatchesAndPenalties, 3000);
    return () => clearInterval(interval);
  }, []);

  const getTeam = (id) => teams.find((t) => t.id === Number(id));

  const filteredMatches = matches.filter(
    (m) => Number(m.tournamentId ?? m.tournament_id) === Number(selectedTournamentId)
  );

  const finalMatch = filteredMatches.find(
    (m) => m.phase?.toLowerCase().includes('final') && !m.phase?.toLowerCase().includes('semi')
  );

  let championTeam = null;
  if (finalMatch && finalMatch.status === 'ENCERRADO') {
    const penData = penaltiesByMatch[finalMatch.id] || { homePen: 0, awayPen: 0, hasPenalties: false };
    const hScore = finalMatch.homeScore ?? finalMatch.home_score ?? 0;
    const aScore = finalMatch.awayScore ?? finalMatch.away_score ?? 0;
    const hId = finalMatch.homeTeamId ?? finalMatch.home_team_id;
    const aId = finalMatch.awayTeamId ?? finalMatch.away_team_id;

    if (hScore > aScore) {
      championTeam = getTeam(hId);
    } else if (aScore > hScore) {
      championTeam = getTeam(aId);
    } else if (penData.hasPenalties) {
      if (penData.homePen > penData.awayPen) championTeam = getTeam(hId);
      if (penData.awayPen > penData.homePen) championTeam = getTeam(aId);
    }
  }

  return (
    <div style={{ maxWidth: '900px', margin: '2rem auto', color: '#fff', fontFamily: 'sans-serif', padding: '0 1rem' }}>
      <h2 style={{ color: '#00ff88', textAlign: 'center', marginBottom: '20px' }}>⚔️ Chaveamento Mata-Mata</h2>

      <div style={{ marginBottom: '25px', textAlign: 'center' }}>
        <label style={{ marginRight: '10px', fontWeight: 'bold', color: '#aaa' }}>Escolha o Torneio Mata-Mata:</label>
        <select
          value={selectedTournamentId}
          onChange={(e) => setSelectedTournamentId(e.target.value)}
          style={{ padding: '10px 15px', backgroundColor: '#1a1a1a', color: '#00ff88', border: '1px solid #00ff88', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          {tournaments.length === 0 ? (
            <option value="">Nenhum torneio Mata-Mata cadastrado</option>
          ) : (
            tournaments.map((t) => (
              <option key={t.id} value={t.id}>
                🏆 {t.name}
              </option>
            ))
          )}
        </select>
      </div>

      {championTeam && (
        <div style={{ backgroundColor: '#00ff8822', border: '2px solid #00ff88', borderRadius: '12px', padding: '20px', textAlign: 'center', marginBottom: '30px', boxShadow: '0 0 20px #00ff8844' }}>
          <span style={{ fontSize: '2.5rem' }}>🏆</span>
          <h2 style={{ color: '#00ff88', margin: '5px 0' }}>GRANDE CAMPEÃO</h2>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginTop: '10px' }}>
            {championTeam.logoUrl && <img src={championTeam.logoUrl} alt="" style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }} />}
            <span style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fff' }}>{championTeam.name}</span>
          </div>
        </div>
      )}

      {filteredMatches.length === 0 ? (
        <p style={{ color: '#888', textAlign: 'center', marginTop: '30px' }}>
          Nenhum jogo cadastrado para este torneio Mata-Mata ainda.
        </p>
      ) : (
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '20px' }}>
          {filteredMatches.map((m) => {
            const hId = m.homeTeamId ?? m.home_team_id;
            const aId = m.awayTeamId ?? m.away_team_id;
            const home = getTeam(hId);
            const away = getTeam(aId);
            const penInfo = penaltiesByMatch[m.id];
            const hScore = m.homeScore ?? m.home_score ?? 0;
            const aScore = m.awayScore ?? m.away_score ?? 0;

            return (
              <div
                key={m.id}
                style={{
                  backgroundColor: '#141414',
                  padding: '15px 20px',
                  borderRadius: '10px',
                  border: '1px solid #262626',
                  minWidth: '240px',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.4)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', borderBottom: '1px solid #222', paddingBottom: '6px' }}>
                  <span style={{ fontSize: '0.8rem', color: '#00ff88', fontWeight: 'bold' }}>{m.phase || 'Mata-Mata'}</span>
                  <span style={{ fontSize: '0.75rem', color: '#888' }}>{m.status}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {home?.logoUrl && <img src={home.logoUrl} alt="" style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover' }} />}
                    <span>{home?.name || 'A definir'}</span>
                  </div>
                  <strong style={{ color: '#00ff88' }}>{hScore}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {away?.logoUrl && <img src={away.logoUrl} alt="" style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover' }} />}
                    <span>{away?.name || 'A definir'}</span>
                  </div>
                  <strong style={{ color: '#00ff88' }}>{aScore}</strong>
                </div>

                {penInfo?.hasPenalties && (
                  <div style={{ marginTop: '12px', paddingTop: '8px', borderTop: '1px dashed #333', textAlign: 'center', fontSize: '0.85rem', color: '#ffbb00', fontWeight: 'bold' }}>
                    ⚽ Pênaltis: {penInfo.homePen} - {penInfo.awayPen}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}