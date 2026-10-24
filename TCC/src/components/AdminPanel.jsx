import React, { useState, useEffect } from 'react';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('tournaments');
  const [tournaments, setTournaments] = useState([]);
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);

  // Form Torneio
  const [tournamentName, setTournamentName] = useState('');
  const [tournamentType, setTournamentType] = useState('PONTOS_CORRIDOS');
  const [selectedTeamIds, setSelectedTeamIds] = useState([]);

  // Form Time & Elenco
  const [teamName, setTeamName] = useState('');
  const [teamCode, setTeamCode] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [playersList, setPlayersList] = useState([
    { fullName: '', email: '', number: '', position: 'MC', photoUrl: '' }
  ]);

  // Form Partida
  const [selectedTournamentId, setSelectedTournamentId] = useState('');
  const [phase, setPhase] = useState('1ª Rodada');
  const [homeTeamId, setHomeTeamId] = useState('');
  const [awayTeamId, setAwayTeamId] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [hasExtraTime, setHasExtraTime] = useState(false);

  // Mesa de Eventos & VAR
  const [selectedMatchId, setSelectedMatchId] = useState('');
  const [eventType, setEventType] = useState('GOAL');
  const [eventTeamId, setEventTeamId] = useState('');
  const [teamPlayers, setTeamPlayers] = useState([]);
  const [minute, setMinute] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [playerOutName, setPlayerOutName] = useState('');

  const fetchData = async () => {
    try {
      const [resT, resTeams, resM] = await Promise.all([
        fetch('http://localhost:3000/tournaments'),
        fetch('http://localhost:3000/teams'),
        fetch('http://localhost:3000/matches')
      ]);
      setTournaments(await resT.json());
      setTeams(await resTeams.json());
      setMatches(await resM.json());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    if (!eventTeamId) return setTeamPlayers([]);
    fetch(`http://localhost:3000/teams/${eventTeamId}/players`)
      .then((res) => res.json())
      .then((data) => setTeamPlayers(Array.isArray(data) ? data : []));
  }, [eventTeamId]);

  const handleCreateTournament = async (e) => {
    e.preventDefault();
    if (!tournamentName) return alert('Digite o nome do torneio!');

    await fetch('http://localhost:3000/tournaments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: tournamentName, type: tournamentType, teamIds: selectedTeamIds }),
    });

    alert('🏆 Torneio criado!');
    setTournamentName(''); setSelectedTeamIds([]);
    fetchData();
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    if (!teamName || !teamCode) return alert('Preencha o nome e sigla!');

    await fetch('http://localhost:3000/teams', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: teamName, code: teamCode, logoUrl, squad: playersList }),
    });

    alert('👕 Time e Elenco cadastrados!');
    setTeamName(''); setTeamCode(''); setLogoUrl('');
    setPlayersList([{ fullName: '', email: '', number: '', position: 'MC', photoUrl: '' }]);
    fetchData();
  };

  const handleDeleteTeam = async (id, name) => {
    if (!window.confirm(`Apagar o time "${name}"?`)) return;
    await fetch(`http://localhost:3000/teams/${id}`, { method: 'DELETE' });
    fetchData();
  };

  const handleCreateMatch = async (e) => {
    e.preventDefault();
    if (!selectedTournamentId || !homeTeamId || !awayTeamId || !scheduledAt) {
      return alert('Preencha todos os campos do jogo!');
    }

    await fetch('http://localhost:3000/matches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tournamentId: selectedTournamentId, phase, homeTeamId, awayTeamId, scheduledAt, hasExtraTime }),
    });

    alert('⚽ Jogo Agendado!');
    setScheduledAt('');
    fetchData();
  };

  const handleUpdateClock = async (newStatus) => {
    await fetch(`http://localhost:3000/matches/${selectedMatchId}/clock`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
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
      }),
    });

    alert('⚡ Evento/VAR registrado com sucesso!');
    setMinute(''); setPlayerName(''); setPlayerOutName('');
    fetchData();
  };

  const currentMatch = matches.find((m) => m.id === Number(selectedMatchId));
  const getTeamName = (id) => teams.find((t) => t.id === Number(id))?.name || `Time #${id}`;

  return (
    <div style={{ maxWidth: '900px', margin: '2rem auto', color: '#fff', fontFamily: 'sans-serif', padding: '0 1rem' }}>
      <h2 style={{ color: '#00ff88', textAlign: 'center', marginBottom: '20px' }}>Painel Administrativo</h2>

      {/* Abas */}
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
        <button onClick={() => setActiveTab('tournaments')} style={{ padding: '10px 15px', borderRadius: '5px', backgroundColor: activeTab === 'tournaments' ? '#00ff88' : '#222', color: activeTab === 'tournaments' ? '#000' : '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>🏆 Torneios</button>
        <button onClick={() => setActiveTab('teams')} style={{ padding: '10px 15px', borderRadius: '5px', backgroundColor: activeTab === 'teams' ? '#00ff88' : '#222', color: activeTab === 'teams' ? '#000' : '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>👕 Elencos</button>
        <button onClick={() => setActiveTab('matches')} style={{ padding: '10px 15px', borderRadius: '5px', backgroundColor: activeTab === 'matches' ? '#00ff88' : '#222', color: activeTab === 'matches' ? '#000' : '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>🎮 Programar Jogos</button>
        <button onClick={() => setActiveTab('events')} style={{ padding: '10px 15px', borderRadius: '5px', backgroundColor: activeTab === 'events' ? '#00ff88' : '#222', color: activeTab === 'events' ? '#000' : '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>⚡ Mesa & VAR</button>
      </div>

      {/* 1. TORNEIOS */}
      {activeTab === 'tournaments' && (
        <div style={{ backgroundColor: '#111', padding: '20px', borderRadius: '10px', border: '1px solid #333' }}>
          <h3>Criar Torneio e Vincular Times</h3>
          <form onSubmit={handleCreateTournament} style={{ marginBottom: '25px' }}>
            <input type="text" placeholder="Nome do Torneio" value={tournamentName} onChange={(e) => setTournamentName(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px', backgroundColor: '#222', color: '#fff', border: '1px solid #444', borderRadius: '4px' }} />
            <select value={tournamentType} onChange={(e) => setTournamentType(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '15px', backgroundColor: '#222', color: '#fff', border: '1px solid #444', borderRadius: '4px' }}>
              <option value="PONTOS_CORRIDOS">📊 Pontos Corridos</option>
              <option value="MATA_MATA">⚔️ Mata-MATA</option>
              <option value="GRUPOS">🛡️ Grupos + Mata-Mata</option>
            </select>

            <h4 style={{ color: '#00ff88', marginBottom: '8px' }}>Selecione os Times Participantes:</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', maxHeight: '150px', overflowY: 'auto', marginBottom: '15px', backgroundColor: '#181818', padding: '10px', borderRadius: '5px' }}>
              {teams.map((t) => (
                <label key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={selectedTeamIds.includes(t.id)}
                    onChange={(e) => {
                      if (e.target.checked) setSelectedTeamIds([...selectedTeamIds, t.id]);
                      else setSelectedTeamIds(selectedTeamIds.filter(id => id !== t.id));
                    }}
                  />
                  {t.name}
                </label>
              ))}
            </div>

            <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#00ff88', color: '#000', fontWeight: 'bold', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>Criar Torneio</button>
          </form>
        </div>
      )}

      {/* 2. ELENCOS COM FOTO DO ATLETA RESTAURADA */}
      {activeTab === 'teams' && (
        <div style={{ backgroundColor: '#111', padding: '20px', borderRadius: '10px', border: '1px solid #333' }}>
          <h3>Cadastrar Time & Elenco</h3>
          <form onSubmit={handleCreateTeam}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 2fr', gap: '10px', marginBottom: '15px' }}>
              <input type="text" placeholder="Nome do Time" value={teamName} onChange={(e) => setTeamName(e.target.value)} style={{ padding: '10px', backgroundColor: '#222', color: '#fff', border: '1px solid #444', borderRadius: '4px' }} />
              <input type="text" placeholder="Sigla" value={teamCode} onChange={(e) => setTeamCode(e.target.value)} style={{ padding: '10px', backgroundColor: '#222', color: '#fff', border: '1px solid #444', borderRadius: '4px' }} />
              <input type="text" placeholder="URL Escudo do Time" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} style={{ padding: '10px', backgroundColor: '#222', color: '#fff', border: '1px solid #444', borderRadius: '4px' }} />
            </div>

            <h4 style={{ color: '#00ff88', marginBottom: '10px' }}>Jogadores do Elenco:</h4>
            {playersList.map((p, idx) => (
              <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 2fr', gap: '8px', marginBottom: '8px', backgroundColor: '#1a1a1a', padding: '8px', borderRadius: '4px' }}>
                <input type="text" placeholder="Nome Jogador" value={p.fullName} onChange={(e) => { const u = [...playersList]; u[idx].fullName = e.target.value; setPlayersList(u); }} style={{ padding: '6px', backgroundColor: '#222', color: '#fff', border: '1px solid #333' }} />
                <input type="email" placeholder="E-mail" value={p.email} onChange={(e) => { const u = [...playersList]; u[idx].email = e.target.value; setPlayersList(u); }} style={{ padding: '6px', backgroundColor: '#222', color: '#fff', border: '1px solid #333' }} />
                <input type="number" placeholder="Nº" value={p.number} onChange={(e) => { const u = [...playersList]; u[idx].number = e.target.value; setPlayersList(u); }} style={{ padding: '6px', backgroundColor: '#222', color: '#fff', border: '1px solid #333' }} />
                <select value={p.position} onChange={(e) => { const u = [...playersList]; u[idx].position = e.target.value; setPlayersList(u); }} style={{ padding: '6px', backgroundColor: '#222', color: '#fff', border: '1px solid #333' }}>
                  <option value="GOL">GOL</option><option value="LD">LD</option><option value="ZAG">ZAG</option><option value="LE">LE</option><option value="VOL">VOL</option><option value="MC">MC</option><option value="ATA">ATA</option>
                </select>
                <input type="text" placeholder="URL Foto Jogador" value={p.photoUrl} onChange={(e) => { const u = [...playersList]; u[idx].photoUrl = e.target.value; setPlayersList(u); }} style={{ padding: '6px', backgroundColor: '#222', color: '#fff', border: '1px solid #333' }} />
              </div>
            ))}

            <button type="button" onClick={() => setPlayersList([...playersList, { fullName: '', email: '', number: '', position: 'MC', photoUrl: '' }])} style={{ padding: '6px 12px', backgroundColor: '#333', color: '#00ff88', border: '1px solid #00ff88', marginBottom: '15px', cursor: 'pointer', borderRadius: '4px' }}>+ Adicionar Jogador</button>
            <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#00ff88', color: '#000', fontWeight: 'bold', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>Salvar Time</button>
          </form>

          <div style={{ marginTop: '20px', borderTop: '1px solid #333', paddingTop: '15px' }}>
            <h4 style={{ color: '#00ff88' }}>Times Cadastrados:</h4>
            {teams.map(t => (
              <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1a1a1a', padding: '8px 12px', marginBottom: '6px', borderRadius: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {t.logoUrl && <img src={t.logoUrl} alt={t.name} style={{ width: '24px', height: '24px', borderRadius: '50%' }} />}
                  <span>{t.name} ({t.code})</span>
                </div>
                <button onClick={() => handleDeleteTeam(t.id, t.name)} style={{ backgroundColor: '#ff3333', color: '#fff', border: 'none', padding: '4px 8px', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold' }}>Excluir</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. PROGRAMAR JOGOS */}
      {activeTab === 'matches' && (
        <div style={{ backgroundColor: '#111', padding: '20px', borderRadius: '10px', border: '1px solid #333' }}>
          <h3>Programar Jogo no Torneio</h3>
          <form onSubmit={handleCreateMatch}>
            <select value={selectedTournamentId} onChange={(e) => setSelectedTournamentId(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px', backgroundColor: '#222', color: '#fff', border: '1px solid #444', borderRadius: '4px' }}>
              <option value="">Selecione o Torneio</option>
              {tournaments.map(t => <option key={t.id} value={t.id}>🏆 {t.name}</option>)}
            </select>
            <input type="text" placeholder="Fase (Ex: 1ª Rodada, Oitavas)" value={phase} onChange={(e) => setPhase(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px', backgroundColor: '#222', color: '#fff', border: '1px solid #444', borderRadius: '4px' }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
              <select value={homeTeamId} onChange={(e) => setHomeTeamId(e.target.value)} style={{ padding: '10px', backgroundColor: '#222', color: '#fff', border: '1px solid #444', borderRadius: '4px' }}>
                <option value="">Mandante</option>
                {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
              <select value={awayTeamId} onChange={(e) => setAwayTeamId(e.target.value)} style={{ padding: '10px', backgroundColor: '#222', color: '#fff', border: '1px solid #444', borderRadius: '4px' }}>
                <option value="">Visitante</option>
                {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '15px', backgroundColor: '#222', color: '#fff', border: '1px solid #444', borderRadius: '4px' }} />
            <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#00ff88', color: '#000', fontWeight: 'bold', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>Agendar Partida</button>
          </form>
        </div>
      )}

      {/* 4. MESA DE ARBITRAGEM & VAR COMPLETO */}
      {activeTab === 'events' && (
        <div style={{ backgroundColor: '#111', padding: '20px', borderRadius: '10px', border: '1px solid #333' }}>
          <h3>Mesa de Arbitragem & Controle do VAR</h3>
          <select value={selectedMatchId} onChange={(e) => setSelectedMatchId(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '15px', backgroundColor: '#222', color: '#fff', border: '1px solid #444', borderRadius: '4px' }}>
            <option value="">-- Selecione o Jogo em Andamento --</option>
            {matches.map(m => <option key={m.id} value={m.id}>Jogo #{m.id} - Status: {m.status}</option>)}
          </select>
          {/* Aba Mesa & VAR */}
          {activeTab === 'events' && (
            <div style={{ backgroundColor: '#111', padding: '20px', borderRadius: '10px', border: '1px solid #333' }}>
              <h3>Mesa de Arbitragem & Controle do VAR</h3>
              <select
                value={selectedMatchId}
                onChange={(e) => setSelectedMatchId(e.target.value)}
                style={{ width: '100%', padding: '10px', marginBottom: '15px', backgroundColor: '#222', color: '#fff', border: '1px solid #444', borderRadius: '4px' }}
              >
                <option value="">-- Selecione a Partida --</option>
                {matches.map(m => (
                  <option key={m.id} value={m.id}>
                    Jogo #{m.id} - {m.hasExtraTime ? '120 min (Prorrogação)' : '90 min'} ({m.status})
                  </option>
                ))}
              </select>

              {currentMatch && (
                <div>
                  <div style={{ backgroundColor: '#1a1a1a', padding: '10px 15px', borderRadius: '6px', marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#00ff88', fontWeight: 'bold' }}>
                      Tempo Máximo Regulamentar: {currentMatch.hasExtraTime ? "120'" : "90'"}
                    </span>
                    <span style={{ fontSize: '0.85rem', color: '#aaa' }}>
                      Acréscimos atuais: +{currentMatch.addedMinutes || 0}'
                    </span>
                  </div>

                  <form onSubmit={handleAddEvent}>
                    <h4 style={{ color: '#00ff88', marginBottom: '8px' }}>Lançar Evento / Decisão:</h4>

                    <select value={eventType} onChange={(e) => setEventType(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px', backgroundColor: '#222', color: '#fff', border: '1px solid #444', borderRadius: '4px' }}>
                      <option value="GOAL">⚽ Golo (Soma +1)</option>
                      <option value="PENALTY_GOAL">⚪ Golo de Pênalti (Soma +1)</option>
                      <option value="OWN_GOAL">🤡 Golo Contra (Soma Adversário)</option>
                      <option value="VAR_REVIEW">🖥️ VAR em Revisão</option>
                      <option value="VAR_CANCEL">❌ Golo Anulado pelo VAR (Subtrai -1)</option>
                      <option value="YELLOW_CARD">🟨 Cartão Amarelo</option>
                      <option value="RED_CARD">🟥 Cartão Vermelho</option>
                      <option value="SUBSTITUTION">🔄 Substituição</option>
                    </select>

                    <input
                      type="number"
                      placeholder={`Minuto (Máx: ${(currentMatch.hasExtraTime ? 120 : 90) + (currentMatch.addedMinutes || 0)}')`}
                      value={minute}
                      onChange={(e) => setMinute(e.target.value)}
                      style={{ width: '100%', padding: '10px', marginBottom: '10px', backgroundColor: '#222', color: '#fff', border: '1px solid #444', borderRadius: '4px' }}
                    />

                    <select value={eventTeamId} onChange={(e) => setEventTeamId(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px', backgroundColor: '#222', color: '#fff', border: '1px solid #444', borderRadius: '4px' }}>
                      <option value="">Selecione o Time Envolvido</option>
                      <option value={currentMatch.homeTeamId}>{getTeamName(currentMatch.homeTeamId)}</option>
                      <option value={currentMatch.awayTeamId}>{getTeamName(currentMatch.awayTeamId)}</option>
                    </select>

                    <select value={playerName} onChange={(e) => setPlayerName(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '15px', backgroundColor: '#222', color: '#fff', border: '1px solid #444', borderRadius: '4px' }}>
                      <option value="">Atleta Envolvido / Entra</option>
                      {teamPlayers.map(p => <option key={p.id} value={p.fullName}>#{p.number} - {p.fullName}</option>)}
                    </select>

                    <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#00ff88', color: '#000', fontWeight: 'bold', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>
                      Lançar Evento Direto
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
          {currentMatch?.status === 'ENCERRADO' && (
            <button
              onClick={() => handleUpdateClock('EM_ANDAMENTO')}
              style={{ padding: '8px 12px', backgroundColor: '#ffbb00', color: '#000', border: 'none', fontWeight: 'bold', cursor: 'pointer', borderRadius: '4px', marginTop: '10px' }}
            >
              ⚠️ Reabrir / Alterar após fim
            </button>
          )}
          {currentMatch && (
            <div>
              {/* Apito & Cronômetro */}
              <div style={{ backgroundColor: '#222', padding: '12px', borderRadius: '6px', marginBottom: '15px' }}>
                <h4 style={{ color: '#00ff88', margin: '0 0 10px 0' }}>Cronômetro da Partida:</h4>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button onClick={() => handleUpdateClock('EM_ANDAMENTO')} style={{ padding: '6px 12px', backgroundColor: '#00ff88', color: '#000', border: 'none', fontWeight: 'bold', cursor: 'pointer', borderRadius: '4px' }}>▶️ Iniciar / Retomar</button>
                  <button onClick={() => handleUpdateClock('PARALISADO')} style={{ padding: '6px 12px', backgroundColor: '#ffbb00', color: '#000', border: 'none', fontWeight: 'bold', cursor: 'pointer', borderRadius: '4px' }}>⏸️ Paralisar Jogo</button>
                  <button onClick={() => handleUpdateClock('INTERVALO')} style={{ padding: '6px 12px', backgroundColor: '#888', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>☕ Intervalo</button>
                  <button onClick={() => handleUpdateClock('ENCERRADO')} style={{ padding: '6px 12px', backgroundColor: '#ff3333', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer', borderRadius: '4px' }}>🏁 Apito Final</button>
                </div>
              </div>

              {/* Lançamento de Eventos e Decisões de VAR */}
              <form onSubmit={handleAddEvent}>
                <h4 style={{ color: '#00ff88', marginBottom: '8px' }}>Lançar Evento ou Decisão do VAR:</h4>
                <select value={eventType} onChange={(e) => setEventType(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px', backgroundColor: '#222', color: '#fff', border: '1px solid #444', borderRadius: '4px' }}>
                  <option value="GOAL">⚽ Golo (Soma +1)</option>
                  <option value="PENALTY_GOAL">⚪ Golo de Pênalti (Soma +1)</option>
                  <option value="OWN_GOAL">🤡 Golo Contra (Soma Adversário)</option>
                  <option value="VAR_REVIEW">🖥️ VAR em Revisão</option>
                  <option value="VAR_CANCEL">❌ Golo Anulado pelo VAR (Subtrai -1)</option>
                  <option value="YELLOW_CARD">🟨 Cartão Amarelo</option>
                  <option value="RED_CARD">🟥 Cartão Vermelho</option>
                  <option value="SUBSTITUTION">🔄 Substituição</option>
                </select>

                <input type="text" placeholder="Minuto do Jogo (ex: 45')" value={minute} onChange={(e) => setMinute(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px', backgroundColor: '#222', color: '#fff', border: '1px solid #444', borderRadius: '4px' }} />

                <select value={eventTeamId} onChange={(e) => setEventTeamId(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px', backgroundColor: '#222', color: '#fff', border: '1px solid #444', borderRadius: '4px' }}>
                  <option value="">Selecione o Time Envolvido</option>
                  <option value={currentMatch.homeTeamId}>{getTeamName(currentMatch.homeTeamId)}</option>
                  <option value={currentMatch.awayTeamId}>{getTeamName(currentMatch.awayTeamId)}</option>
                </select>

                <select value={playerName} onChange={(e) => setPlayerName(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '15px', backgroundColor: '#222', color: '#fff', border: '1px solid #444', borderRadius: '4px' }}>
                  <option value="">Atleta Envolvido / Entra</option>
                  {teamPlayers.map(p => <option key={p.id} value={p.fullName}>#{p.number} - {p.fullName}</option>)}
                </select>

                {eventType === 'SUBSTITUTION' && (
                  <select value={playerOutName} onChange={(e) => setPlayerOutName(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '15px', backgroundColor: '#222', color: '#fff', border: '1px solid #444', borderRadius: '4px' }}>
                    <option value="">Atleta que Sai</option>
                    {teamPlayers.map(p => <option key={p.id} value={p.fullName}>#{p.number} - {p.fullName}</option>)}
                  </select>
                )}

                <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#00ff88', color: '#000', fontWeight: 'bold', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>Lançar no Sistema</button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}