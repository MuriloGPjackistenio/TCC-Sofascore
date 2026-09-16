import { mockMatches } from '../mockData';

export default function Dashboard() {
  // Filtra o primeiro jogo marcado como ao vivo
  const liveMatch = mockMatches.find(m => m.isLive);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Seção Destaque AO VIVO */}
      {liveMatch && (
        <section>
          <span style={{ color: '#00e87a', fontWeight: 'bold', fontSize: '14px' }}>
            ● AO VIVO
          </span>
          <div style={{
            backgroundColor: '#12121e',
            border: '1px solid #222235',
            borderRadius: '12px',
            padding: '24px',
            marginTop: '8px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ textAlign: 'left', flex: 1 }}>
              <h2 style={{ fontSize: '20px' }}>{liveMatch.homeTeam.name}</h2>
              <span style={{ color: '#8a8a9e', fontSize: '12px' }}>{liveMatch.homeTeam.code}</span>
            </div>

            <div style={{ textAlign: 'center', padding: '0 20px' }}>
              <span style={{ backgroundColor: '#00e87a', color: '#000', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                {liveMatch.status}
              </span>
              <div style={{ fontSize: '36px', fontWeight: 'bold', margin: '8px 0', letterSpacing: '4px' }}>
                {liveMatch.homeTeam.score} - {liveMatch.awayTeam.score}
              </div>
              <span style={{ color: '#8a8a9e', fontSize: '12px' }}>{liveMatch.phase}</span>
            </div>

            <div style={{ textAlign: 'right', flex: 1 }}>
              <h2 style={{ fontSize: '20px' }}>{liveMatch.awayTeam.name}</h2>
              <span style={{ color: '#8a8a9e', fontSize: '12px' }}>{liveMatch.awayTeam.code}</span>
            </div>
          </div>
        </section>
      )}

      {/* Lista de Partidas Recentes */}
      <section>
        <h3 style={{ fontSize: '16px', color: '#8a8a9e', marginBottom: '12px' }}>
          FASE ATUAL — SEMIFINAIS
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {mockMatches.map((match) => (
            <div key={match.id} style={{
              backgroundColor: '#12121e',
              border: '1px solid #222235',
              borderRadius: '8px',
              padding: '16px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '12px', color: '#8a8a9e' }}>
                <span>{match.phase}</span>
                <span style={{ color: match.isLive ? '#00e87a' : '#8a8a9e' }}>{match.status}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>{match.homeTeam.name}</span>
                <span style={{ fontWeight: 'bold' }}>{match.homeTeam.score}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{match.awayTeam.name}</span>
                <span style={{ fontWeight: 'bold' }}>{match.awayTeam.score}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}