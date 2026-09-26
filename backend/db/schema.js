import { pgTable, serial, varchar, integer, boolean, timestamp } from 'drizzle-orm/pg-core';

// 1. Tabela de Equipas (Teams)
export const teams = pgTable('teams', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  code: varchar('code', { length: 10 }).notNull(),
  logoUrl: varchar('logo_url', { length: 255 }),
});

// 2. Tabela de Partidas (Matches)
export const matches = pgTable('matches', {
  id: serial('id').primaryKey(),
  phase: varchar('phase', { length: 50 }).notNull(),
  status: varchar('status', { length: 20 }).default('SCHEDULED'),
  isLive: boolean('is_live').default(false),
  
  homeTeamId: integer('home_team_id').references(() => teams.id),
  awayTeamId: integer('away_team_id').references(() => teams.id),
  
  homeScore: integer('home_score').default(0),
  awayScore: integer('away_score').default(0),
  
  createdAt: timestamp('created_at').defaultNow(),
});

// 3. Tabela de Eventos do Jogo
export const matchEvents = pgTable('match_events', {
  id: serial('id').primaryKey(),
  matchId: integer('match_id').references(() => matches.id).notNull(),
  
  type: varchar('type', { length: 20 }).notNull(),
  minute: varchar('minute', { length: 10 }).notNull(),
  playerName: varchar('player_name', { length: 100 }).notNull(),
  detail: varchar('detail', { length: 255 }),
});