"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function StudyPage() {
  const [words, setWords] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("my-app-data");
    if (saved) { setWords(JSON.parse(saved)); }
  }, []);

  const nextCard = () => {
    setShowDetail(false);
    if (words.length > 0) setCurrentIndex((prev) => (prev + 1) % words.length);
  };

  return (
    <main className="min-h-screen bg-gray-50 p-6 flex flex-col items-center justify-center text-black">
      <h1 className="text-3xl font-black mb-8">VOCAB MASTER</h1>
      {words.length > 0 ? (
        <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-sm min-h-[400px] flex flex-col justify-between border border-gray-100">
          <div className="text-center">
            <p className="text-gray-300 text-xs font-bold mb-4 uppercase tracking-widest">{currentIndex + 1} / {words.length}</p>
            <h2 className="text-4xl font-bold text-gray-900 mb-2">{words[currentIndex].word}</h2>
            <p className="text-blue-500 font-bold text-sm uppercase">[{words[currentIndex].partOfSpeech || "N/A"}]</p>
          </div>
          {showDetail && (
            <div className="space-y-4 text-center bg-blue-50 p-4 rounded-xl">
              <div className="text-2xl font-bold text-gray-800">{words[currentIndex].meaning}</div>
              <p className="text-gray-600 italic text-sm">"{words[currentIndex].example}"</p>
            </div>
          )}
          <div className="flex gap-4 w-full mt-8">
            <button onClick={() => setShowDetail(!showDetail)} className="flex-1 py-4 bg-gray-200 text-gray-900 rounded-xl font-bold">{showDetail ? "Hide" : "Answer"}</button>
            <button onClick={nextCard} className="flex-1 py-4 bg-black text-white rounded-xl font-bold">Next</button>
          </div>
        </div>
      ) : (
        <p className="text-gray-400">単語が登録されていません</p>
      )}
      <Link href="/add" className="mt-10 text-blue-500 underline font-bold">＋ 新しい単語を登録する</Link>
    </main>
  );
}