export default function AdminPanel() {
  return (
    <div style={{ backgroundColor: '#12121e', border: '1px solid #222235', borderRadius: '12px', padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '20px', marginBottom: '20px', color: '#00e87a' }}>
        Painel do Administrador — Atualizar Partida
      </h2>

      <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', color: '#8a8a9e', fontSize: '14px', marginBottom: '6px' }}>
            Selecione a Partida
          </label>
          <select style={{ width: '100%', padding: '10px', backgroundColor: '#08080f', border: '1px solid #222235', color: '#fff', borderRadius: '6px' }}>
            <option>PSG vs Bayern München (Semifinal)</option>
            <option>Real Madrid vs FC Barcelona (Semifinal)</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', color: '#8a8a9e', fontSize: '14px', marginBottom: '6px' }}>
              Gols Mandante
            </label>
            <input type="number" defaultValue={2} style={{ width: '100%', padding: '10px', backgroundColor: '#08080f', border: '1px solid #222235', color: '#fff', borderRadius: '6px' }} />
          </div>

          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', color: '#8a8a9e', fontSize: '14px', marginBottom: '6px' }}>
              Gols Visitante
            </label>
            <input type="number" defaultValue={1} style={{ width: '100%', padding: '10px', backgroundColor: '#08080f', border: '1px solid #222235', color: '#fff', borderRadius: '6px' }} />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', color: '#8a8a9e', fontSize: '14px', marginBottom: '6px' }}>
            Status da Partida
          </label>
          <select style={{ width: '100%', padding: '10px', backgroundColor: '#08080f', border: '1px solid #222235', color: '#fff', borderRadius: '6px' }}>
            <option>EM_ANDAMENTO</option>
            <option>ENCERRADO</option>
            <option>NAO_INICIADO</option>
          </select>
        </div>

        <button type="submit" style={{ backgroundColor: '#00e87a', color: '#000', padding: '12px', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
          Salvar Alterações
        </button>
      </form>
    </div>
  );
}