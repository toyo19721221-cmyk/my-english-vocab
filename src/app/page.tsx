"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Word {
  id: number;
  word: string;
  partOfSpeech: string;
  meaning: string;
  example: string;
  exampleJp?: string; 
}

export default function StudyPage() {
  const [words, setWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("my-app-data");
    if (saved) setWords(JSON.parse(saved));
  }, []);

  const nextCard = () => {
    setShowDetail(false);
    if (words.length > 0) setCurrentIndex((prev) => (prev + 1) % words.length);
  };

  return (
    <main className="min-h-screen bg-white p-6 flex flex-col items-center justify-center text-black">
      <h1 className="text-3xl font-black mb-8 tracking-tighter">VOCAB MASTER</h1>
      {words.length > 0 ? (
        <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-sm min-h-[450px] flex flex-col justify-between border border-gray-100">
          <div className="text-center">
            <p className="text-gray-300 text-xs font-bold mb-4 uppercase tracking-widest">{currentIndex + 1} / {words.length}</p>
            <h2 className="text-5xl font-bold text-gray-900 mb-2">{words[currentIndex].word}</h2>
            <p className="text-blue-500 font-bold text-sm uppercase">[{words[currentIndex].partOfSpeech}]</p>
          </div>
          {showDetail && (
            <div className="space-y-4 text-center bg-blue-50 p-6 rounded-2xl">
              <div className="text-2xl font-bold text-gray-800">{words[currentIndex].meaning}</div>
              <div className="pt-2 border-t border-blue-100">
                <p className="text-gray-600 italic text-sm mb-1">"{words[currentIndex].example}"</p>
                {words[currentIndex].exampleJp && <p className="text-gray-400 text-xs">{words[currentIndex].exampleJp}</p>}
              </div>
            </div>
          )}
          <div className="flex gap-4 w-full mt-8">
            <button onClick={() => setShowDetail(!showDetail)} className="flex-1 py-4 bg-gray-200 rounded-xl font-bold">{showDetail ? "Hide" : "Answer"}</button>
            <button onClick={nextCard} className="flex-1 py-4 bg-black text-white rounded-xl font-bold shadow-lg">Next</button>
          </div>
        </div>
      ) : (
        <Link href="/add" className="text-blue-500 font-bold underline">最初の単語を登録する</Link>
      )}
      <Link href="/add" className="mt-10 text-gray-400 text-sm font-medium">＋ 一括登録・追加</Link>
    </main>
  );
}