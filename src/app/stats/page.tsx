"use client";

import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";

const COLORS = ["#facc15", "#3b82f6", "#22c55e", "#ef4444", "#a855f7", "#ec4899"];

export default function StatsPage() {
  const [secret, setSecret] = useState("");
  const [authed, setAuthed] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [error, setError] = useState("");

  const loadStats = async () => {
    if (!secret.trim()) return;
    const res = await fetch(`/api/stats?secret=${encodeURIComponent(secret.trim())}`);
    if (res.status === 401) {
      setError("Sai mật khẩu");
      return;
    }
    const data = await res.json();
    if (data.error) {
      setError(data.error);
      return;
    }
    setAuthed(true);
    setStats(data);
  };

  useEffect(() => {
    if (authed) loadStats();
  }, [authed]);

  if (!authed) {
    return (
      <div className="max-w-sm mx-auto py-20">
        <h1 className="text-2xl font-bold mb-4 text-center">📊 Thống kê</h1>
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-800 space-y-4">
          <label className="block text-sm font-medium">Admin Secret</label>
          <input
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && loadStats()}
            placeholder="Nhập admin password..."
            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-yellow-400"
          />
          <button
            onClick={loadStats}
            disabled={!secret.trim()}
            className="w-full bg-yellow-400 text-gray-950 py-2 rounded font-bold hover:bg-yellow-300 disabled:opacity-50"
          >
            Xem thống kê
          </button>
          {error && <p className="text-sm text-red-400 text-center">{error}</p>}
        </div>
      </div>
    );
  }

  if (!stats) {
    return <div className="text-center py-12 text-gray-500">Đang tải...</div>;
  }

  if (stats.total_predictions === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        Chưa có dữ liệu thống kê.
      </div>
    );
  }

  const goalData = Object.entries(stats.goal_distribution)
    .map(([key, count]) => ({ name: key, value: count as number }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  const scoreDist = Object.entries(stats.score_distribution).map(([key, count]) => ({
    range: key,
    count: count as number,
  }));

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">📊 Thống kê</h1>

      <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
        <p className="text-lg">
          Tổng số dự đoán: <strong className="text-yellow-400">{stats.total_predictions}</strong>
        </p>
      </div>

      {goalData.length > 0 && (
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
          <h2 className="font-semibold mb-4">Top tỉ số được dự đoán nhiều nhất</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={goalData}>
              <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: 8 }} />
              <Bar dataKey="value" fill="#facc15" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {scoreDist.length > 0 && (
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
          <h2 className="font-semibold mb-4">Phân bố điểm số</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={scoreDist}>
              <XAxis dataKey="range" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: 8 }} />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {stats.bonus_stats.map((bs: any) => {
        const pieData = Object.entries(bs.counts).map(([key, val]) => ({
          name: key,
          value: val as number,
        }));
        return (
          <div key={bs.question_id} className="bg-gray-900 rounded-lg p-4 border border-gray-800">
            <h2 className="font-semibold mb-1">{bs.question_text}</h2>
            {pieData.length > 0 && (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {pieData.map((_: any, idx: number) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        );
      })}
    </div>
  );
}
