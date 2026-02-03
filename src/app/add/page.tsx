"use client";
import { useState } from "react";
import Link from "next/link";

export default function BulkAddPage() {
  const [bulkText, setBulkText] = useState("");

  const handleBulkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lines = bulkText.trim().split("\n");
    const newWords = lines.map(line => {
      const p = line.split(",").map(s => s.trim());
      return {
        id: Date.now() + Math.random(),
        word: p[0],
        partOfSpeech: p[1],
        meaning: p[2],
        example: p[3],
        exampleJp: p[4] // 5番目の「例文訳」を取得
      };
    }).filter(w => w.word && w.meaning);

    const saved = localStorage.getItem("my-app-data");
    const currentList = saved ? JSON.parse(saved) : [];
    localStorage.setItem("my-app-data", JSON.stringify([...currentList, ...newWords]));
    
    alert("登録が完了しました！");
    window.location.href = "/"; // 自動でトップに戻る
  };

  return (
    <main className="min-h-screen bg-white p-8 flex flex-col items-center text-black">
      <div className="w-full max-w-2xl">
        <Link href="/" className="text-blue-500 font-bold mb-8 inline-block">← 学習画面に戻る</Link>
        <h1 className="text-3xl font-black mb-2">一括登録 (Bulk Add)</h1>
        <p className="text-sm text-gray-500 mb-6">形式：英語, 品詞, 意味, 例文, 日本語訳</p>
        <form onSubmit={handleBulkSubmit} className="space-y-4">
          <textarea
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            className="w-full h-80 p-4 border-2 border-black rounded-2xl text-black font-mono"
            placeholder="apple, 名詞, りんご, I ate an apple., 私はりんごを食べた。"
          />
          <button type="submit" className="w-full bg-black text-white py-6 rounded-2xl font-bold text-xl hover:bg-gray-800 transition">
            一括登録を実行する
          </button>
        </form>
      </div>
    </main>
  );
}