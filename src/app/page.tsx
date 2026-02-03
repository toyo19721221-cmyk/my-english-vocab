"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Word {
  id: number;
  word: string;
  partOfSpeech: string;
  meaning: string;
  example: string;
  exampleJp: string;
}

export default function StudyPage() {
  const [words, setWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    const savedWords = localStorage.getItem("vocab-words");
    if (savedWords) {
      try {
        setWords(JSON.parse(savedWords));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const nextCard = () => {
    setShowDetail(false);
    if (words.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % words.length);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-6 flex flex-col items-center justify-center font-sans">
      <h1 className="text-4xl font-black text-black mb-12 tracking-tighter text-center">VOCAB MASTER</h1>
      {words.length > 0 ? (
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-3xl shadow-2xl p-10 min-h-[450px] flex flex-col items-center justify-between border border-gray-100">
            <div className="text-center w-full">
              <p className="text-gray-300 text-xs font-bold mb-8 uppercase tracking-widest">{currentIndex + 1} / {words.length}</p>
              <h2 className="text-5xl font-bold text-gray-900 mb-2">{words[currentIndex].word}</h2>
              <p className="text-blue-500 font-bold text-sm uppercase">[{words[currentIndex].partOfSpeech || "N/A"}]</p>
            </div>
            {showDetail && (
              <div className="space-y-6 text-center w-full">
                <div className="text-2xl font-bold text-gray-800 py-2 border-y border-gray-50">{words[currentIndex].meaning}</div>
                <div className="text-left bg-gray-50 p-4 rounded-xl">
                  <p className="text-gray-600 italic text-sm mb-1">"{words[currentIndex].example}"</p>
                  <p className="text-gray-400 text-xs">{words[currentIndex].exampleJp}</p>
                </div>
              </div>
            )}
            <div className="flex gap-3 w-full mt-8">
              <button onClick={() => setShowDetail(!showDetail)} className="flex-1 py-4 bg-gray-100 text-gray-900 rounded-2xl font-bold hover:bg-gray-200 transition">
                {showDetail ? "Hide" : "Answer"}
              </button>
              <button onClick={nextCard} className="flex-1 py-4 bg-black text-white rounded-2xl font-bold hover:bg-gray-800 transition">Next</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center p-10 bg-white rounded-3xl shadow-sm">
          <p className="text-gray-400 mb-6">まだ単語がありません</p>
        </div>
      )}
      <Link href="/add" className="mt-12 text-gray-400 hover:text-black font-bold text-sm transition border-b border-gray-300 pb-1">
        ＋ 新しい単語を登録する
      </Link>
    </main>
  );
}