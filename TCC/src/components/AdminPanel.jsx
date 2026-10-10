import React, { useState, useEffect } from 'react';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('matches'); // 'matches', 'teams', 'events'
  
  // Estados para dados recebidos da API
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedMatchId, setSelectedMatchId] = useState('');

  // Formulário: Atualizar Partida
  const [homeScore, setHomeScore] = useState(0);
  const [awayScore, setAwayScore] = useState(0);
  const [status, setStatus] = useState('EM_ANDAMENTO');
  const [isLive, setIsLive] = useState(true);

  // Formulário: Nova Equipa
  const [teamName, setTeamName] = useState('');
  const [teamCode, setTeamCode] = useState('');
  const [teamLogo, setTeamLogo] = useState('');

  // Formulário: Nova Partida
  const [phase, setPhase] = useState('Semifinal');
  const [homeTeamId, setHomeTeamId] = useState('');
  const [awayTeamId, setAwayTeamId] = useState('');

  // Formulário: Novo Evento
  const [eventType, setEventType] = useState('GOAL');
  const [minute, setMinute] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [eventDetail, setEventDetail] = useState('');

  // Carregar Partidas e Equipas da API
  const fetchData = async () => {
    try {
      const resMatches = await fetch('http://localhost:3000/matches');
      const dataMatches = await resMatches.json();
      if (Array.isArray(dataMatches)) setMatches(dataMatches);

      const resTeams = await fetch('http://localhost:3000/teams');
      const dataTeams = await resTeams.json();
      if (Array.isArray(dataTeams)) setTeams(dataTeams);
    } catch (err) {
      console.error('Erro ao carregar dados da API:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Selecionar partida e preencher formulário
  const handleSelectMatch = (e) => {
    const id = e.target.value;
    setSelectedMatchId(id);
    const match = matches.find((m) => m.id === Number(id));
    if (match) {
      setHomeScore(match.home_score || 0);
      setAwayScore(match.away_score || 0);
      setStatus(match.status || 'EM_ANDAMENTO');
      setIsLive(match.is_live ?? true);
    }
  };

  // 1. Atualizar Placar / Status da Partida
  const handleUpdateMatch = async (e) => {
    e.preventDefault();
    if (!selectedMatchId) return alert('Selecione uma partida!');

    try {
      const res = await fetch(`http://localhost:3000/matches/${selectedMatchId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          homeScore: Number(homeScore),
          awayScore: Number(awayScore),
          status,
          isLive,
        }),
      });

      if (res.ok) {
        alert('Partida atualizada com sucesso!');
        fetchData();
      } else {
        alert('Erro ao atualizar partida.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 2. Criar Nova Equipa
  const handleCreateTeam = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3000/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: teamName, code: teamCode, logoUrl: teamLogo }),
      });

      if (res.ok) {
        alert('Equipa cadastrada com sucesso!');
        setTeamName('');
        setTeamCode('');
        setTeamLogo('');
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 3. Criar Nova Partida
  const handleCreateMatch = async (e) => {
    e.preventDefault();
    if (!homeTeamId || !awayTeamId) return alert('Selecione as duas equipas!');

    try {
      const res = await fetch('http://localhost:3000/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phase,
          homeTeamId: Number(homeTeamId),
          awayTeamId: Number(awayTeamId),
        }),
      });

      if (res.ok) {
        alert('Partida criada com sucesso!');
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 4. Registrar Evento na Partida
  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (!selectedMatchId) return alert('Selecione uma partida!');

    try {
      const res = await fetch('http://localhost:3000/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matchId: Number(selectedMatchId),
          type: eventType,
          minute,
          playerName,
          detail: eventDetail,
        }),
      });

      if (res.ok) {
        alert('Evento cadastrado com sucesso!');
        setMinute('');
        setPlayerName('');
        setEventDetail('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', color: '#fff', fontFamily: 'sans-serif' }}>
      <h2 style={{ color: '#00ff88', textAlign: 'center' }}>Painel do Administrador</h2>

      {/* Navegação entre abas */}
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px' }}>
        <button
          onClick={() => setActiveTab('matches')}
          style={{
            padding: '10px 20px',
            borderRadius: '5px',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: activeTab === 'matches' ? '#00ff88' : '#222',
            color: activeTab === 'matches' ? '#000' : '#fff',
            fontWeight: 'bold',
          }}
        >
          Gerenciar Partidas
        </button>
        <button
          onClick={() => setActiveTab('teams')}
          style={{
            padding: '10px 20px',
            borderRadius: '5px',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: activeTab === 'teams' ? '#00ff88' : '#222',
            color: activeTab === 'teams' ? '#000' : '#fff',
            fontWeight: 'bold',
          }}
        >
          Cadastrar Equipas
        </button>
      </div>

      {/* Conteúdo Aba 1: Gerenciar Partidas */}
      {activeTab === 'matches' && (
        <div style={{ backgroundColor: '#111', padding: '20px', borderRadius: '10px', border: '1px solid #333' }}>
          <h3>Atualizar Resultado / Placar</h3>
          <form onSubmit={handleUpdateMatch}>
            <label>Selecione a Partida:</label>
            <select
              value={selectedMatchId}
              onChange={handleSelectMatch}
              style={{ width: '100%', padding: '10px', margin: '10px 0', borderRadius: '5px', backgroundColor: '#222', color: '#fff' }}
            >
              <option value="">-- Escolha uma partida --</option>
              {matches.map((m) => (
                <option key={m.id} value={m.id}>
                  #{m.id} - {m.phase} ({m.home_team_id} vs {m.away_team_id})
                </option>
              ))}
            </select>

            <div style={{ display: 'flex', gap: '20px', margin: '10px 0' }}>
              <div style={{ flex: 1 }}>
                <label>Gols Mandante:</label>
                <input
                  type="number"
                  value={homeScore}
                  onChange={(e) => setHomeScore(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '5px', backgroundColor: '#222', color: '#fff' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label>Gols Visitante:</label>
                <input
                  type="number"
                  value={awayScore}
                  onChange={(e) => setAwayScore(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '5px', backgroundColor: '#222', color: '#fff' }}
                />
              </div>
            </div>

            <label>Status:</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={{ width: '100%', padding: '10px', margin: '10px 0', borderRadius: '5px', backgroundColor: '#222', color: '#fff' }}
            >
              <option value="AGENDADO">AGENDADO</option>
              <option value="EM_ANDAMENTO">EM_ANDAMENTO</option>
              <option value="FINALIZADO">FINALIZADO</option>
            </select>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '12px',
                marginTop: '15px',
                backgroundColor: '#00ff88',
                border: 'none',
                borderRadius: '5px',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              Salvar Alterações do Placar
            </button>
          </form>

          <hr style={{ margin: '30px 0', borderColor: '#333' }} />

          {/* Adicionar Eventos */}
          <h3>Adicionar Evento da Partida (Golo, Cartão)</h3>
          <form onSubmit={handleAddEvent}>
            <div style={{ display: 'flex', gap: '10px', margin: '10px 0' }}>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                style={{ flex: 1, padding: '10px', borderRadius: '5px', backgroundColor: '#222', color: '#fff' }}
              >
                <option value="GOAL">Golo</option>
                <option value="YELLOW_CARD">Cartão Amarelo</option>
                <option value="RED_CARD">Cartão Vermelho</option>
              </select>
              <input
                type="text"
                placeholder="Minuto (ex: 45+2')"
                value={minute}
                onChange={(e) => setMinute(e.target.value)}
                style={{ flex: 1, padding: '10px', borderRadius: '5px', backgroundColor: '#222', color: '#fff' }}
              />
            </div>
            <input
              type="text"
              placeholder="Nome do Jogador"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', backgroundColor: '#222', color: '#fff' }}
            />
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#222',
                color: '#00ff88',
                border: '1px solid #00ff88',
                borderRadius: '5px',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              Registrar Evento
            </button>
          </form>
        </div>
      )}

      {/* Conteúdo Aba 2: Cadastrar Equipas e Criar Partida */}
      {activeTab === 'teams' && (
        <div style={{ backgroundColor: '#111', padding: '20px', borderRadius: '10px', border: '1px solid #333' }}>
          <h3>Cadastrar Nova Equipa</h3>
          <form onSubmit={handleCreateTeam}>
            <input
              type="text"
              placeholder="Nome da Equipa (ex: PSG)"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', backgroundColor: '#222', color: '#fff' }}
            />
            <input
              type="text"
              placeholder="Código/Sigla (ex: PSG)"
              value={teamCode}
              onChange={(e) => setTeamCode(e.target.value)}
              style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', backgroundColor: '#222', color: '#fff' }}
            />
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#00ff88',
                border: 'none',
                borderRadius: '5px',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              Cadastrar Equipa
            </button>
          </form>

          <hr style={{ margin: '30px 0', borderColor: '#333' }} />

          <h3>Criar Nova Partida</h3>
          <form onSubmit={handleCreateMatch}>
            <input
              type="text"
              placeholder="Fase (ex: Semifinal, Final)"
              value={phase}
              onChange={(e) => setPhase(e.target.value)}
              style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', backgroundColor: '#222', color: '#fff' }}
            />
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <select
                value={homeTeamId}
                onChange={(e) => setHomeTeamId(e.target.value)}
                style={{ flex: 1, padding: '10px', borderRadius: '5px', backgroundColor: '#222', color: '#fff' }}
              >
                <option value="">Time Mandante</option>
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
              <select
                value={awayTeamId}
                onChange={(e) => setAwayTeamId(e.target.value)}
                style={{ flex: 1, padding: '10px', borderRadius: '5px', backgroundColor: '#222', color: '#fff' }}
              >
                <option value="">Time Visitante</option>
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#00ff88',
                border: 'none',
                borderRadius: '5px',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              Criar Partida
            </button>
          </form>
        </div>
      )}
    </div>
  );
}