"use client";

import { useState } from "react";

export default function BulkAddPage() {
  const [bulkText, setBulkText] = useState("");

  const handleBulkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkText.trim()) return;

    const lines = bulkText.trim().split("\n");
    const newWords = lines.map((line) => {
      const parts = line.split(",").map(s => s.trim());
      return {
        id: Date.now() + Math.random(),
        word: parts[0] || "",
        partOfSpeech: parts[1] || "",
        meaning: parts[2] || "",
        example: parts[3] || "",
        exampleJp: parts[4] || "",
      };
    }).filter(w => w.word && w.meaning);

    const savedWords = localStorage.getItem("vocab-words");
    const wordsList = savedWords ? JSON.parse(savedWords) : [];
    localStorage.setItem("vocab-words", JSON.stringify([...wordsList, ...newWords]));

    // --- ここが修正箇所（赤色に相当する変更点） ---
    // アラートを待たずに、ブラウザに「今のページを捨ててトップへ行け」と直接命じます
    setTimeout(() => {
      window.location.assign("/"); 
    }, 100);
    // ------------------------------------------
  };

  return (
    <main className="min-h-screen bg-white p-8 flex flex-col items-center text-black">
      <div className="w-full max-w-2xl">
        <a href="/" className="text-blue-500 font-bold mb-8 inline-block hover:underline text-lg">
          ← 学習画面に戻る
        </a>
        <h1 className="text-2xl font-bold mb-6">一括登録（カンマ区切り）</h1>
        <form onSubmit={handleBulkSubmit} className="space-y-6 w-full">
          <textarea
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            className="w-full h-80 p-4 border-2 border-black rounded-xl font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="apple, 名詞, りんご, I ate an apple., 私はりんごを食べた。"
          />
          <button type="submit" className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition">
            登録してトップに戻る
          </button>
        </form>
      </div>
    </main>
  );
}