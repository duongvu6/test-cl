"use client";

import type { BonusQuestion, Player } from "@/lib/types";

type Props = {
  questions: BonusQuestion[];
  players: Player[];
  answers: Record<string, string>;
  onChange: (answers: Record<string, string>) => void;
};

export default function BonusSection({ questions, players, answers, onChange }: Props) {
  const updateAnswer = (qId: string, value: string) => {
    onChange({ ...answers, [qId]: value });
  };

  const homePlayers = players.filter((p) => p.team === "home");
  const awayPlayers = players.filter((p) => p.team === "away");

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Câu hỏi phụ</h3>
      {questions.map((q) => (
        <div key={q.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <p className="text-sm font-medium mb-3">{q.question_text}</p>

          {q.question_type === "motm" ? (
            <div className="space-y-2">
              <p className="text-xs text-gray-400 mb-1">Chọn 1 cầu thủ (<strong className="text-yellow-400">+{q.option_a_points}đ</strong>)</p>
              {homePlayers.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">{homePlayers[0]?.team === "home" ? "Đội nhà" : "Đội khách"}</p>
                  <div className="grid grid-cols-2 gap-1">
                    {homePlayers.map((p) => (
                      <label
                        key={p.id}
                        className={`flex items-center gap-2 px-3 py-2 rounded text-sm cursor-pointer ${
                          answers[String(q.id)] === String(p.id)
                            ? "bg-yellow-400/20 border border-yellow-400"
                            : "bg-gray-700 border border-gray-600 hover:bg-gray-600"
                        }`}
                      >
                        <input
                          type="radio"
                          name={`q-${q.id}`}
                          value={String(p.id)}
                          checked={answers[String(q.id)] === String(p.id)}
                          onChange={() => updateAnswer(String(q.id), String(p.id))}
                          className="accent-yellow-400"
                        />
                        {p.name}
                      </label>
                    ))}
                  </div>
                </div>
              )}
              {awayPlayers.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Đội khách</p>
                  <div className="grid grid-cols-2 gap-1">
                    {awayPlayers.map((p) => (
                      <label
                        key={p.id}
                        className={`flex items-center gap-2 px-3 py-2 rounded text-sm cursor-pointer ${
                          answers[String(q.id)] === String(p.id)
                            ? "bg-yellow-400/20 border border-yellow-400"
                            : "bg-gray-700 border border-gray-600 hover:bg-gray-600"
                        }`}
                      >
                        <input
                          type="radio"
                          name={`q-${q.id}`}
                          value={String(p.id)}
                          checked={answers[String(q.id)] === String(p.id)}
                          onChange={() => updateAnswer(String(q.id), String(p.id))}
                          className="accent-yellow-400"
                        />
                        {p.name}
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-3">
              {["option_a", "option_b"].map((opt) => (
                <label
                  key={opt}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded text-sm cursor-pointer ${
                    answers[String(q.id)] === opt
                      ? "bg-yellow-400/20 border border-yellow-400"
                      : "bg-gray-700 border border-gray-600 hover:bg-gray-600"
                  }`}
                >
                  <input
                    type="radio"
                    name={`q-${q.id}`}
                    value={opt}
                    checked={answers[String(q.id)] === opt}
                    onChange={() => updateAnswer(String(q.id), opt)}
                    className="accent-yellow-400"
                  />
                  <span className="font-medium">
                    {opt === "option_a" ? q.option_a_label : q.option_b_label}
                  </span>
                  <span className="text-xs text-gray-400">
                    (+{opt === "option_a" ? q.option_a_points : q.option_b_points}đ)
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
