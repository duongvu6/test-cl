import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

const ADMIN_SECRET = process.env.ADMIN_SECRET ?? "admin";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { secret, match_id, actual_home_goals, actual_away_goals, correct_answers } = body;

  if (secret !== ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (actual_home_goals === undefined || actual_away_goals === undefined) {
    return NextResponse.json({ error: "Missing score" }, { status: 400 });
  }

  await query(
    "UPDATE match_config SET actual_home_goals = $1, actual_away_goals = $2 WHERE id = $3",
    [actual_home_goals, actual_away_goals, match_id]
  );

  if (correct_answers && typeof correct_answers === "object") {
    for (const [questionId, answer] of Object.entries(correct_answers)) {
      await query(
        "UPDATE bonus_questions SET correct_answer = $1 WHERE id = $2",
        [answer as string, Number(questionId)]
      );
    }
  }

  return NextResponse.json({ success: true });
}
