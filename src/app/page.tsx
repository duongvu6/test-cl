"use client";

import { useEffect, useState } from "react";
import PredictionForm from "@/components/PredictionForm";
import type { MatchData } from "@/lib/types";

export default function Home() {
  const [matchData, setMatchData] = useState<MatchData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/match")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setMatchData(data);
      })
      .catch(() => setError("Không thể tải dữ liệu"));
  }, []);

  if (error) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold mb-4">🏆 UCL Predictor</h1>
        <p className="text-gray-500">{error}</p>
        <p className="text-sm text-gray-600 mt-2">Vui lòng tạo trận đấu trong trang Admin trước.</p>
        <a href="/admin" className="text-yellow-400 text-sm underline mt-4 inline-block">Đến trang Admin</a>
      </div>
    );
  }

  if (!matchData) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold mb-4">🏆 UCL Predictor</h1>
        <p className="text-gray-500">Đang tải...</p>
      </div>
    );
  }

  return <PredictionForm matchData={matchData} />;
}
