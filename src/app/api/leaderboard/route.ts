import { NextResponse } from "next/server";
import { query, queryOne } from "@/lib/db";
import { calculateScore } from "@/lib/scoring";

export async function GET() {
  const match = await queryOne(
    "SELECT * FROM match_config WHERE is_active = true LIMIT 1"
  );

  if (!match) {
    return NextResponse.json({ error: "No active match" }, { status: 404 });
  }

  const questions = await query(
    "SELECT * FROM bonus_questions WHERE match_id = $1",
    [match.id]
  );

  const predictions = await query(
    "SELECT * FROM predictions WHERE match_id = $1 ORDER BY created_at",
    [match.id]
  );

  if (!predictions) {
    return NextResponse.json({ leaderboard: [] });
  }

  const actualSet = match.actual_home_goals != null && match.actual_away_goals != null;

  const leaderboard = predictions.map((p: any) => {
    const score = actualSet
      ? calculateScore(
          { home_goals: p.home_goals, away_goals: p.away_goals, bonus_answers: p.bonus_answers },
          { home_goals: match.actual_home_goals, away_goals: match.actual_away_goals },
          questions ?? []
        )
      : 0;

    return {
      discord_username: p.discord_username,
      home_goals: p.home_goals,
      away_goals: p.away_goals,
      score,
      has_result: actualSet,
    };
  });

  leaderboard.sort((a: any, b: any) => b.score - a.score);

  return NextResponse.json({ leaderboard });
}
