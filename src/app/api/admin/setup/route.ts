import { NextRequest, NextResponse } from "next/server";
import { query, queryOne } from "@/lib/db";

const ADMIN_SECRET = process.env.ADMIN_SECRET ?? "admin";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { secret } = body;

  if (secret !== ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = await queryOne(
    "SELECT id FROM match_config WHERE is_active = true LIMIT 1"
  );

  if (existing) {
    return NextResponse.json({ error: "Already have an active match" }, { status: 400 });
  }

  const match = await queryOne(
    `INSERT INTO match_config (home_team, away_team, match_date, is_active)
     VALUES ($1, $2, $3, true) RETURNING *`,
    [
      "PSG",
      "Arsenal",
      new Date(Date.now() + 7 * 86400000).toISOString(),
    ]
  );

  const defaultQuestions = [
    { text: "Có bàn thắng trong hiệp 1?", type: "yes_no", a: "Có", ap: 3, b: "Không", bp: 3, order: 1 },
    { text: "Tổng bàn thắng trên 2.5?", type: "yes_no", a: "Trên 2.5", ap: 3, b: "Dưới 2.5", bp: 3, order: 2 },
    { text: "Có thẻ đỏ trong trận?", type: "yes_no", a: "Có", ap: 3, b: "Không", bp: 3, order: 3 },
    { text: "Đội nào giao bóng trước?", type: "multiple_choice", a: "PSG", ap: 2, b: "Arsenal", bp: 2, order: 4 },
    { text: "Cầu thủ xuất sắc nhất trận?", type: "motm", a: null, ap: 5, b: null, bp: 0, order: 5 },
  ];

  for (const q of defaultQuestions) {
    await query(
      `INSERT INTO bonus_questions (match_id, question_text, question_type, option_a_label, option_b_label, option_a_points, option_b_points, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [match.id, q.text, q.type, q.a, q.b, q.ap, q.bp, q.order]
    );
  }

  const defaultPlayers = [
    // PSG
    { name: "Ndjantou", team: "home" },
    { name: "Jangeal", team: "home" },
    { name: "Dembélé", team: "home" },
    { name: "D. Doué", team: "home" },
    { name: "Mbaye", team: "home" },
    { name: "Kvaratskhelia", team: "home" },
    { name: "Gonçalo Ramos", team: "home" },
    { name: "Barcola", team: "home" },
    { name: "Kang-in Lee", team: "home" },
    { name: "Zaïre-Emery", team: "home" },
    { name: "Vitinha", team: "home" },
    { name: "João Neves", team: "home" },
    { name: "Fabián Ruiz", team: "home" },
    { name: "Dro Fernández", team: "home" },
    { name: "Nsoki", team: "home" },
    { name: "Mayulu", team: "home" },
    { name: "Boly", team: "home" },
    { name: "Marquinhos", team: "home" },
    { name: "L. Hernández", team: "home" },
    { name: "Hakimi", team: "home" },
    { name: "Lucas Beraldo", team: "home" },
    { name: "Zabarnyi", team: "home" },
    { name: "Pacho", team: "home" },
    { name: "Nuno Mendes", team: "home" },
    { name: "Safonov", team: "home" },
    { name: "Marin", team: "home" },
    { name: "James", team: "home" },
    { name: "Chevalier", team: "home" },
    { name: "Laurendon", team: "home" },
    { name: "Vignaud", team: "home" },
    // Arsenal
    { name: "Jesus", team: "away" },
    { name: "Saka", team: "away" },
    { name: "Gyökeres", team: "away" },
    { name: "Martinelli", team: "away" },
    { name: "Annous", team: "away" },
    { name: "Zečević-John", team: "away" },
    { name: "Ferdinand", team: "away" },
    { name: "Frohock", team: "away" },
    { name: "Madueke", team: "away" },
    { name: "Zubimendi", team: "away" },
    { name: "Rice", team: "away" },
    { name: "Eze", team: "away" },
    { name: "Havertz", team: "away" },
    { name: "Trossard", team: "away" },
    { name: "Ødegaard", team: "away" },
    { name: "Nørgaard", team: "away" },
    { name: "Dowman", team: "away" },
    { name: "Merino", team: "away" },
    { name: "Bailey-Joseph", team: "away" },
    { name: "Ibrahim", team: "away" },
    { name: "Lewis-Skelly", team: "away" },
    { name: "Julienne", team: "away" },
    { name: "Marciniak", team: "away" },
    { name: "Sampang", team: "away" },
    { name: "Hashi", team: "away" },
    { name: "Dudziak", team: "away" },
    { name: "Murisa", team: "away" },
    { name: "Hincapié", team: "away" },
    { name: "Chapman", team: "away" },
    { name: "Ogunnaike", team: "away" },
    { name: "Ismail", team: "away" },
    { name: "Onyekachukwu", team: "away" },
    { name: "Stachow", team: "away" },
    { name: "Owusu-Gyasi", team: "away" },
    { name: "Salmon", team: "away" },
    { name: "Tahou", team: "away" },
    { name: "King", team: "away" },
    { name: "Nichols", team: "away" },
    { name: "White", team: "away" },
    { name: "Calafiori", team: "away" },
    { name: "J. Timber", team: "away" },
    { name: "Saliba", team: "away" },
    { name: "Gabriel", team: "away" },
    { name: "Mosquera", team: "away" },
    { name: "Arrizabalaga", team: "away" },
    { name: "Raya", team: "away" },
    { name: "Setford", team: "away" },
    { name: "Porter", team: "away" },
    { name: "Ranson", team: "away" },
    { name: "Rojas", team: "away" },
    { name: "Talbot", team: "away" },
  ];

  for (const p of defaultPlayers) {
    await query(
      "INSERT INTO players (match_id, name, team) VALUES ($1, $2, $3)",
      [match.id, p.name, p.team]
    );
  }

  return NextResponse.json({ success: true, match_id: match.id });
}
