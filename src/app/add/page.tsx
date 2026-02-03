"use client";

import { useState } from "react";

export default function BulkAddPage() {
  const [bulkText, setBulkText] = useState("");

  const handleBulkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkText.trim()) return alert("テキストを入力してください。");

    const lines = bulkText.trim().split("\n");
    const newWords = lines.map((line) => {
      const [word, partOfSpeech, meaning, example, exampleJp] = line.split(",").map(s => s.trim());
      return {
        id: Date.now() + Math.random(),
        word: word || "",
        partOfSpeech: partOfSpeech || "",
        meaning: meaning || "",
        example: example || "",
        exampleJp: exampleJp || "",
      };
    }).filter(w => w.word && w.meaning);

    const savedWords = localStorage.getItem("vocab-words");
    const wordsList = savedWords ? JSON.parse(savedWords) : [];
    localStorage.setItem("vocab-words", JSON.stringify([...wordsList, ...newWords]));

    alert(`${newWords.length} 件登録しました！`);
    // 強制的にトップページへリロード移動
    window.location.assign("/");
  };

  return (
    <main className="min-h-screen bg-white p-8 flex flex-col items-center text-black">
      <div className="w-full max-w-2xl">
        {/* 最も強力な強制リンク */}
        <a href="/" className="text-blue-600 font-bold mb-8 inline-block text-xl">
          ← ここを押せば絶対に学習画面に戻る
        </a>
        
        <h1 className="text-2xl font-black mb-4">一括登録</h1>
        <form onSubmit={handleBulkSubmit} className="space-y-6">
          <textarea
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            className="w-full h-80 p-4 border-4 border-black rounded-xl text-black font-bold"
            placeholder="apple, 名詞, りんご, I ate an apple., 私はりんごを食べた。"
          />
          <button type="submit" className="w-full bg-black text-white py-6 rounded-2xl font-bold text-xl">
            一括登録を実行する
          </button>
        </form>
      </div>
    </main>
  );
}