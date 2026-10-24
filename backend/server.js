import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db } from './db/index.js';
import { teams, players, matches, matchEvents, tournaments, tournamentTeams } from './db/schema.js';
import { eq, or, and } from 'drizzle-orm';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// --- ROTAS DE TORNEIOS ---
app.get('/tournaments', async (req, res) => {
  try {
    const allTournaments = await db.select().from(tournaments);
    return res.json(allTournaments || []);
  } catch (error) {
    console.error("Erro em GET /tournaments:", error);
    return res.status(500).json({ error: error.message });
  }
});

app.post('/tournaments', async (req, res) => {
  try {
    const { name, type, teamIds } = req.body;
    const [newTournament] = await db.insert(tournaments).values({
      name,
      type,
      status: 'EM_ANDAMENTO'
    }).returning();

    if (Array.isArray(teamIds) && teamIds.length > 0) {
      for (const tId of teamIds) {
        await db.insert(tournamentTeams).values({
          tournamentId: newTournament.id,
          teamId: Number(tId)
        });
      }
    }

    return res.status(201).json(newTournament);
  } catch (error) {
    console.error("Erro ao criar torneio:", error);
    return res.status(500).json({ error: error.message });
  }
});

app.get('/tournaments/:id/teams', async (req, res) => {
  try {
    const tId = Number(req.params.id);
    const relations = await db.select().from(tournamentTeams).where(eq(tournamentTeams.tournamentId, tId));
    const teamIds = relations.map(r => r.teamId);
    
    if (teamIds.length === 0) return res.json([]);
    
    const allTeams = await db.select().from(teams);
    return res.json(allTeams.filter(t => teamIds.includes(t.id)));
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// --- ROTAS DE EQUIPAS E ELENCO ---
app.get('/teams', async (req, res) => {
  try {
    const allTeams = await db.select().from(teams);
    return res.json(allTeams || []);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.post('/teams', async (req, res) => {
  try {
    const { name, code, logoUrl, squad } = req.body;
    const [newTeam] = await db.insert(teams).values({ name, code, logoUrl }).returning();

    if (Array.isArray(squad) && squad.length > 0) {
      for (const p of squad) {
        if (p.fullName && p.email && p.number) {
          await db.insert(players).values({
            teamId: newTeam.id,
            fullName: p.fullName,
            email: p.email,
            number: Number(p.number),
            position: p.position || 'MC',
            photoUrl: p.photoUrl || ''
          });
        }
      }
    }
    return res.status(201).json(newTeam);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.delete('/teams/:id', async (req, res) => {
  try {
    const teamIdNum = Number(req.params.id);

    const relatedMatches = await db.select().from(matches).where(
      or(eq(matches.homeTeamId, teamIdNum), eq(matches.awayTeamId, teamIdNum))
    );

    for (const match of relatedMatches) {
      await db.delete(matchEvents).where(eq(matchEvents.matchId, match.id));
      await db.delete(matches).where(eq(matches.id, match.id));
    }

    await db.delete(tournamentTeams).where(eq(tournamentTeams.teamId, teamIdNum));
    await db.delete(players).where(eq(players.teamId, teamIdNum));
    await db.delete(teams).where(eq(teams.id, teamIdNum));

    return res.json({ message: 'Equipa apagada com sucesso' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.get('/teams/:id/players', async (req, res) => {
  try {
    const teamPlayers = await db.select().from(players).where(eq(players.teamId, Number(req.params.id)));
    return res.json(teamPlayers || []);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// --- ROTAS DE PARTIDAS ---
app.get('/matches', async (req, res) => {
  try {
    const allMatches = await db.select().from(matches);
    return res.json(allMatches || []);
  } catch (error) {
    console.error("Erro em GET /matches:", error);
    return res.status(500).json({ error: error.message });
  }
});

app.post('/matches', async (req, res) => {
  try {
    const { phase, homeTeamId, awayTeamId, scheduledAt, hasExtraTime, tournamentId } = req.body;
    
    const dateObj = scheduledAt ? new Date(scheduledAt) : new Date();

    const [newMatch] = await db.insert(matches).values({
      phase: phase || '1ª Rodada',
      tournamentId: tournamentId ? Number(tournamentId) : null,
      homeTeamId: Number(homeTeamId),
      awayTeamId: Number(awayTeamId),
      scheduledAt: dateObj,
      hasExtraTime: Boolean(hasExtraTime),
      status: 'AGENDADO',
      currentMinute: 0,
      addedMinutes: 0
    }).returning();

    return res.status(201).json(newMatch);
  } catch (error) {
    console.error("Erro ao agendar partida:", error);
    return res.status(500).json({ error: error.message });
  }
});

app.patch('/matches/:id/clock', async (req, res) => {
  try {
    const { status, currentMinute, addedMinutes } = req.body;
    const matchId = Number(req.params.id);

    const updateData = {};
    if (status) updateData.status = status;
    if (currentMinute !== undefined) updateData.currentMinute = Number(currentMinute);
    if (addedMinutes !== undefined) updateData.addedMinutes = Number(addedMinutes);

    const [updated] = await db.update(matches).set(updateData).where(eq(matches.id, matchId)).returning();
    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Rota para buscar os jogadores expulsos de uma partida específica
app.get('/matches/:id/expelled-players', async (req, res) => {
  try {
    const matchIdNum = Number(req.params.id);
    const redCards = await db.select().from(matchEvents).where(
      and(eq(matchEvents.matchId, matchIdNum), eq(matchEvents.type, 'RED_CARD'))
    );
    
    const expelledNames = redCards.map(ev => ev.playerName).filter(Boolean);
    return res.json(expelledNames);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// --- EVENTOS DO JOGO & VAR ---
app.post('/events', async (req, res) => {
  try {
    const { matchId, type, minute, playerName, playerOutName, detail, teamId } = req.body;

    const [currentMatch] = await db.select().from(matches).where(eq(matches.id, Number(matchId)));
    if (!currentMatch) {
      return res.status(404).json({ error: 'Partida não encontrada.' });
    }

    // Regra: Bloqueio de ação sem jogador
    const typesRequiringPlayer = ['GOAL', 'PENALTY_GOAL', 'YELLOW_CARD', 'RED_CARD', 'SUBSTITUTION'];
    if (typesRequiringPlayer.includes(type) && !playerName) {
      return res.status(400).json({ error: 'Selecione o jogador envolvido para registrar esta ação!' });
    }

    if (type === 'SUBSTITUTION' && !playerOutName) {
      return res.status(400).json({ error: 'Selecione o jogador que está saindo da partida!' });
    }

    // Regra: Não permitir ações de jogador expulso
    if (playerName) {
      const redCards = await db.select().from(matchEvents).where(
        and(eq(matchEvents.matchId, Number(matchId)), eq(matchEvents.type, 'RED_CARD'))
      );
      const isExpelled = redCards.some(ev => ev.playerName === playerName);
      if (isExpelled) {
        return res.status(400).json({ error: `O jogador ${playerName} foi expulso e não pode mais atuar nesta partida!` });
      }
    }

    // Validação do Limite de Minutagem
    const maxRegulationTime = currentMatch.hasExtraTime ? 120 : 90;
    const parsedMinute = parseInt(minute, 10);

    if (!isNaN(parsedMinute)) {
      const currentAdded = currentMatch.addedMinutes || 0;
      const allowedMax = maxRegulationTime + currentAdded;

      if (parsedMinute > allowedMax) {
        return res.status(400).json({
          error: `Tempo limite ultrapassado! Este jogo permite no máximo ${allowedMax}' (${maxRegulationTime}' + ${currentAdded}' de acréscimos).`
        });
      }
    }

    const [newEvent] = await db.insert(matchEvents).values({
      matchId: Number(matchId),
      teamId: teamId ? Number(teamId) : null,
      type,
      minute: minute ? String(minute) : '0',
      playerName,
      playerOutName,
      detail
    }).returning();

    // Atualização de Placar
    const homeId = Number(currentMatch.homeTeamId);
    const selectedTeamId = Number(teamId);

    if ((type === 'GOAL' || type === 'PENALTY_GOAL') && teamId) {
      if (selectedTeamId === homeId) {
        await db.update(matches).set({ homeScore: (currentMatch.homeScore || 0) + 1 }).where(eq(matches.id, Number(matchId)));
      } else {
        await db.update(matches).set({ awayScore: (currentMatch.awayScore || 0) + 1 }).where(eq(matches.id, Number(matchId)));
      }
    }

    if (type === 'OWN_GOAL' && teamId) {
      if (selectedTeamId === homeId) {
        await db.update(matches).set({ awayScore: (currentMatch.awayScore || 0) + 1 }).where(eq(matches.id, Number(matchId)));
      } else {
        await db.update(matches).set({ homeScore: (currentMatch.homeScore || 0) + 1 }).where(eq(matches.id, Number(matchId)));
      }
    }

    if (type === 'VAR_CANCEL' && teamId) {
      if (selectedTeamId === homeId) {
        const newScore = Math.max(0, (currentMatch.homeScore || 0) - 1);
        await db.update(matches).set({ homeScore: newScore }).where(eq(matches.id, Number(matchId)));
      } else {
        const newScore = Math.max(0, (currentMatch.awayScore || 0) - 1);
        await db.update(matches).set({ awayScore: newScore }).where(eq(matches.id, Number(matchId)));
      }
    }

    return res.status(201).json(newEvent);
  } catch (error) {
    console.error("Erro ao registrar evento:", error);
    return res.status(500).json({ error: error.message });
  }
});

app.get('/matches/:id/events', async (req, res) => {
  try {
    const events = await db.select().from(matchEvents).where(eq(matchEvents.matchId, Number(req.params.id)));
    return res.json(events || []);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// --- TABELA DE PONTOS CORRIDOS ---
app.get('/standings', async (req, res) => {
  try {
    const tournamentId = req.query.tournamentId;
    const allTeams = await db.select().from(teams);
    let allMatches = await db.select().from(matches);

    if (tournamentId) {
      allMatches = allMatches.filter(m => Number(m.tournamentId) === Number(tournamentId));
    }

    const standings = allTeams.map((team) => ({
      id: team.id,
      name: team.name,
      code: team.code,
      logoUrl: team.logoUrl,
      played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0,
    }));

    allMatches
      .filter((m) => m.status === 'ENCERRADO')
      .forEach((m) => {
        const home = standings.find((t) => t.id === Number(m.homeTeamId));
        const away = standings.find((t) => t.id === Number(m.awayTeamId));

        if (home && away) {
          const hScore = m.homeScore || 0;
          const aScore = m.awayScore || 0;

          home.played += 1; away.played += 1;
          home.gf += hScore; home.ga += aScore;
          away.gf += aScore; away.ga += hScore;

          if (hScore > aScore) {
            home.won += 1; home.points += 3; away.lost += 1;
          } else if (aScore > hScore) {
            away.won += 1; away.points += 3; home.lost += 1;
          } else {
            home.drawn += 1; away.drawn += 1;
            home.points += 1; away.points += 1;
          }

          home.gd = home.gf - home.ga;
          away.gd = away.gf - away.ga;
        }
      });

    standings.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.won !== a.won) return b.won - a.won;
      if (b.gd !== a.gd) return b.gd - a.gd;
      return b.gf - a.gf;
    });

    return res.json(standings);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => console.log(`API a rodar na porta ${PORT}`));