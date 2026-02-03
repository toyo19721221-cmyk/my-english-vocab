"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function BulkAddPage() {
  const [bulkText, setBulkText] = useState("");
  const router = useRouter();

  const handleBulkSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!bulkText.trim()) {
      alert("テキストを入力してください。");
      return;
    }

    // 行ごとに分割して処理
    const lines = bulkText.trim().split("\n");
    const newWords = lines.map((line) => {
      // カンマで分割（英語,品詞,意味,例文,例文訳）
      const [word, partOfSpeech, meaning, example, exampleJp] = line.split(",").map(s => s.trim());
      
      return {
        id: Date.now() + Math.random(), // 重複を避けるためのID
        word: word || "",
        partOfSpeech: partOfSpeech || "",
        meaning: meaning || "",
        example: example || "",
        exampleJp: exampleJp || "",
      };
    }).filter(w => w.word && w.meaning); // 最低限、英語と意味がある行だけ採用

    if (newWords.length === 0) {
      alert("有効なデータが見つかりませんでした。形式を確認してください。");
      return;
    }

    // ローカルストレージの既存データと結合
    const savedWords = localStorage.getItem("vocab-words");
    const wordsList = savedWords ? JSON.parse(savedWords) : [];
    const updatedList = [...wordsList, ...newWords];

    localStorage.setItem("vocab-words", JSON.stringify(updatedList));

    alert(`${newWords.length} 件の単語を登録しました！`);
    router.push("/");
  };

  return (
    <main className="min-h-screen bg-white p-8 flex flex-col items-center font-sans">
      <div className="w-full max-w-2xl">
        <Link href="/" className="text-blue-500 text-sm font-bold mb-8 block">
          ← 学習画面に戻る
        </Link>
        
        <h1 className="text-2xl font-black text-black mb-4">一括登録 (Bulk Add)</h1>
        <p className="text-gray-500 text-sm mb-6">
          以下の形式で、1行に1単語ずつ入力してください：<br />
          <code className="bg-gray-100 p-1 rounded">英語, 品詞, 意味, 例文, 例文訳</code>
        </p>

        <form onSubmit={handleBulkSubmit} className="space-y-6">
          <textarea
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            className="w-full h-80 p-4 border-2 border-black rounded-xl focus:outline-none font-mono text-sm"
            placeholder="apple, 名詞, りんご, I ate an apple., 私はりんごを食べた。&#13;&#10;banana, 名詞, バナナ, This is a banana., これはバナナです。"
          />

          <button
            type="submit"
            className="w-full bg-black text-white py-5 rounded-2xl font-bold text-lg hover:bg-gray-800 transition shadow-lg"
          >
            一括登録を実行する
          </button>
        </form>

        <div className="mt-8 p-4 bg-blue-50 rounded-xl text-blue-800 text-xs">
          <strong>ヒント:</strong> ExcelやGoogleスプレッドシートで作ったリストをカンマ区切りで貼り付けると便利です。
        </div>
      </div>
    </main>
  );
}