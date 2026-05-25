"use client";

import { useEffect, useState } from "react";
import LeaderboardTable from "@/components/LeaderboardTable";
import type { MatchData } from "@/lib/types";

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [matchData, setMatchData] = useState<MatchData | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/leaderboard").then((r) => r.json()),
      fetch("/api/match").then((r) => r.json()),
    ]).then(([lb, match]) => {
      if (lb.leaderboard) setLeaderboard(lb.leaderboard);
      if (!match.error) setMatchData(match);
    });
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">🏆 Bảng xếp hạng</h1>
      <LeaderboardTable data={leaderboard} matchData={matchData} />
    </div>
  );
}
