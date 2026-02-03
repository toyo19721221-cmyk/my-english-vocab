"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddPage() {
  const [csvText, setCsvText] = useState("");
  const router = useRouter();

  const handleImport = () => {
    const lines = csvText.split("\n");
    const newWords = lines
      .filter(line => line.trim() !== "" && !line.startsWith("英語,")) // ヘッダーを除外
      .map((line) => {
        const [word, meaning, example, exampleJp] = line.split(",").map(item => item?.trim());
        return {
          id: Date.now() + Math.random(),
          word: word || "",        // 1列目：英語
          meaning: meaning || "",  // 2列目：日本語
          example: example || "",  // 3列目：例文
          exampleJp: exampleJp || "", // 4列目：例文訳
          partOfSpeech: "n/a",     // CSVにない場合はn/aとする
          isLearned: false,
        };
      });

    if (newWords.length === 0) return alert("有効なデータがありません");

    const saved = localStorage.getItem("my-app-data");
    const existingWords = saved ? JSON.parse(saved) : [];
    localStorage.setItem("my-app-data", JSON.stringify([...existingWords, ...newWords]));
    
    alert(`${newWords.length}件登録しました`);
    router.push("/");
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50 text-black">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-sm border">
        <h1 className="text-2xl font-black mb-6">CSV一括登録</h1>
        <p className="text-xs text-gray-500 mb-4">
          形式: 英語,日本語,例文,例文訳 (1行1単語)
        </p>
        <textarea
          className="w-full h-64 p-4 border-2 border-gray-100 rounded-2xl mb-4 focus:border-blue-500 outline-none transition-all"
          placeholder="while,〜の間、一方で,I fell asleep while I was watching TV.,テレビを見ている間に寝てしまった。"
          value={csvText}
          onChange={(e) => setCsvText(e.target.value)}
        />
        <div className="flex gap-4">
          <button
            onClick={() => router.push("/")}
            className="flex-1 py-4 bg-gray-100 font-bold rounded-2xl hover:bg-gray-200"
          >
            戻る
          </button>
          <button
            onClick={handleImport}
            className="flex-1 py-4 bg-black text-white font-bold rounded-2xl hover:opacity-80"
          >
            登録実行
          </button>
        </div>
      </div>
    </main>
  );
}