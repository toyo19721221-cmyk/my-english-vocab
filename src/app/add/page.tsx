"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AddPage() {
  const [text, setText] = useState("");
  const router = useRouter();

  const handleAdd = () => {
    if (!text.trim()) {
      alert("テキストを入力してください");
      return;
    }

    try {
      // 1行ずつ処理して単語データを作る
      const newWords = text.split("\n").filter(line => line.trim()).map((line, index) => {
        const parts = line.split(",").map(s => s.trim());
        return {
          id: Date.now() + index,
          word: parts[0] || "",
          partOfSpeech: parts[1] || "n.",
          meaning: parts[2] || "",
          example: parts[3] || "",
          exampleJp: parts[4] || "",
          isLearned: false
        };
      });

      // ローカルストレージに保存する
      const saved = localStorage.getItem("my-app-data");
      const current = saved ? JSON.parse(saved) : [];
      localStorage.setItem("my-app-data", JSON.stringify([...current, ...newWords]));
      
      alert(`${newWords.length}件の単語を追加しました`);
      router.push("/"); // 保存後にメイン画面へ戻る
    } catch (e) {
      console.error(e);
      alert("入力形式が正しくありません。コンマ（,）で区切ってください。");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8 text-black">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-gray-400 hover:text-black mb-8 inline-block font-bold">← Back</Link>
        <h1 className="text-3xl font-black mb-6 tracking-tighter">ADD WORDS</h1>
        <p className="text-sm text-gray-500 mb-4">形式: 単語, 品詞, 意味, 例文, 例文和訳 (1行に1つ)</p>
        <textarea
          className="w-full h-64 p-4 rounded-2xl border-2 border-gray-100 mb-6 focus:border-black outline-none transition-all shadow-sm"
          placeholder="apple, n., りんご, I eat an apple., 私はりんごを食べます。"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          onClick={handleAdd}
          className="w-full py-4 bg-black text-white rounded-2xl font-bold shadow-xl hover:opacity-80 active:scale-[0.98] transition-all"
        >
          一括登録する
        </button>
      </div>
    </main>
  );
}