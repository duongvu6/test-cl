"use client";

import { useEffect, useState } from "react";
import type { MatchData } from "@/lib/types";

export default function AdminPage() {
  const [matchData, setMatchData] = useState<MatchData | null>(null);
  const [loading, setLoading] = useState(true);
  const [secret, setSecret] = useState("");
  const [homeGoals, setHomeGoals] = useState("");
  const [awayGoals, setAwayGoals] = useState("");
  const [correctAnswers, setCorrectAnswers] = useState<Record<string, string>>({});
  const [status, setStatus] = useState("");

  const loadMatch = () => {
    setLoading(true);
    fetch("/api/match")
      .then((r) => r.json())
      .then((data) => {
        if (!data.error) {
          setMatchData(data);
          setHomeGoals(data.match.actual_home_goals ?? "");
          setAwayGoals(data.match.actual_away_goals ?? "");
          const initial: Record<string, string> = {};
          for (const q of data.questions ?? []) {
            if (q.correct_answer) initial[String(q.id)] = q.correct_answer;
          }
          setCorrectAnswers(initial);
        } else {
          setMatchData(null);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(loadMatch, []);

  const setupMatch = async () => {
    if (!secret) return;
    setStatus("Đang tạo...");
    const res = await fetch("/api/admin/setup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret }),
    });
    const data = await res.json();
    if (data.success) {
      setStatus("✅ Đã tạo trận đấu!");
      loadMatch();
    } else {
      setStatus("❌ " + (data.error ?? "Lỗi"));
    }
  };

  const submitResult = async () => {
    if (!secret || homeGoals === "" || awayGoals === "") return;
    setStatus("Đang lưu...");
    const res = await fetch("/api/admin/result", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret,
        match_id: matchData?.match.id,
        actual_home_goals: Number(homeGoals),
        actual_away_goals: Number(awayGoals),
        correct_answers: correctAnswers,
      }),
    });
    const data = await res.json();
    setStatus(data.success ? "✅ Đã lưu kết quả!" : "❌ Lỗi: " + (data.error ?? ""));
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Đang tải...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">🔐 Admin</h1>

      <div className="bg-gray-900 rounded-lg p-4 border border-gray-800 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Admin Secret</label>
          <input
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="Nhập admin password..."
            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-yellow-400"
          />
        </div>

        {!matchData ? (
          <div className="text-center py-4">
            <p className="text-gray-400 mb-4">Chưa có trận đấu nào. Bấm nút dưới để tạo trận mẫu (Real Madrid vs Man City).</p>
            <button
              onClick={setupMatch}
              disabled={!secret}
              className="bg-yellow-400 text-gray-950 px-6 py-3 rounded-lg font-bold hover:bg-yellow-300 disabled:opacity-50"
            >
              Tạo trận đấu mẫu
            </button>
          </div>
        ) : (
          <>
            <div className="bg-gray-800 rounded p-3">
              <p className="font-medium mb-2">
                {matchData.match.home_team} vs {matchData.match.away_team}
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">
                    {matchData.match.home_team} (thực tế)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={homeGoals}
                    onChange={(e) => setHomeGoals(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">
                    {matchData.match.away_team} (thực tế)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={awayGoals}
                    onChange={(e) => setAwayGoals(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">Đáp án câu hỏi phụ</h3>
              {matchData.questions.map((q) => (
                <div key={q.id} className="bg-gray-800 rounded p-3 border border-gray-700">
                  <p className="text-sm mb-2">{q.question_text}</p>
                  <select
                    value={correctAnswers[String(q.id)] ?? ""}
                    onChange={(e) =>
                      setCorrectAnswers({ ...correctAnswers, [String(q.id)]: e.target.value })
                    }
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-sm"
                  >
                    <option value="">-- Chọn đáp án đúng --</option>
                    {q.question_type === "motm" ? (
                      matchData.players.map((p) => (
                        <option key={p.id} value={String(p.id)}>
                          {p.name}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="option_a">
                          {q.option_a_label} (+{q.option_a_points}đ)
                        </option>
                        <option value="option_b">
                          {q.option_b_label} (+{q.option_b_points}đ)
                        </option>
                      </>
                    )}
                  </select>
                </div>
              ))}
            </div>

            <button
              onClick={submitResult}
              disabled={!secret || homeGoals === "" || awayGoals === ""}
              className="w-full bg-yellow-400 text-gray-950 py-3 rounded-lg font-bold hover:bg-yellow-300 disabled:opacity-50"
            >
              Lưu kết quả
            </button>
          </>
        )}

        {status && <p className="text-sm text-center">{status}</p>}
      </div>
    </div>
  );
}
