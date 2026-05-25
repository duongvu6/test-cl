export type MatchConfig = {
  id: number;
  home_team: string;
  away_team: string;
  match_date: string | null;
  is_active: boolean;
  actual_home_goals: number | null;
  actual_away_goals: number | null;
};

export type BonusQuestion = {
  id: number;
  match_id: number;
  question_text: string;
  question_type: "yes_no" | "multiple_choice" | "motm";
  option_a_label: string | null;
  option_b_label: string | null;
  option_a_points: number;
  option_b_points: number;
  correct_answer: string | null;
  sort_order: number;
};

export type Player = {
  id: number;
  match_id: number;
  name: string;
  team: "home" | "away";
};

export type Prediction = {
  id: string;
  discord_username: string;
  match_id: number;
  home_goals: number | null;
  away_goals: number | null;
  bonus_answers: Record<string, string>;
  total_score: number;
  created_at: string;
  updated_at: string;
};

export type MatchData = {
  match: MatchConfig;
  questions: BonusQuestion[];
  players: Player[];
};
