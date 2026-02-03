"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function StudyPage() {
  const [words, setWords] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("my-app-data");
    if (saved) setWords(JSON.parse(saved));
  }, []);

  return (
    <main className="min-h-screen bg-white p-10 text-black flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-10">VOCAB MASTER (復旧モード)</h1>
      <div className="p-10 border-4 border-black rounded-3xl text-center">
        <p className="mb-4">登録済み単語数: {words.length}</p>
        <Link href="/add" className="text-blue-500 underline font-bold">
          ＋ 単語を追加・一括登録する
        </Link>
      </div>
    </main>
  );
}