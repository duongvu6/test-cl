-- 1. Match configuration
CREATE TABLE IF NOT EXISTS match_config (
  id BIGSERIAL PRIMARY KEY,
  home_team TEXT NOT NULL DEFAULT '',
  away_team TEXT NOT NULL DEFAULT '',
  match_date TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT false,
  actual_home_goals INTEGER,
  actual_away_goals INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Bonus questions for each match
CREATE TABLE IF NOT EXISTS bonus_questions (
  id BIGSERIAL PRIMARY KEY,
  match_id BIGINT REFERENCES match_config(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL CHECK (question_type IN ('yes_no', 'multiple_choice', 'motm')),
  option_a_label TEXT,
  option_b_label TEXT,
  option_a_points INTEGER DEFAULT 3,
  option_b_points INTEGER DEFAULT 3,
  correct_answer TEXT,
  sort_order INTEGER DEFAULT 0
);

-- 3. Players list for MOTM question
CREATE TABLE IF NOT EXISTS players (
  id BIGSERIAL PRIMARY KEY,
  match_id BIGINT REFERENCES match_config(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  team TEXT NOT NULL CHECK (team IN ('home', 'away'))
);

-- 4. User predictions
CREATE TABLE IF NOT EXISTS predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  discord_username TEXT NOT NULL,
  match_id BIGINT REFERENCES match_config(id),
  home_goals INTEGER,
  away_goals INTEGER,
  bonus_answers JSONB DEFAULT '{}'::jsonb,
  total_score INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(discord_username, match_id)
);

-- 5. Audit log for prediction changes
CREATE TABLE IF NOT EXISTS prediction_logs (
  id BIGSERIAL PRIMARY KEY,
  prediction_id UUID REFERENCES predictions(id),
  discord_username TEXT NOT NULL,
  match_id BIGINT REFERENCES match_config(id),
  action TEXT NOT NULL CHECK (action IN ('create', 'update')),
  old_home_goals INTEGER,
  old_away_goals INTEGER,
  old_bonus_answers JSONB,
  new_home_goals INTEGER,
  new_away_goals INTEGER,
  new_bonus_answers JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_predictions_discord ON predictions(discord_username);
CREATE INDEX IF NOT EXISTS idx_predictions_match ON predictions(match_id);
CREATE INDEX IF NOT EXISTS idx_prediction_logs_user ON prediction_logs(discord_username);
CREATE INDEX IF NOT EXISTS idx_prediction_logs_match ON prediction_logs(match_id);
CREATE INDEX IF NOT EXISTS idx_bonus_questions_match ON bonus_questions(match_id);
CREATE INDEX IF NOT EXISTS idx_players_match ON players(match_id);
