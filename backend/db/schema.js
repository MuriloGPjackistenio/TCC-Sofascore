import { pgTable, serial, varchar, integer, boolean, timestamp } from 'drizzle-orm/pg-core';

export const tournaments = pgTable('tournaments', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  type: varchar('type', { length: 30 }).notNull(), // 'PONTOS_CORRIDOS', 'MATA_MATA', 'GRUPOS'
  status: varchar('status', { length: 20 }).default('EM_ANDAMENTO'),
});

export const teams = pgTable('teams', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  code: varchar('code', { length: 10 }).notNull(),
  logoUrl: varchar('logo_url', { length: 500 }),
});

// Tabela que liga os times aos torneios (Ponto 3)
export const tournamentTeams = pgTable('tournament_teams', {
  id: serial('id').primaryKey(),
  tournamentId: integer('tournament_id').references(() => tournaments.id, { onDelete: 'cascade' }).notNull(),
  teamId: integer('team_id').references(() => teams.id, { onDelete: 'cascade' }).notNull(),
});

export const players = pgTable('players', {
  id: serial('id').primaryKey(),
  teamId: integer('team_id').references(() => teams.id, { onDelete: 'cascade' }).notNull(),
  fullName: varchar('full_name', { length: 150 }).notNull(),
  email: varchar('email', { length: 150 }).notNull(),
  number: integer('number').notNull(),
  position: varchar('position', { length: 20 }).default('MC'),
  photoUrl: varchar('photo_url', { length: 500 }),
});

export const matches = pgTable('matches', {
  id: serial('id').primaryKey(),
  tournamentId: integer('tournament_id').references(() => tournaments.id, { onDelete: 'cascade' }),
  phase: varchar('phase', { length: 50 }).notNull(),
  status: varchar('status', { length: 30 }).default('AGENDADO'),
  scheduledAt: timestamp('scheduled_at').notNull(),
  hasExtraTime: boolean('has_extra_time').default(false),
  
  currentMinute: integer('current_minute').default(0),
  addedMinutes: integer('added_minutes').default(0),
  
  homeTeamId: integer('home_team_id').references(() => teams.id, { onDelete: 'cascade' }),
  awayTeamId: integer('away_team_id').references(() => teams.id, { onDelete: 'cascade' }),
  homeScore: integer('home_score').default(0),
  awayScore: integer('away_score').default(0),
});

export const matchEvents = pgTable('match_events', {
  id: serial('id').primaryKey(),
  matchId: integer('match_id').references(() => matches.id, { onDelete: 'cascade' }).notNull(),
  teamId: integer('team_id').references(() => teams.id, { onDelete: 'cascade' }),
  type: varchar('type', { length: 30 }).notNull(),
  minute: varchar('minute', { length: 10 }),
  playerName: varchar('player_name', { length: 100 }),
  playerOutName: varchar('player_out_name', { length: 100 }),
  detail: varchar('detail', { length: 255 }),
});