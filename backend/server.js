import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';
import { teams, matches, matchEvents } from './db/schema.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql);

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
  res.json({ message: 'API rodando com certeza sim sim claro deu certo pode sair API cim cim slaro' });
});


// Listar todas equipes
app.get('/teams', async (req, res) => {
  try {
    const allTeams = await db.select().from(teams);
    res.json(allTeams);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar equipes.' });
  }
});

//Criar nova equipe
app.post('/teams', async (req, res) => {
  try {
    const { name, code, logoUrl } = req.body;
    const newTeam = await db.insert(teams).values({ name, code, logoUrl }).returning();
    res.status(201).json(newTeam[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar equipe.' });
  }
});

//Listar todas partidas
app.get('/matches', async (req, res) => {
  try {
    const allMatches = await db.select().from(matches);
    res.json(allMatches);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar partidas.' });
  }
});

//Criar nova partida
app.post('/matches', async (req, res) => {
  try {
    const { phase, homeTeamId, awayTeamId } = req.body;
    const newMatch = await db.insert(matches).values({
      phase,
      homeTeamId,
      awayTeamId,
      status: 'SCHEDULED'
    }).returning();

    res.status(201).json(newMatch[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar partida.' });
  }
});

//Atualizar resultado/status da partida
app.put('/matches/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { homeScore, awayScore, status, isLive } = req.body;

    const updatedMatch = await db.update(matches)
      .set({ homeScore, awayScore, status, isLive })
      .where(eq(matches.id, Number(id)))
      .returning();

    res.json(updatedMatch[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar partida.' });
  }
});

//Apagar uma partida
app.delete('/matches/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.delete(matches).where(eq(matches.id, Number(id)));
    res.json({ message: 'Partida cancelada com sucesso!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao apagar a partida.' });
  }
});

app.listen(PORT, () => {
  console.log(`API do site sis ism rodando na porta: http://localhost:${PORT}`);
});