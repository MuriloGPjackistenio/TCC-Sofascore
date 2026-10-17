import React, { useState, useEffect } from 'react';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('matches');
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedMatchId, setSelectedMatchId] = useState('');

  // Form Equipa do Racha
  const [teamName, setTeamName] = useState('');
  const [teamCode, setTeamCode] = useState('');
  const [logoUrl, setLogoUrl] = useState('');

  // Form Lista de Jogadores
  const [playersList, setPlayersList] = useState([
    { fullName: '', email: '', number: '', photoUrl: '' }
  ]);

  // Form Partida
  const [phase, setPhase] = useState('Rodada do Racha');
  const [homeTeamId, setHomeTeamId] = useState('');
  const [awayTeamId, setAwayTeamId] = useState('');

  // Form Evento Avançado
  const [eventType, setEventType] = useState('GOAL');
  const [eventTeamId, setEventTeamId] = useState('');
  const [teamPlayers, setTeamPlayers] = useState([]);
  const [minute, setMinute] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [playerOutName, setPlayerOutName] = useState('');
  const [detail, setDetail] = useState('');

  const fetchData = async () => {
    try {
      const resM = await fetch('http://localhost:3000/matches');
      const resT = await fetch('http://localhost:3000/teams');
      setMatches(await resM.json());
      setTeams(await resT.json());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!eventTeamId) {
      setTeamPlayers([]);
      setPlayerName('');
      setPlayerOutName('');
      return;
    }

    fetch(`http://localhost:3000/teams/${eventTeamId}/players`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setTeamPlayers(data);
      })
      .catch((err) => console.error(err));
  }, [eventTeamId]);

  const handleAddPlayerField = () => {
    setPlayersList([...playersList, { fullName: '', email: '', number: '', photoUrl: '' }]);
  };

  const handlePlayerChange = (index, field, value) => {
    const updated = [...playersList];
    updated[index][field] = value;
    setPlayersList(updated);
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    if (!teamName || !teamCode) return alert('Preencha o nome do time e sigla!');

    for (let p of playersList) {
      if (!p.fullName || !p.email || !p.number) {
        return alert('Todos os jogadores cadastrados precisam ter Nome Completo, E-mail e Número de Camisa!');
      }
    }

    await fetch('http://localhost:3000/teams', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: teamName,
        code: teamCode,
        logoUrl,
        squad: playersList
      }),
    });

    alert('Time do Racha e Atletas Cadastrados!');
    setTeamName('');
    setTeamCode('');
    setLogoUrl('');
    setPlayersList([{ fullName: '', email: '', number: '', photoUrl: '' }]);
    fetchData();
  };

  const handleCreateMatch = async (e) => {
    e.preventDefault();
    if (!homeTeamId || !awayTeamId) return alert('Selecione os dois times!');

    await fetch('http://localhost:3000/matches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phase, homeTeamId, awayTeamId, status: 'EM_ANDAMENTO' }),
    });

    alert('Jogo Iniciado!');
    fetchData();
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (!selectedMatchId || !eventTeamId) return alert('Selecione a partida e o time!');

    await fetch('http://localhost:3000/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        matchId: Number(selectedMatchId),
        teamId: Number(eventTeamId),
        type: eventType,
        minute,
        playerName,
        playerOutName,
        detail,
      }),
    });

    alert('Evento de arbitragem registrado com sucesso!');
    setMinute('');
    setPlayerName('');
    setPlayerOutName('');
    setDetail('');
    fetchData();
  };

  const getTeamName = (id) => teams.find((t) => t.id === Number(id))?.name || `Time #${id}`;
  const currentSelectedMatch = matches.find((m) => m.id === Number(selectedMatchId));

  return (
    <div style={{ maxWidth: '900px', margin: '2rem auto', color: '#fff', fontFamily: 'sans-serif', padding: '0 1rem' }}>
      <h2 style={{ color: '#00ff88', textAlign: 'center' }}>Organizador de Racha & Torneios (Modo Profissional)</h2>

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px' }}>
        <button onClick={() => setActiveTab('teams')} style={{ padding: '10px 20px', borderRadius: '5px', backgroundColor: activeTab === 'teams' ? '#00ff88' : '#222', color: activeTab === 'teams' ? '#000' : '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Cadastrar Time & Elenco</button>
        <button onClick={() => setActiveTab('matches')} style={{ padding: '10px 20px', borderRadius: '5px', backgroundColor: activeTab === 'matches' ? '#00ff88' : '#222', color: activeTab === 'matches' ? '#000' : '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Gerenciar Jogos & VAR</button>
      </div>

      {activeTab === 'teams' && (
        <div style={{ backgroundColor: '#111', padding: '20px', borderRadius: '10px', border: '1px solid #333' }}>
          <h3>Cadastrar Novo Time do Racha</h3>
          <form onSubmit={handleCreateTeam}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '15px' }}>
              <input type="text" placeholder="Nome do Time (ex: Não Choraxs FC)" value={teamName} onChange={(e) => setTeamName(e.target.value)} style={{ padding: '10px', borderRadius: '5px', backgroundColor: '#222', color: '#fff' }} />
              <input type="text" placeholder="Sigla (ex: NCH)" value={teamCode} onChange={(e) => setTeamCode(e.target.value)} style={{ padding: '10px', borderRadius: '5px', backgroundColor: '#222', color: '#fff' }} />
              <input type="text" placeholder="URL da Foto do Escudo" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} style={{ padding: '10px', borderRadius: '5px', backgroundColor: '#222', color: '#fff' }} />
            </div>

            <h4 style={{ color: '#00ff88', marginTop: '20px' }}>Atletas do Elenco:</h4>
            {playersList.map((p, idx) => (
              <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 2fr', gap: '10px', marginBottom: '10px', backgroundColor: '#1a1a1a', padding: '10px', borderRadius: '5px' }}>
                <input type="text" placeholder="Nome Completo" value={p.fullName} onChange={(e) => handlePlayerChange(idx, 'fullName', e.target.value)} style={{ padding: '8px', borderRadius: '4px', backgroundColor: '#222', color: '#fff' }} />
                <input type="email" placeholder="E-mail" value={p.email} onChange={(e) => handlePlayerChange(idx, 'email', e.target.value)} style={{ padding: '8px', borderRadius: '4px', backgroundColor: '#222', color: '#fff' }} />
                <input type="number" placeholder="Nº Camisa" value={p.number} onChange={(e) => handlePlayerChange(idx, 'number', e.target.value)} style={{ padding: '8px', borderRadius: '4px', backgroundColor: '#222', color: '#fff' }} />
                <input type="text" placeholder="URL da Foto do Jogador" value={p.photoUrl} onChange={(e) => handlePlayerChange(idx, 'photoUrl', e.target.value)} style={{ padding: '8px', borderRadius: '4px', backgroundColor: '#222', color: '#fff' }} />
              </div>
            ))}

            <button type="button" onClick={handleAddPlayerField} style={{ padding: '8px 15px', backgroundColor: '#333', color: '#00ff88', border: '1px solid #00ff88', borderRadius: '5px', cursor: 'pointer', marginBottom: '20px' }}>
              + Adicionar Outro Jogador
            </button>

            <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#00ff88', color: '#000', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>
              Salvar Time do Racha
            </button>
          </form>
        </div>
      )}

      {activeTab === 'matches' && (
        <div style={{ backgroundColor: '#111', padding: '20px', borderRadius: '10px', border: '1px solid #333' }}>
          <h3>Iniciar Novo Jogo</h3>
          <form onSubmit={handleCreateMatch} style={{ marginBottom: '30px' }}>
            <input type="text" placeholder="Fase ou Nome da Rodada" value={phase} onChange={(e) => setPhase(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', backgroundColor: '#222', color: '#fff' }} />
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <select value={homeTeamId} onChange={(e) => setHomeTeamId(e.target.value)} style={{ flex: 1, padding: '10px', borderRadius: '5px', backgroundColor: '#222', color: '#fff' }}>
                <option value="">Time Mandante</option>
                {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
              <select value={awayTeamId} onChange={(e) => setAwayTeamId(e.target.value)} style={{ flex: 1, padding: '10px', borderRadius: '5px', backgroundColor: '#222', color: '#fff' }}>
                <option value="">Time Visitante</option>
                {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#00ff88', color: '#000', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>Criar Partida</button>
          </form>

          <h3>Lançar Eventos do Jogo (VAR, Gols e Cartões)</h3>
          <select value={selectedMatchId} onChange={(e) => setSelectedMatchId(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', backgroundColor: '#222', color: '#fff' }}>
            <option value="">-- Selecione o Jogo --</option>
            {matches.map((m) => (
              <option key={m.id} value={m.id}>#{m.id} - {getTeamName(m.homeTeamId ?? m.home_team_id)} vs {getTeamName(m.awayTeamId ?? m.away_team_id)}</option>
            ))}
          </select>

          {selectedMatchId && currentSelectedMatch && (
            <form onSubmit={handleAddEvent}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                <select value={eventType} onChange={(e) => setEventType(e.target.value)} style={{ padding: '10px', borderRadius: '5px', backgroundColor: '#222', color: '#fff' }}>
                  <option value="GOAL">⚽ Golo (Soma +1)</option>
                  <option value="PENALTY_GOAL">⚪ Golo de Pênalti (Soma +1)</option>
                  <option value="OWN_GOAL">🤡 Golo Contra (Soma ao Adversário)</option>
                  <option value="FOUL">🛑 Falta Cometida</option>
                  <option value="VAR_REVIEW">🖥️ VAR em Revisão</option>
                  <option value="VAR_CANCEL">❌ Golo Anulado pelo VAR (Subtrai 1)</option>
                  <option value="SUBSTITUTION">🔄 Substituição</option>
                  <option value="YELLOW_CARD">🟨 Cartão Amarelo</option>
                  <option value="RED_CARD">🟥 Cartão Vermelho</option>
                </select>
                <input type="text" placeholder="Minuto (ex: 75')" value={minute} onChange={(e) => setMinute(e.target.value)} style={{ padding: '10px', borderRadius: '5px', backgroundColor: '#222', color: '#fff' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                <select value={eventTeamId} onChange={(e) => setEventTeamId(e.target.value)} style={{ padding: '10px', borderRadius: '5px', backgroundColor: '#222', color: '#fff' }}>
                  <option value="">Selecione o Time</option>
                  <option value={currentSelectedMatch.homeTeamId ?? currentSelectedMatch.home_team_id}>{getTeamName(currentSelectedMatch.homeTeamId ?? currentSelectedMatch.home_team_id)}</option>
                  <option value={currentSelectedMatch.awayTeamId ?? currentSelectedMatch.away_team_id}>{getTeamName(currentSelectedMatch.awayTeamId ?? currentSelectedMatch.away_team_id)}</option>
                </select>

                <select value={playerName} onChange={(e) => setPlayerName(e.target.value)} style={{ padding: '10px', borderRadius: '5px', backgroundColor: '#222', color: '#fff' }} disabled={!eventTeamId}>
                  <option value="">{eventType === 'SUBSTITUTION' ? 'Atleta que ENTRA' : 'Atleta Envolvido'}</option>
                  {teamPlayers.map((p) => (
                    <option key={p.id} value={p.fullName}>#{p.number} - {p.fullName}</option>
                  ))}
                </select>
              </div>

              {eventType === 'SUBSTITUTION' && (
                <select value={playerOutName} onChange={(e) => setPlayerOutName(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', backgroundColor: '#222', color: '#fff' }}>
                  <option value="">Atleta que SAI</option>
                  {teamPlayers.map((p) => (
                    <option key={p.id} value={p.fullName}>#{p.number} - {p.fullName}</option>
                  ))}
                </select>
              )}

              {eventType === 'VAR_REVIEW' ? (
                <select value={detail} onChange={(e) => setDetail(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', backgroundColor: '#222', color: '#fff' }}>
                  <option value="">Selecione o Motivo da Checagem do VAR</option>
                  <option value="Checagem de Golo / Toque de Mão">⚽ Possível Golo / Toque de Mão</option>
                  <option value="Checagem de Pênalti">⚪ Possível Pênalti</option>
                  <option value="Checagem de Cartão Vermelho">🟥 Possível Cartão Vermelho</option>
                  <option value="Checagem de Impedimento">🚩 Possível Impedimento</option>
                </select>
              ) : (
                <input type="text" placeholder="Detalhe Adicional (Opcional)" value={detail} onChange={(e) => setDetail(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', backgroundColor: '#222', color: '#fff' }} />
              )}

              <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#00ff88', color: '#000', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>Registrar Evento Oficial</button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}