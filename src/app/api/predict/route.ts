import { NextRequest, NextResponse } from "next/server";
import { query, queryOne } from "@/lib/db";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { discord_username, home_goals, away_goals, bonus_answers } = body;

  if (!discord_username || home_goals === undefined || away_goals === undefined) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const match = await queryOne(
    "SELECT id FROM match_config WHERE is_active = true LIMIT 1"
  );

  if (!match) {
    return NextResponse.json({ error: "No active match" }, { status: 404 });
  }

  const existing = await queryOne(
    "SELECT * FROM predictions WHERE discord_username = $1 AND match_id = $2 LIMIT 1",
    [discord_username, match.id]
  );

  let prediction;
  if (existing) {
    const rows = await query(
      `UPDATE predictions SET home_goals = $1, away_goals = $2, bonus_answers = $3, updated_at = NOW()
       WHERE id = $4 RETURNING *`,
      [home_goals, away_goals, JSON.stringify(bonus_answers ?? {}), existing.id]
    );
    prediction = rows[0];

    await query(
      `INSERT INTO prediction_logs (prediction_id, discord_username, match_id, action,
        old_home_goals, old_away_goals, old_bonus_answers,
        new_home_goals, new_away_goals, new_bonus_answers)
       VALUES ($1, $2, $3, 'update', $4, $5, $6, $7, $8, $9)`,
      [
        existing.id, discord_username, match.id,
        existing.home_goals, existing.away_goals, JSON.stringify(existing.bonus_answers ?? {}),
        home_goals, away_goals, JSON.stringify(bonus_answers ?? {}),
      ]
    );
  } else {
    const rows = await query(
      `INSERT INTO predictions (discord_username, match_id, home_goals, away_goals, bonus_answers)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [discord_username, match.id, home_goals, away_goals, JSON.stringify(bonus_answers ?? {})]
    );
    prediction = rows[0];

    await query(
      `INSERT INTO prediction_logs (prediction_id, discord_username, match_id, action,
        new_home_goals, new_away_goals, new_bonus_answers)
       VALUES ($1, $2, $3, 'create', $4, $5, $6)`,
      [
        prediction.id, discord_username, match.id,
        home_goals, away_goals, JSON.stringify(bonus_answers ?? {}),
      ]
    );
  }

  return NextResponse.json({ prediction });
}
