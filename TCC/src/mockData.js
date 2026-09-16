// Dados fictícios simulando a resposta que o Back-end enviará no futuro
export const mockMatches = [
  {
    id: 1,
    phase: 'SEMIFINAL',
    status: 'LIVE 67\'',
    isLive: true,
    homeTeam: { name: 'Paris Saint-Germain', code: 'PSG', score: 2 },
    awayTeam: { name: 'Bayern München', code: 'FCB', score: 1 },
  },
  {
    id: 2,
    phase: 'SEMIFINAL',
    status: 'ENCERRADO',
    isLive: false,
    homeTeam: { name: 'Real Madrid', code: 'RMA', score: 2 },
    awayTeam: { name: 'FC Barcelona', code: 'BAR', score: 3 },
  }
];