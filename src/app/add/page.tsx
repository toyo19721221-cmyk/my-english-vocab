"use client";
import { useState } from "react";

export default function BulkAddPage() {
  const [bulkText, setBulkText] = useState("");

  const handleBulkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lines = bulkText.trim().split("\n");
    const newWords = lines.map(line => {
      const p = line.split(",").map(s => s.trim());
      return { id: Date.now() + Math.random(), word: p[0], partOfSpeech: p[1], meaning: p[2], example: p[3] };
    }).filter(w => w.word && w.meaning);

    const saved = localStorage.getItem("my-app-data");
    const currentList = saved ? JSON.parse(saved) : [];
    localStorage.setItem("my-app-data", JSON.stringify([...currentList, ...newWords]));
    window.location.assign("/");
  };

  return (
    <main className="min-h-screen bg-white p-8 flex flex-col items-center text-black">
      <div className="w-full max-w-2xl">
        <a href="/" className="text-blue-500 font-bold mb-8 inline-block">← 学習画面に戻る</a>
        <h1 className="text-2xl font-bold mb-6">一括登録（カンマ区切り）</h1>
        <form onSubmit={handleBulkSubmit} className="space-y-4 w-full">
          <textarea
            value={bulkText} onChange={(e) => setBulkText(e.target.value)}
            className="w-full h-80 p-4 border-2 border-black rounded-xl text-black bg-white"
            placeholder="apple, 名詞, りんご, I ate an apple."
          />
          <button type="submit" className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg">登録してトップに戻る</button>
        </form>
      </div>
    </main>
  );
}