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
  isLearned?: boolean;
}

export default function StudyPage() {
  const [words, setWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDetail, setShowDetail] = useState(false);
  const [hideLearned, setHideLearned] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("my-app-data");
    if (saved) setWords(JSON.parse(saved));
  }, []);

  const saveToStorage = (updatedWords: Word[]) => {
    setWords(updatedWords);
    localStorage.setItem("my-app-data", JSON.stringify(updatedWords));
  };

  const displayWords = hideLearned 
    ? words.filter(w => !w.isLearned) 
    : words;

  const nextCard = () => {
    setShowDetail(false);
    if (displayWords.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % displayWords.length);
    }
  };

  const toggleLearned = (id: number) => {
    const updated = words.map(w => w.id === id ? { ...w, isLearned: !w.isLearned } : w);
    saveToStorage(updated);
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-black font-sans">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-black mb-6 tracking-tighter text-center">VOCAB MASTER</h1>
        
        <div className="flex justify-center mb-6">
          <button 
            onClick={() => { setHideLearned(!hideLearned); setCurrentIndex(0); }}
            className={`px-6 py-2 rounded-full text-xs font-bold border-2 transition-all ${
              hideLearned ? "bg-black text-white border-black" : "bg-white text-gray-400 border-gray-200"
            }`}
          >
            {hideLearned ? "✓ 習得済みを非表示中" : "習得済みを表示中"}
          </button>
        </div>

        {displayWords.length > 0 ? (
          <div className="bg-white w-full rounded-[2.5rem] shadow-2xl p-8 flex flex-col items-center border border-gray-100 min-h-[500px]">
            <span className="text-gray-300 text-[10px] font-black tracking-[0.2em] mb-4">
              {currentIndex + 1} / {displayWords.length}
            </span>

            <button 
              onClick={() => toggleLearned(displayWords[currentIndex].id)}
              className={`mb-6 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest transition-all ${
                displayWords[currentIndex].isLearned ? "bg-green-500 text-white" : "bg-gray-100 text-gray-400"
              }`}
            >
              {displayWords[currentIndex].isLearned ? "✓ LEARNED" : "NOT LEARNED"}
            </button>

            <h2 className="text-5xl font-black text-gray-900 mb-2 text-center break-all leading-tight">
              {displayWords[currentIndex].word}
            </h2>
            
            <p className="text-blue-500 font-bold text-xs mb-8 tracking-[0.15em] uppercase">
              [{displayWords[currentIndex].partOfSpeech}]
            </p>

            {/* 表示エリアの固定 */}
            <div className="w-full flex-grow flex flex-col justify-start min-h-[200px]">
              {showDetail ? (
                <div className="space-y-6 flex flex-col items-center">
                  <div className="text-3xl font-bold text-gray-800 text-center border-b-4 border-blue-500 pb-1">
                    {displayWords[currentIndex].meaning}
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 w-full">
                    <p className="text-gray-600 italic text-sm text-center mb-2">
                      "{displayWords[currentIndex].example}"
                    </p>
                    {displayWords[currentIndex].exampleJp && (
                      <p className="text-gray-400 text-xs text-center">
                        {displayWords[currentIndex].exampleJp}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-100 rounded-3xl">
                   <p className="text-gray-200 text-[10px] font-bold tracking-widest">TAP ANSWER TO REVEAL</p>
                </div>
              )}
            </div>

            <div className="w-full flex gap-4 mt-8">
              <button 
                onClick={() => setShowDetail(!showDetail)} 
                className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-bold hover:bg-gray-200"
              >
                {showDetail ? "Hide" : "Answer"}
              </button>
              <button 
                onClick={nextCard} 
                className="flex-1 py-4 bg-black text-white rounded-2xl font-bold shadow-xl active:scale-95 transition-all"
              >
                Next
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center p-12 bg-white rounded-3xl shadow-xl">
            <p className="text-gray-400 font-medium mb-6">表示できる単語がありません</p>
            <Link href="/add" className="bg-blue-500 text-white px-8 py-3 rounded-xl font-bold inline-block">
              単語を登録する
            </Link>
          </div>
        )}
        
        <div className="text-center mt-12">
          <Link href="/add" className="text-gray-400 text-[10px] font-black tracking-widest hover:text-black transition-colors uppercase">
            ＋ 一括登録・追加
          </Link>
        </div>
      </div>
    </main>
  );
}