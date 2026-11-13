import React, { useState, useEffect } from 'react';
import StandingsTable from './StandingsTable';
import Bracket from './Bracket';
import { API_URL } from '../api';

export default function TournamentsHub() {
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState(null);

  useEffect(() => {
    // Busca a lista de torneios cadastrados no backend
    fetch(`${API_URL}/tournaments`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setTournaments(data);
          if (data.length > 0) setSelectedTournament(data[0]); // Seleciona o primeiro por padrão
        }
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={{ maxWidth: '1000px', margin: '2rem auto', color: '#fff', fontFamily: 'sans-serif', padding: '0 1rem' }}>
      <h2 style={{ color: '#00ff88', textAlign: 'center', marginBottom: '25px' }}>
        🏆 Central de Campeonatos
      </h2>

      {/* Lista / Chips dos Campeonatos em Andamento */}
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '30px' }}>
        {tournaments.map((t) => {
          const isSelected = selectedTournament?.id === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setSelectedTournament(t)}
              style={{
                padding: '12px 24px',
                borderRadius: '8px',
                backgroundColor: isSelected ? '#00ff88' : '#1f1f1f',
                color: isSelected ? '#000' : '#fff',
                border: isSelected ? '2px solid #00ff88' : '1px solid #333',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '0.95rem',
                transition: 'all 0.2s ease',
              }}
            >
              {t.type === 'PONTOS_CORRIDOS' && '📊 '}
              {t.type === 'MATA_MATA' && '⚔️ '}
              {t.type === 'GRUPOS' && '🛡️ '}
              {t.name}
            </button>
          );
        })}
      </div>

      {/* Renderização Dinâmica Conforme o Tipo de Campeonato Selecionado */}
      {selectedTournament && (
        <div style={{ backgroundColor: '#111', padding: '20px', borderRadius: '12px', border: '1px solid #222' }}>
          <div style={{ borderBottom: '1px solid #333', paddingBottom: '10px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, color: '#00ff88' }}>{selectedTournament.name}</h3>
            <span style={{ fontSize: '0.8rem', backgroundColor: '#222', padding: '4px 10px', borderRadius: '4px', color: '#aaa' }}>
              Formato: {selectedTournament.type.replace('_', ' ')}
            </span>
          </div>

          {/* Se for Pontos Corridos -> Abre a Tabela */}
          {selectedTournament.type === 'PONTOS_CORRIDOS' && (
            <StandingsTable tournamentId={selectedTournament.id} />
          )}

          {/* Se for Mata-Mata -> Abre o Chaveamento Visual */}
          {selectedTournament.type === 'MATA_MATA' && (
            <Bracket tournamentId={selectedTournament.id} />
          )}

          {/* Se for Fase de Grupos -> Pode combinar ambos */}
          {selectedTournament.type === 'GRUPOS' && (
            <div>
              <StandingsTable tournamentId={selectedTournament.id} />
              <div style={{ marginTop: '30px' }}>
                <Bracket tournamentId={selectedTournament.id} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}   