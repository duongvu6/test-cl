"use client";

import type { MatchData } from "@/lib/types";

type LeaderboardEntry = {
  discord_username: string;
  home_goals: number;
  away_goals: number;
  score: number;
  has_result: boolean;
};

type Props = {
  data: LeaderboardEntry[];
  matchData: MatchData | null;
};

export default function LeaderboardTable({ data, matchData }: Props) {
  if (data.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        Chưa có dự đoán nào.
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-800 bg-gray-950 text-gray-400">
            <th className="text-left px-4 py-3 font-medium">#</th>
            <th className="text-left px-4 py-3 font-medium">Discord</th>
            <th className="text-center px-4 py-3 font-medium">
              {matchData ? `${matchData.match.home_team} - ${matchData.match.away_team}` : "Tỉ số"}
            </th>
            <th className="text-right px-4 py-3 font-medium">Điểm</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, i) => (
            <tr key={entry.discord_username} className="border-b border-gray-800 hover:bg-gray-800/50">
              <td className="px-4 py-3 text-gray-500">{i + 1}</td>
              <td className="px-4 py-3 font-medium">{entry.discord_username}</td>
              <td className="px-4 py-3 text-center">
                {entry.home_goals} - {entry.away_goals}
              </td>
              <td className="px-4 py-3 text-right font-bold text-yellow-400">
                {entry.has_result ? entry.score : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
