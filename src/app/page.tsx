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
    if (confirm("この単語を削除してもよろしいですか？")) {
      const updated = words.filter(w => w.id !== id);
      saveToStorage(updated);
      if (currentIndex >= updated.length && updated.length > 0) {
        setCurrentIndex(0);
      }
    }
  };

  const toggleLearned = (id: number) => {
    const updated = words.map(w => 
      w.id === id ? { ...w, isLearned: !w.isLearned } : w
    );
    saveToStorage(updated);
  };

  return (
    <main className="min-h-screen bg-gray-50 p-6 flex flex-col items-center justify-center text-black font-sans">
      <h1 className="text-3xl font-black mb-4 tracking-tighter">VOCAB MASTER</h1>
      
      <div className="mb-6">
        <button 
          onClick={() => {
            setHideLearned(!hideLearned);
            setCurrentIndex(0);
          }}
          className={`px-4 py-2 rounded-full text-xs font-bold border-2 transition-all ${
            hideLearned ? "bg-black text-white border-black" : "bg-white text-gray-400 border-gray-200"
          }`}
        >
          {hideLearned ? "✓ 習得済みを非表示中" : "習得済みを表示中"}
        </button>
      </div>

      {displayWords.length > 0 ? (
        <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-sm min-h-[500px] flex flex-col justify-between border border-gray-100 relative">
          
          <button 
            onClick={() => deleteWord(displayWords[currentIndex].id)}
            className="absolute top-6 right-6 text-gray-200 hover:text-red-500 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>

          <div className="text-center mt-4">
            <p className="text-gray-300 text-[10px] font-bold mb-4 uppercase tracking-[0.2em]">
              {currentIndex + 1} / {displayWords.length}
            </p>
            
            <button 
              onClick={() => toggleLearned(displayWords[currentIndex].id)}
              className={`mb-6 inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest transition-all ${
                displayWords[currentIndex].isLearned 
                  ? "bg-green-500 text-white shadow-lg shadow-green-100" 
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {displayWords[currentIndex].isLearned ? "✓ LEARNED" : "NOT LEARNED"}
            </button>

            <h2 className="text-5xl font-extrabold text-gray-900 mb-2 break-all">{displayWords[currentIndex].word}</h2>
            <p className="text-blue-500 font-bold text-xs uppercase tracking-widest italic">
              {displayWords[currentIndex].partOfSpeech}
            </p>
          </div>

          <div className="min-h-[160px] flex items-center justify-center">
            {showDetail && (
              <div className="w-full space-y-5 text-center animate-in fade-in zoom-in duration-300">
                <div className="text-3xl font-bold text-gray-800 border-b-2 border-blue-500 pb-2 inline-block">
                  {displayWords[currentIndex].meaning}
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <p className="text-gray-600 italic text-sm mb-2 leading-relaxed">
                    "{displayWords[currentIndex].example}"
                  </p>
                  {displayWords[currentIndex].exampleJp && (
                    <p className="text-gray-400 text-xs font-medium">
                      {displayWords[currentIndex].exampleJp}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-4 w-full mt-8">
            <button 
              onClick={() => setShowDetail(!showDetail)} 
              className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-colors"
            >
              {showDetail ? "Hide" : "Answer"}
            </button>
            <button 
              onClick={nextCard} 
              className="flex-1 py-4 bg-black text-white rounded-2xl font-bold shadow-xl hover:bg-gray-800 transition-all active:scale-95"
            >
              Next
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
          <p className="mb-6 text-gray-400 font-medium">表示できる単語がありません</p>
          <Link href="/add" className="bg-blue-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-100 inline-block hover:bg-blue-600 transition-all">
            単語を登録する
          </Link>
        </div>
      )}
      
      <Link href="/add" className="mt-12 text-gray-400 text-xs font-bold hover:text-black transition-colors uppercase tracking-widest">
        ＋ 一括登録・追加
      </Link>
    </main>
  );
}