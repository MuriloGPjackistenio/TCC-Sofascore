import React, { useState, useEffect } from 'react';
import { API_URL } from '../api';

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
  const [expelledPlayers, setExpelledPlayers] = useState([]);
  const [matchEventsList, setMatchEventsList] = useState([]);
  const [minute, setMinute] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [playerOutName, setPlayerOutName] = useState('');
  const [addedMinutesInput, setAddedMinutesInput] = useState('');

  // Disputa de Pênaltis
  const [penalties, setPenalties] = useState([]);
  const [penaltyTeamId, setPenaltyTeamId] = useState('');
  const [penaltyPlayerName, setPenaltyPlayerName] = useState('');
  const [penaltyScored, setPenaltyScored] = useState(true);
  const [penaltyPlayersList, setPenaltyPlayersList] = useState([]);
  const [penHome, setPenHome] = useState('');
  const [penAway, setPenAway] = useState('');

  const fetchData = async () => {
    try {
      const [resT, resTeams, resM] = await Promise.all([
        fetch(`${API_URL}/tournaments`),
        fetch(`${API_URL}/teams`),
        fetch(`${API_URL}/matches`)
      ]);
      setTournaments(await resT.json());
      setTeams(await resTeams.json());
      setMatches(await resM.json());
    } catch (err) {
      console.error('Erro ao buscar dados:', err);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const fetchMatchEvents = async () => {
    if (!selectedMatchId) {
      setMatchEventsList([]);
      setExpelledPlayers([]);
      return;
    }
    try {
      const [resEv, resExp] = await Promise.all([
        fetch(`${API_URL}/matches/${selectedMatchId}/events`),
        fetch(`${API_URL}/matches/${selectedMatchId}/expelled-players`)
      ]);
      setMatchEventsList(await resEv.json());
      setExpelledPlayers(await resExp.json());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMatchEvents();
  }, [selectedMatchId]);

  useEffect(() => {
    if (!eventTeamId) return setTeamPlayers([]);
    fetch(`${API_URL}/teams/${eventTeamId}/players`)
      .then((res) => res.json())
      .then((data) => setTeamPlayers(Array.isArray(data) ? data : []));
  }, [eventTeamId]);

  useEffect(() => {
    if (!penaltyTeamId) return setPenaltyPlayersList([]);
    fetch(`${API_URL}/teams/${penaltyTeamId}/players`)
      .then((res) => res.json())
      .then((data) => setPenaltyPlayersList(Array.isArray(data) ? data : []));
  }, [penaltyTeamId]);

  const handleCreateTournament = async (e) => {
    e.preventDefault();
    if (!tournamentName) return alert('Digite o nome do torneio!');

    await fetch(`${API_URL}/tournaments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: tournamentName, type: tournamentType, teamIds: selectedTeamIds }),
    });

    alert('🏆 Torneio criado!');
    setTournamentName(''); setSelectedTeamIds([]);
    fetchData();
  };

  const handleDeleteTournament = async (id, name) => {
    if (!window.confirm(`Deseja apagar o torneio "${name}"?`)) return;
    await fetch(`${API_URL}/tournaments/${id}`, { method: 'DELETE' });
    alert('🗑️ Torneio apagado!');
    fetchData();
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    if (!teamName || !teamCode) return alert('Preencha o nome e a sigla do time!');

    await fetch(`${API_URL}/teams`, {
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
    await fetch(`${API_URL}/teams/${id}`, { method: 'DELETE' });
    fetchData();
  };

  const handleCreateMatch = async (e) => {
    e.preventDefault();
    if (!selectedTournamentId || !homeTeamId || !awayTeamId || !scheduledAt) {
      return alert('Preencha todos os campos da partida!');
    }

    await fetch(`${API_URL}/matches`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tournamentId: selectedTournamentId, phase, homeTeamId, awayTeamId, scheduledAt, hasExtraTime }),
    });

    alert('⚽ Jogo Agendado!');
    setScheduledAt('');
    fetchData();
  };

  const handleUpdateClock = async (newStatus) => {
    await fetch(`${API_URL}/matches/${selectedMatchId}/clock`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    fetchData();
  };

  const handleSetAddedMinutes = async (e) => {
    e.preventDefault();
    if (!selectedMatchId) return alert('Selecione uma partida primeiro!');

    await fetch(`${API_URL}/matches/${selectedMatchId}/clock`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ addedMinutes: Number(addedMinutesInput || 0) }),
    });

    alert(`⏱️ Acréscimo de +${addedMinutesInput || 0}' definido!`);
    setAddedMinutesInput('');
    fetchData();
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (!selectedMatchId || !eventTeamId) return alert('Selecione a partida e o time!');

    const typesRequiringPlayer = ['GOAL', 'PENALTY_GOAL', 'YELLOW_CARD', 'RED_CARD', 'SUBSTITUTION'];
    if (typesRequiringPlayer.includes(eventType) && !playerName) {
      return alert('⚠️ Selecione um atleta obrigatório para esta ação!');
    }

    if (eventType === 'SUBSTITUTION' && !playerOutName) {
      return alert('⚠️ Selecione o atleta que vai sair de campo!');
    }

    const res = await fetch(`${API_URL}/events`, {
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

    if (!res.ok) {
      const errData = await res.json();
      return alert(`Erro: ${errData.error}`);
    }

    alert('⚡ Evento registrado com sucesso!');
    setMinute(''); setPlayerName(''); setPlayerOutName('');
    fetchMatchEvents();
    fetchData();
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Deseja realmente remover este evento da partida?')) return;

    const res = await fetch(`${API_URL}/events/${eventId}`, {
      method: 'DELETE'
    });

    if (res.ok) {
      alert('🗑️ Evento removido com sucesso!');
      fetchMatchEvents();
      fetchData();
    } else {
      alert('Erro ao remover evento.');
    }
  };

  const currentMatch = matches.find((m) => m.id === Number(selectedMatchId));
  const getTeamName = (id) => teams.find((t) => t.id === Number(id))?.name || `Time #${id}`;
  const availablePlayers = teamPlayers.filter(p => !expelledPlayers.includes(p.fullName));

  return (
    <div style={{ maxWidth: '900px', margin: '2rem auto', color: '#fff', fontFamily: 'sans-serif', padding: '0 1rem' }}>
      <h2 style={{ color: '#00ff88', textAlign: 'center', marginBottom: '20px' }}>Painel Administrativo</h2>

      {/* Navegação por Abas */}
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
        <button onClick={() => setActiveTab('tournaments')} style={{ padding: '10px 15px', borderRadius: '5px', backgroundColor: activeTab === 'tournaments' ? '#00ff88' : '#222', color: activeTab === 'tournaments' ? '#000' : '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>🏆 Torneios</button>
        <button onClick={() => setActiveTab('teams')} style={{ padding: '10px 15px', borderRadius: '5px', backgroundColor: activeTab === 'teams' ? '#00ff88' : '#222', color: activeTab === 'teams' ? '#000' : '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>👕 Elencos</button>
        <button onClick={() => setActiveTab('matches')} style={{ padding: '10px 15px', borderRadius: '5px', backgroundColor: activeTab === 'matches' ? '#00ff88' : '#222', color: activeTab === 'matches' ? '#000' : '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>🎮 Programar Jogos</button>
        <button onClick={() => setActiveTab('events')} style={{ padding: '10px 15px', borderRadius: '5px', backgroundColor: activeTab === 'events' ? '#00ff88' : '#222', color: activeTab === 'events' ? '#000' : '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>⚡ Mesa & VAR</button>
      </div>

      {/* 1. ABA TORNEIOS */}
      {activeTab === 'tournaments' && (
        <div style={{ backgroundColor: '#111', padding: '20px', borderRadius: '10px', border: '1px solid #333' }}>
          <h3>Criar Torneio e Vincular Times</h3>
          <form onSubmit={handleCreateTournament} style={{ marginBottom: '25px' }}>
            <input type="text" placeholder="Nome do Torneio" value={tournamentName} onChange={(e) => setTournamentName(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px', backgroundColor: '#222', color: '#fff', border: '1px solid #444', borderRadius: '4px' }} />
            <select value={tournamentType} onChange={(e) => setTournamentType(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '15px', backgroundColor: '#222', color: '#fff', border: '1px solid #444', borderRadius: '4px' }}>
              <option value="PONTOS_CORRIDOS">📊 Pontos Corridos</option>
              <option value="MATA_MATA">⚔️ Mata-Mata</option>
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

          <div style={{ marginTop: '20px', borderTop: '1px solid #333', paddingTop: '15px' }}>
            <h4 style={{ color: '#00ff88' }}>Torneios Existentes:</h4>
            {tournaments.map(t => (
              <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1a1a1a', padding: '10px 12px', marginBottom: '6px', borderRadius: '4px' }}>
                <div>
                  <strong>🏆 {t.name}</strong> <span style={{ fontSize: '0.8rem', color: '#888' }}>({t.type})</span>
                </div>
                <button onClick={() => handleDeleteTournament(t.id, t.name)} style={{ backgroundColor: '#ff3333', color: '#fff', border: 'none', padding: '4px 8px', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.8rem' }}>Excluir</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. ABA ELENCOS */}
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

      {/* 3. ABA PROGRAMAR JOGOS */}
      {activeTab === 'matches' && (
        <div style={{ backgroundColor: '#111', padding: '20px', borderRadius: '10px', border: '1px solid #333' }}>
          <h3>Programar Jogo no Torneio</h3>
          <form onSubmit={handleCreateMatch}>
            <select value={selectedTournamentId} onChange={(e) => setSelectedTournamentId(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px', backgroundColor: '#222', color: '#fff', border: '1px solid #444', borderRadius: '4px' }}>
              <option value="">Selecione o Torneio</option>
              {tournaments.map(t => <option key={t.id} value={t.id}>🏆 {t.name} ({t.type})</option>)}
            </select>
            <input type="text" placeholder="Fase (Ex: 1ª Rodada, Oitavas, Final)" value={phase} onChange={(e) => setPhase(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px', backgroundColor: '#222', color: '#fff', border: '1px solid #444', borderRadius: '4px' }} />
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
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px', marginBottom: '15px' }}>
              <input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} style={{ padding: '10px', backgroundColor: '#222', color: '#fff', border: '1px solid #444', borderRadius: '4px' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="checkbox" id="extraTime" checked={hasExtraTime} onChange={(e) => setHasExtraTime(e.target.checked)} />
                <label htmlFor="extraTime" style={{ fontSize: '0.85rem' }}>Prorrogação (120')?</label>
              </div>
            </div>
            <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#00ff88', color: '#000', fontWeight: 'bold', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>Agendar Partida</button>
          </form>
        </div>
      )}

      {/* 4. ABA MESA DE ARBITRAGEM, CRONÔMETRO, ACRÉSCIMOS & EVENTOS */}
      {activeTab === 'events' && (
        <div style={{ backgroundColor: '#111', padding: '20px', borderRadius: '10px', border: '1px solid #333' }}>
          <h3>Mesa de Arbitragem & Controle do Jogo</h3>
          
          <select 
            value={selectedMatchId} 
            onChange={(e) => setSelectedMatchId(e.target.value)} 
            style={{ width: '100%', padding: '10px', marginBottom: '15px', backgroundColor: '#222', color: '#fff', border: '1px solid #444', borderRadius: '4px' }}
          >
            <option value="">-- Selecione a Partida --</option>
            {matches.map(m => (
              <option key={m.id} value={m.id}>
                Jogo #{m.id} - {m.phase} - {m.hasExtraTime ? "120' (Prorrogação)" : "90'"} ({m.status})
              </option>
            ))}
          </select>

          {currentMatch && (
            <div>
              {/* Regulamento & Status */}
              <div style={{ backgroundColor: '#1a1a1a', padding: '10px 15px', borderRadius: '6px', marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#00ff88', fontWeight: 'bold' }}>
                  Regulamento: {currentMatch.hasExtraTime ? "120' (Prorrogação)" : "90' Regulamentares"}
                </span>
                <span style={{ fontSize: '0.85rem', color: '#aaa' }}>
                  Acréscimos atuais: +{currentMatch.addedMinutes || 0}'
                </span>
              </div>

              {/* CONTROLE DO CRONÔMETRO */}
              <div style={{ backgroundColor: '#222', padding: '12px', borderRadius: '6px', marginBottom: '15px' }}>
                <h4 style={{ color: '#00ff88', margin: '0 0 10px 0' }}>Controle do Cronômetro:</h4>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button onClick={() => handleUpdateClock('EM_ANDAMENTO')} style={{ padding: '6px 12px', backgroundColor: '#00ff88', color: '#000', border: 'none', fontWeight: 'bold', cursor: 'pointer', borderRadius: '4px' }}>▶️ Iniciar / Retomar</button>
                  <button onClick={() => handleUpdateClock('PARALISADO')} style={{ padding: '6px 12px', backgroundColor: '#ffbb00', color: '#000', border: 'none', fontWeight: 'bold', cursor: 'pointer', borderRadius: '4px' }}>⏸️ Paralisar</button>
                  <button onClick={() => handleUpdateClock('INTERVALO')} style={{ padding: '6px 12px', backgroundColor: '#888', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>☕ Intervalo</button>
                  <button onClick={() => handleUpdateClock('ENCERRADO')} style={{ padding: '6px 12px', backgroundColor: '#ff3333', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer', borderRadius: '4px' }}>🏁 Apito Final</button>
                </div>
              </div>

              {/* FORM DE ACRÉSCIMOS */}
              <form onSubmit={handleSetAddedMinutes} style={{ backgroundColor: '#1f1f1f', padding: '12px', borderRadius: '6px', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid #333' }}>
                <span style={{ color: '#00ff88', fontWeight: 'bold', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
                  ➕ Adicionar Acréscimos:
                </span>
                <input 
                  type="number" 
                  placeholder="Ex: 5 (para +5')" 
                  value={addedMinutesInput} 
                  onChange={(e) => setAddedMinutesInput(e.target.value)} 
                  style={{ padding: '8px', backgroundColor: '#222', color: '#fff', border: '1px solid #444', borderRadius: '4px', width: '130px' }} 
                />
                <button 
                  type="submit" 
                  style={{ padding: '8px 15px', backgroundColor: '#00ff88', color: '#000', fontWeight: 'bold', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Confirmar Tempo Extra
                </button>
              </form>

              {/* LANÇAMENTO DE EVENTOS */}
              <form onSubmit={handleAddEvent} style={{ marginBottom: '25px', borderBottom: '1px solid #333', paddingBottom: '20px' }}>
                <h4 style={{ color: '#00ff88', marginBottom: '8px' }}>Lançar Evento de Jogo:</h4>
                <select value={eventType} onChange={(e) => setEventType(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px', backgroundColor: '#222', color: '#fff', border: '1px solid #444', borderRadius: '4px' }}>
                  <option value="GOAL">⚽ Gol (Soma +1)</option>
                  <option value="PENALTY_GOAL">⚪ Gol de Pênalti (Gol +1)</option>
                  <option value="OWN_GOAL">🤡 Gol Contra (Soma no outro time)</option>
                  <option value="VAR_REVIEW">🖥️ VAR em Revisão</option>
                  <option value="VAR_CANCEL">❌ Golo Anulado pelo VAR (Tira -1)</option>
                  <option value="YELLOW_CARD">🟨 Cartão Amarelo</option>
                  <option value="RED_CARD">🟥 Cartão Vermelho (Expulsão)</option>
                  <option value="SUBSTITUTION">🔄 Substituição(Caso tenha reservas)</option>
                </select>

                <input type="number" placeholder="Minuto" value={minute} onChange={(e) => setMinute(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px', backgroundColor: '#222', color: '#fff', border: '1px solid #444', borderRadius: '4px' }} />
                
                <select value={eventTeamId} onChange={(e) => setEventTeamId(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px', backgroundColor: '#222', color: '#fff', border: '1px solid #444', borderRadius: '4px' }}>
                  <option value="">Selecione o Time Envolvido</option>
                  <option value={currentMatch.homeTeamId}>{getTeamName(currentMatch.homeTeamId)}</option>
                  <option value={currentMatch.awayTeamId}>{getTeamName(currentMatch.awayTeamId)}</option>
                </select>

                <select value={playerName} onChange={(e) => setPlayerName(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '15px', backgroundColor: '#222', color: '#fff', border: '1px solid #444', borderRadius: '4px' }}>
                  <option value="">-- Selecione o Atleta --</option>
                  {availablePlayers.map(p => <option key={p.id} value={p.fullName}>#{p.number} - {p.fullName}</option>)}
                </select>

                <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#00ff88', color: '#000', fontWeight: 'bold', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>
                  Lançar Evento Direto
                </button>
              </form>

              {/* LISTA DE EVENTOS COM OPÇÃO DE EXCLUIR */}
              <div style={{ backgroundColor: '#181818', padding: '15px', borderRadius: '8px', border: '1px solid #333' }}>
                <h4 style={{ color: '#00ff88', margin: '0 0 15px 0' }}>📋 Eventos Registrados Nesta Partida:</h4>
                {matchEventsList.length === 0 ? (
                  <p style={{ color: '#888', fontSize: '0.85rem' }}>Nenhum evento lançado para este jogo ainda.</p>
                ) : (
                  <div style={{ display: 'grid', gap: '8px' }}>
                    {matchEventsList.map(ev => (
                      <div key={ev.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#222', padding: '8px 12px', borderRadius: '4px', fontSize: '0.85rem' }}>
                        <span>
                          <strong>{ev.minute}'</strong> — {ev.type} | {ev.playerName} ({getTeamName(ev.teamId)})
                        </span>
                        <button 
                          onClick={() => handleDeleteEvent(ev.id)} 
                          style={{ backgroundColor: '#ff3333', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                          🗑️ Remover
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}