import React from 'react';

const positionCoords = {
  GOL: { top: '85%', left: '50%' },
  LD: { top: '65%', left: '82%' },
  ZAG: { top: '70%', left: '50%' },
  LE: { top: '65%', left: '18%' },
  VOL: { top: '50%', left: '50%' },
  MC: { top: '35%', left: '50%' },
  ATA: { top: '15%', left: '50%' },
};

export default function TacticalField({ players }) {
  return (
    <div style={{ backgroundColor: '#1a241a', border: '2px solid #2e442e', borderRadius: '12px', padding: '10px', position: 'relative', height: '400px', width: '100%', overflow: 'hidden' }}>
      {/* Linhas do Campo */}
      <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '2px', backgroundColor: '#ffffff22' }} />
      <div style={{ position: 'absolute', top: '50%', left: '50%', width: '80px', height: '80px', border: '2px solid #ffffff22', borderRadius: '50%', transform: 'translate(-50%, -50%)' }} />

      {/* Jogadores Renderizados */}
      {players.map((p) => {
        const coords = positionCoords[p.position] || positionCoords.MC;
        return (
          <div key={p.id} style={{ position: 'absolute', top: coords.top, left: coords.left, transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <img src={p.photoUrl || 'https://via.placeholder.com/40'} alt={p.fullName} style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid #00ff88', objectFit: 'cover' }} />
              <span style={{ position: 'absolute', bottom: '-4px', right: '-4px', backgroundColor: '#000', color: '#00ff88', fontSize: '0.65rem', fontWeight: 'bold', padding: '1px 4px', borderRadius: '4px' }}>
                #{p.number}
              </span>
            </div>
            <span style={{ display: 'block', fontSize: '0.7rem', color: '#fff', fontWeight: 'bold', marginTop: '2px', textShadow: '1px 1px 2px #000' }}>
              {p.fullName.split(' ')[0]}
            </span>
          </div>
        );
      })}
    </div>
  );
}