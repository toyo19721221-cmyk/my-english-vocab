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

  const deleteWord = (id: number) => {
    if (confirm("この単語を削除しますか？")) {
      const updated = words.filter(w => w.id !== id);
      saveToStorage(updated);
      if (currentIndex >= updated.length && updated.length > 0) setCurrentIndex(0);
    }
  };

  const toggleLearned = (id: number) => {
    const updated = words.map(w => w.id === id ? { ...w, isLearned: !w.isLearned } : w);
    saveToStorage(updated);
  };

  return (
    /* flex items-center justify-center で要素を画面のど真ん中に固定します */
    <main className="min-h-screen bg-gray-50 flex items-center justify-center w-full p-4 text-black font-sans">
      <div className="w-full max-w-md flex flex-col items-center">
        <h1 className="text-4xl font-black mb-8 tracking-tighter italic">VOCAB MASTER</h1>
        
        <button 
          onClick={() => { setHideLearned(!hideLearned); setCurrentIndex(0); }}
          className={`mb-10 px-6 py-2 rounded-full text-xs font-bold border-2 transition-all ${
            hideLearned ? "bg-black text-white border-black" : "bg-white text-gray-400 border-gray-200 shadow-sm"
          }`}
        >
          {hideLearned ? "✓ 習得済みを非表示中" : "習得済みを表示中"}
        </button>

        {displayWords.length > 0 ? (
          <div className="bg-white w-full rounded-[2.5rem] shadow-2xl p-10 flex flex-col items-center relative border border-gray-100 min-h-[550px]">
            {/* 🗑️ 削除ボタン */}
            <button 
              onClick={() => deleteWord(displayWords[currentIndex].id)}
              className="absolute top-8 right-8 text-gray-200 hover:text-red-500 transition-colors p-2"
              title="削除"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>

            <span className="text-gray-300 text-[10px] font-black tracking-[0.2em] mb-4">
              {currentIndex + 1} / {displayWords.length}
            </span>

            <button 
              onClick={() => toggleLearned(displayWords[currentIndex].id)}
              className={`mb-8 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest transition-all ${
                displayWords[currentIndex].isLearned ? "bg-green-500 text-white shadow-lg shadow-green-100" : "bg-gray-100 text-gray-400"
              }`}
            >
              {displayWords[currentIndex].isLearned ? "✓ LEARNED" : "NOT LEARNED"}
            </button>

            <h2 className="text-5xl font-black text-gray-900 mb-2 text-center break-all leading-tight">
              {displayWords[currentIndex].word}
            </h2>
            <p className="text-blue-500 font-bold text-xs mb-10 tracking-[0.15em] uppercase">
              [{displayWords[currentIndex].partOfSpeech}]
            </p>

            <div className="w-full flex-grow flex flex-col justify-center min-h-[180px]">
              {showDetail ? (
                <div className="space-y-6">
                  <div className="text-3xl font-bold text-gray-800 text-center border-b-2 border-blue-500 pb-2 inline-block mx-auto">
                    {displayWords[currentIndex].meaning}
                  </div>
                  <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                    <p className="text-gray-600 italic text-sm text-center mb-2 leading-relaxed">
                      "{displayWords[currentIndex].example}"
                    </p>
                    {displayWords[currentIndex].exampleJp && (
                      <p className="text-gray-400 text-xs text-center font-medium">
                        {displayWords[currentIndex].exampleJp}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <p className="text-gray-200 text-[10px] font-bold tracking-widest">TAP ANSWER TO REVEAL</p>
                </div>
              )}
            </div>

            <div className="w-full flex gap-4 mt-8">
              <button 
                onClick={() => setShowDetail(!showDetail)} 
                className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-bold hover:bg-gray-200 transition-colors"
              >
                {showDetail ? "Hide" : "Answer"}
              </button>
              <button 
                onClick={nextCard} 
                className="flex-1 py-4 bg-black text-white rounded-2xl font-bold shadow-xl hover:opacity-80 active:scale-95 transition-all"
              >
                Next
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center p-12 bg-white rounded-3xl shadow-xl border border-gray-100">
            <p className="text-gray-400 font-medium mb-6">表示できる単語がありません</p>
            <Link href="/add" className="bg-blue-500 text-white px-8 py-3 rounded-xl font-bold inline-block shadow-lg shadow-blue-100">
              単語を登録する
            </Link>
          </div>
        )}
        
        <Link href="/add" className="mt-12 text-gray-400 text-[10px] font-black tracking-widest hover:text-black transition-colors uppercase">
          ＋ 一括登録・追加
        </Link>
      </div>
    </main>
  );
}