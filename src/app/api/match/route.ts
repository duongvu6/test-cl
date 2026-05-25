import { NextResponse } from "next/server";
import { query, queryOne } from "@/lib/db";

export async function GET() {
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

  const players = await query(
    "SELECT * FROM players WHERE match_id = $1",
    [match.id]
  );

  return NextResponse.json({
    match,
    questions: questions ?? [],
    players: players ?? [],
  });
}
