"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BulkAddPage() {
  const [bulkText, setBulkText] = useState("");
  const router = useRouter();

  // 強制的にトップページへ戻る関数
  const goHome = () => {
    window.location.href = "/";
  };

  const handleBulkSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!bulkText.trim()) {
      alert("テキストを入力してください。");
      return;
    }

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

    if (newWords.length === 0) {
      alert("有効なデータが見つかりませんでした。カンマ区切りで入力してください。");
      return;
    }

    const savedWords = localStorage.getItem("vocab-words");
    const wordsList = savedWords ? JSON.parse(savedWords) : [];
    const updatedList = [...wordsList, ...newWords];

    localStorage.setItem("vocab-words", JSON.stringify(updatedList));

    alert(`${newWords.length} 件の単語を登録しました！`);
    
    // 登録後も強制リロードでトップへ戻る
    window.location.href = "/";
  };

  return (
    <main className="min-h-screen bg-white p-8 flex flex-col items-center font-sans text-black">
      <div className="w-full max-w-2xl">
        {/* ボタン形式にして強制移動をかける */}
        <button 
          onClick={goHome}
          className="text-blue-500 text-sm font-bold mb-8 inline-block hover:underline cursor-pointer border-none bg-transparent p-0"
        >
          ← 学習画面に戻る
        </button>
        
        <h1 className="text-2xl font-black mb-4">一括登録 (Bulk Add)</h1>
        <p className="text-gray-500 text-sm mb-6">
          形式：<code className="bg-gray-100 p-1 rounded">英語, 品詞, 意味, 例文, 例文訳</code>
        </p>

        <form onSubmit={handleBulkSubmit} className="space-y-6">
          <textarea
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            className="w-full h-80 p-4 border-2 border-black rounded-xl focus:outline-none font-mono text-sm text-black"
            placeholder="apple, 名詞, りんご, I ate an apple., 私はりんごを食べた。"
          />

          <button
            type="submit"
            className="w-full bg-black text-white py-5 rounded-2xl font-bold text-lg hover:bg-gray-800 transition shadow-lg"
          >
            一括登録を実行する
          </button>
        </form>
      </div>
    </main>
  );
}