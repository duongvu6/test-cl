import { NextRequest, NextResponse } from "next/server";
import { query, queryOne } from "@/lib/db";

const ADMIN_SECRET = process.env.ADMIN_SECRET ?? "admin";

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  if (secret !== ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const match = await queryOne(
    "SELECT * FROM match_config WHERE is_active = true LIMIT 1"
  );

  if (!match) {
    return NextResponse.json({ error: "No active match" }, { status: 404 });
  }

  const questions = await query(
    "SELECT * FROM bonus_questions WHERE match_id = $1 ORDER BY sort_order",
    [match.id]
  );

  const predictions = await query(
    "SELECT * FROM predictions WHERE match_id = $1",
    [match.id]
  );

  if (!predictions || predictions.length === 0) {
    return NextResponse.json({
      total_predictions: 0,
      score_distribution: {},
      goal_distribution: {},
      bonus_stats: [],
    });
  }

  const goalDistribution: Record<string, number> = {};
  for (const p of predictions) {
    const key = `${p.home_goals}-${p.away_goals}`;
    goalDistribution[key] = (goalDistribution[key] ?? 0) + 1;
  }

  const bonusStats = (questions ?? []).map((q: any) => {
    const counts: Record<string, number> = {};
    for (const p of predictions) {
      const answer = p.bonus_answers?.[String(q.id)];
      if (answer) {
        counts[answer] = (counts[answer] ?? 0) + 1;
      }
    }
    return {
      question_id: q.id,
      question_text: q.question_text,
      question_type: q.question_type,
      counts,
    };
  });

  const scoreDistribution: Record<string, number> = {};
  if (match.actual_home_goals != null) {
    const { calculateScore } = await import("@/lib/scoring");
    for (const p of predictions) {
      const score = calculateScore(
        {
          home_goals: p.home_goals,
          away_goals: p.away_goals,
          bonus_answers: p.bonus_answers ?? {},
        },
        { home_goals: match.actual_home_goals, away_goals: match.actual_away_goals },
        questions ?? []
      );
      const bucket = Math.floor(score / 5) * 5;
      const label = `${bucket}-${bucket + 4}`;
      scoreDistribution[label] = (scoreDistribution[label] ?? 0) + 1;
    }
  }

  return NextResponse.json({
    total_predictions: predictions.length,
    score_distribution: scoreDistribution,
    goal_distribution: goalDistribution,
    bonus_stats: bonusStats,
  });
}
