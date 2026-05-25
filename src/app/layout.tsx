import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UCL Predictor",
  description: "Dự đoán kết quả Champions League",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="bg-gray-950 text-gray-100 min-h-screen">
        <nav className="border-b border-gray-800 bg-gray-900">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-6">
            <a href="/" className="font-bold text-lg text-yellow-400">UCL Predictor</a>
            <a href="/leaderboard" className="text-gray-400 hover:text-white text-sm">BXH</a>
          </div>
        </nav>
        <main className="max-w-4xl mx-auto px-4 py-6">
          {children}
        </main>
      </body>
    </html>
  );
}
