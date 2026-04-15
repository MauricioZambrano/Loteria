-- Run this in your Supabase SQL editor to set up the database

CREATE TABLE IF NOT EXISTS game_sessions (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code        integer UNIQUE,               -- 6-digit join code shown on admin
  drawn       integer[] NOT NULL DEFAULT '{}',
  mode        text NOT NULL DEFAULT 'libre',
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- Migration: add code column to existing tables
-- ALTER TABLE game_sessions ADD COLUMN IF NOT EXISTS code integer UNIQUE;

-- Allow anonymous reads and writes (no auth needed for a private event tool)
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all" ON game_sessions
  FOR ALL USING (true) WITH CHECK (true);

-- Enable Realtime on this table (optional — we use Broadcast, not DB changes)
-- ALTER PUBLICATION supabase_realtime ADD TABLE game_sessions;
