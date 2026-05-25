"use client";

import { useState } from "react";
import type { MatchData } from "@/lib/types";
import BonusSection from "./BonusSection";

export default function PredictionForm({ matchData }: { matchData: MatchData }) {
  const { match, questions, players } = matchData;

  const [username, setUsername] = useState("");
  const [homeGoals, setHomeGoals] = useState("");
  const [awayGoals, setAwayGoals] = useState("");
  const [bonusAnswers, setBonusAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const submit = async () => {
    if (!username.trim() || homeGoals === "" || awayGoals === "") return;
    setLoading(true);
    setMessage("");
    const res = await fetch("/api/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        discord_username: username.trim(),
        home_goals: Number(homeGoals),
        away_goals: Number(awayGoals),
        bonus_answers: bonusAnswers,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      setMessage("✅ Đã lưu dự đoán thành công!");
    } else {
      setMessage("❌ " + (data.error ?? "Lỗi khi lưu"));
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
        <h2 className="text-xl font-bold mb-2">
          {match.home_team} vs {match.away_team}
        </h2>
        <p className="text-sm text-gray-500">
          {match.match_date ? new Date(match.match_date).toLocaleString("vi-VN") : "Sắp diễn ra"}
        </p>
      </div>

      <div className="bg-gray-900 rounded-lg p-4 border border-gray-800 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Discord Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Nhập discord username..."
            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-yellow-400"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">{match.home_team}</label>
            <input
              type="number"
              min="0"
              max="20"
              value={homeGoals}
              onChange={(e) => setHomeGoals(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-yellow-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{match.away_team}</label>
            <input
              type="number"
              min="0"
              max="20"
              value={awayGoals}
              onChange={(e) => setAwayGoals(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-yellow-400"
            />
          </div>
        </div>

        <div className="bg-gray-800 rounded p-3 text-sm text-gray-400 space-y-1">
          <p>Kết quả chính xác (thắng/hòa/thua): <strong className="text-white">+3 điểm</strong></p>
          <p>Số bàn đội nhà chính xác: <strong className="text-white">+1 điểm</strong></p>
          <p>Số bàn đội khách chính xác: <strong className="text-white">+1 điểm</strong></p>
          <p>Hiệu số chính xác: <strong className="text-white">+1 điểm</strong></p>
        </div>

        {questions.length > 0 && (
          <BonusSection
            questions={questions}
            players={players}
            answers={bonusAnswers}
            onChange={setBonusAnswers}
          />
        )}

        <button
          onClick={submit}
          disabled={loading || !username.trim() || homeGoals === "" || awayGoals === ""}
          className="w-full bg-green-500 text-white py-3 rounded-lg font-bold hover:bg-green-400 disabled:opacity-50"
        >
          {loading ? "Đang lưu..." : "Lưu dự đoán"}
        </button>

        {message && <p className="text-sm text-center">{message}</p>}
      </div>
    </div>
  );
}
