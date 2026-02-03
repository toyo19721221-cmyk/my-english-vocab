"use client";
import { useState } from "react";

export default function BulkAddPage() {
  const [bulkText, setBulkText] = useState("");

  const handleBulkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkText.trim()) return;

    const lines = bulkText.trim().split("\n");
    const newWords = lines.map(line => {
      const p = line.split(",").map(s => s.trim());
      // 5つの項目（単語, 品詞, 意味, 例文, 日本語訳）を読み込む
      return { 
        id: Date.now() + Math.random(), 
        word: p[0], 
        partOfSpeech: p[1], 
        meaning: p[2], 
        example: p[3],
        exampleJp: p[4] // ここが重要！
      };
    }).filter(w => w.word && w.meaning);

    try {
      const saved = localStorage.getItem("my-app-data");
      const currentList = saved ? JSON.parse(saved) : [];
      localStorage.setItem("my-app-data", JSON.stringify([...currentList, ...newWords]));
      
      alert("登録が完了しました！");
      // 保存後、強制的にトップページへ移動
      window.location.href = "/";
    } catch (error) {
      console.error("保存エラー:", error);
      alert("保存に失敗しました。形式を確認してください。");
    }
  };

  return (
    <main className="min-h-screen bg-white p-8 flex flex-col items-center text-black">
      <div className="w-full max-w-2xl">
        <a href="/" className="text-blue-500 font-bold mb-8 inline-block">← 学習画面に戻る</a>
        <h1 className="text-3xl font-black mb-2">一括登録</h1>
        <p className="text-sm text-gray-500 mb-6">形式：英語, 品詞, 意味, 例文, 日本語訳</p>
        <form onSubmit={handleBulkSubmit} className="space-y-4 w-full">
          <textarea
            value={bulkText} onChange={(e) => setBulkText(e.target.value)}
            className="w-full h-80 p-4 border-4 border-black rounded-2xl text-black bg-white font-mono"
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