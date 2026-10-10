import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db } from './db/index.js';
import { teams, matches, matchEvents } from './db/schema.js';
import { eq } from 'drizzle-orm';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// --- ROTAS DE EQUIPAS ---

// Listar todas as equipas
app.get('/teams', async (req, res) => {
  try {
    const allTeams = await db.select().from(teams);
    return res.json(allTeams);
  } catch (error) {
    console.error('Erro ao buscar equipas:', error);
    return res.status(500).json({ error: 'Erro ao buscar equipas', details: error.message });
  }
});

// Criar nova equipa
app.post('/teams', async (req, res) => {
  try {
    const { name, code, logoUrl } = req.body;
    const newTeam = await db.insert(teams).values({ name, code, logoUrl }).returning();
    return res.status(201).json(newTeam[0]);
  } catch (error) {
    console.error('Erro ao criar equipa:', error);
    return res.status(500).json({ error: 'Erro ao criar equipa.', details: error.message });
  }
});

// --- ROTAS DE PARTIDAS ---

// Listar todas as partidas
app.get('/matches', async (req, res) => {
  try {
    const allMatches = await db.select().from(matches);
    return res.json(allMatches);
  } catch (error) {
    console.error('Erro detalhado ao buscar partidas:', error);
    return res.status(500).json({ error: 'Erro ao buscar partidas', details: error.message });
  }
});

// Criar nova partida
app.post('/matches', async (req, res) => {
  try {
    const { phase, homeTeamId, awayTeamId } = req.body;
    const newMatch = await db.insert(matches).values({
      phase,
      homeTeamId: Number(homeTeamId),
      awayTeamId: Number(awayTeamId),
      homeScore: 0,
      awayScore: 0,
      status: 'AGENDADO',
      isLive: false
    }).returning();
    return res.status(201).json(newMatch[0]);
  } catch (error) {
    console.error('Erro ao criar partida:', error);
    return res.status(500).json({ error: 'Erro ao criar partida', details: error.message });
  }
});

// Atualizar Placar / Status de uma partida
app.put('/matches/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { homeScore, awayScore, status, isLive } = req.body;

    const updatedMatch = await db.update(matches)
      .set({
        homeScore: Number(homeScore),
        awayScore: Number(awayScore),
        status,
        isLive: isLive ?? false
      })
      .where(eq(matches.id, Number(id)))
      .returning();

    if (updatedMatch.length === 0) {
      return res.status(404).json({ error: 'Partida não encontrada' });
    }

    return res.json(updatedMatch[0]);
  } catch (error) {
    console.error('Erro ao atualizar partida:', error);
    return res.status(500).json({ error: 'Erro ao atualizar partida', details: error.message });
  }
});

// --- ROTAS DE EVENTOS ---

// Listar eventos de uma partida específica
app.get('/matches/:id/events', async (req, res) => {
  try {
    const { id } = req.params;
    const events = await db.select().from(matchEvents).where(eq(matchEvents.matchId, Number(id)));
    return res.json(events);
  } catch (error) {
    console.error('Erro ao buscar eventos:', error);
    return res.status(500).json({ error: 'Erro ao buscar eventos', details: error.message });
  }
});

// Criar novo evento (golo, cartão, etc.)
app.post('/events', async (req, res) => {
  try {
    const { matchId, type, minute, playerName, detail } = req.body;
    const newEvent = await db.insert(matchEvents).values({
      matchId: Number(matchId),
      type,
      minute,
      playerName,
      detail
    }).returning();
    return res.status(201).json(newEvent[0]);
  } catch (error) {
    console.error('Erro ao registrar evento:', error);
    return res.status(500).json({ error: 'Erro ao registrar evento', details: error.message });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`API a rodar na porta: http://localhost:${PORT}`);
});