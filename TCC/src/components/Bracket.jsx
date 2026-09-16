import { mockMatches } from '../mockData';

export default function Bracket() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h2 style={{ fontSize: '18px', color: '#00e87a', fontWeight: 'bold' }}>
        CHAVEAMENTO DO TORNEIO (MATA-MATA)
      </h2>

      {/* Container flexível simulando a progressão das fases */}
      <div style={{ display: 'flex', gap: '30px', alignItems: 'center', overflowX: 'auto', paddingBottom: '10px' }}>
        
        {/* Coluna 1: Semifinais */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', minWidth: '260px' }}>
          <span style={{ fontSize: '12px', color: '#8a8a9e', fontWeight: 'bold' }}>SEMIFINAIS</span>
          {mockMatches.map((match) => (
            <div key={match.id} style={{
              backgroundColor: '#12121e',
              border: '1px solid #222235',
              borderRadius: '8px',
              padding: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                <span style={{ fontWeight: match.homeTeam.score > match.awayTeam.score ? 'bold' : 'normal' }}>
                  {match.homeTeam.name}
                </span>
                <span style={{ color: '#00e87a', fontWeight: 'bold' }}>{match.homeTeam.score}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                <span style={{ fontWeight: match.awayTeam.score > match.homeTeam.score ? 'bold' : 'normal' }}>
                  {match.awayTeam.name}
                </span>
                <span style={{ color: '#00e87a', fontWeight: 'bold' }}>{match.awayTeam.score}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Linha Divisória/Conector */}
        <div style={{ borderLeft: '2px dashed #222235', height: '180px' }} />

        {/* Coluna 2: Grande Final */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', minWidth: '260px' }}>
          <span style={{ fontSize: '12px', color: '#00e87a', fontWeight: 'bold' }}>★ GRANDE FINAL</span>
          <div style={{
            backgroundColor: '#12121e',
            border: '1px solid #00e87a',
            borderRadius: '8px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <span>FC Barcelona</span>
              <span style={{ color: '#8a8a9e' }}>-</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <span style={{ color: '#8a8a9e' }}>A definir (PSG/FCB)</span>
              <span style={{ color: '#8a8a9e' }}>-</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}