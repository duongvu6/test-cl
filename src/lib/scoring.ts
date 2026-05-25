export type MatchResult = {
  home_goals: number;
  away_goals: number;
};

export type BonusQuestion = {
  id: number;
  question_text: string;
  question_type: "yes_no" | "multiple_choice" | "motm";
  option_a_label: string | null;
  option_b_label: string | null;
  option_a_points: number;
  option_b_points: number;
  correct_answer: string | null;
  sort_order: number;
};

export type PredictionData = {
  home_goals: number;
  away_goals: number;
  bonus_answers: Record<string, string>;
};

function sign(n: number): number {
  if (n > 0) return 1;
  if (n < 0) return -1;
  return 0;
}

export function calculateScore(
  prediction: PredictionData,
  actual: MatchResult,
  questions: BonusQuestion[]
): number {
  let total = 0;

  const userResult = sign(prediction.home_goals - prediction.away_goals);
  const actualResult = sign(actual.home_goals - actual.away_goals);
  if (userResult === actualResult) {
    total += 3;
  }

  if (prediction.home_goals === actual.home_goals) {
    total += 1;
  }

  if (prediction.away_goals === actual.away_goals) {
    total += 1;
  }

  const userGD = prediction.home_goals - prediction.away_goals;
  const actualGD = actual.home_goals - actual.away_goals;
  if (userGD === actualGD) {
    total += 1;
  }

  for (const q of questions) {
    const userAnswer = prediction.bonus_answers[String(q.id)];
    if (userAnswer && q.correct_answer && userAnswer === q.correct_answer) {
      if (q.question_type === "motm") {
        total += q.option_a_points;
      } else {
        total += userAnswer === "option_a" ? q.option_a_points : q.option_b_points;
      }
    }
  }

  return total;
}
