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
  isLearned?: boolean; // 習得済みフラグを追加
}

export default function StudyPage() {
  const [words, setWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDetail, setShowDetail] = useState(false);
  const [hideLearned, setHideLearned] = useState(false); // 習得済みを隠す設定

  useEffect(() => {
    const saved = localStorage.getItem("my-app-data");
    if (saved) setWords(JSON.parse(saved));
  }, []);

  // ローカルストレージへの保存用関数
  const saveToStorage = (updatedWords: Word[]) => {
    setWords(updatedWords);
    localStorage.setItem("my-app-data", JSON.stringify(updatedWords));
  };

  // 表示する単語をフィルター（習得済みを隠す設定がONなら未習得のみ抽出）
  const displayWords = hideLearned 
    ? words.filter(w => !w.isLearned) 
    : words;

  const nextCard = () => {
    setShowDetail(false);
    if (displayWords.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % displayWords.length);
    }
  };

  // 削除機能
  const deleteWord = (id: number) => {
    if (confirm("この単語を削除してもよろしいですか？")) {
      const updated = words.filter(w => w.id !== id);
      saveToStorage(updated);
      if (currentIndex >= updated.length && updated.length > 0) {
        setCurrentIndex(0);
      }
    }
  };

  // 習得済み切り替え機能
  const toggleLearned = (id: number) => {
    const updated = words.map(w => 
      w.id === id ? { ...w, isLearned: !w.isLearned } : w
    );
    saveToStorage(updated);
  };

  return (
    <main className="min-h-screen bg-white p-6 flex flex-col items-center justify-center text-black">
      <h1 className="text-3xl font-black mb-4 tracking-tighter">VOCAB MASTER</h1>
      
      {/* 習得済み非表示切り替えボタン */}
      <div className="mb-6">
        <button 
          onClick={() => {
            setHideLearned(!hideLearned);
            setCurrentIndex(0);
          }}
          className={`px-4 py-2 rounded-full text-xs font-bold border-2 transition ${
            hideLearned ? "bg-black text-white border-black" : "bg-white text-gray-400 border-gray-200"
          }`}
        >
          {hideLearned ? "✓ 習得済みを非表示中" : "習得済みを表示中"}
        </button>
      </div>

      {displayWords.length > 0 ? (
        <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-sm min-h-[500px] flex flex-col justify-between border border-gray-100 relative">
          
          {/* 削除ボタン (右上のゴミ箱) */}
          <button 
            onClick={() => deleteWord(displayWords[currentIndex].id)}
            className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition"
            title="削除"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>

          <div className="text-center mt-4">
            <p className="text-gray-300 text-xs font-bold mb-4 uppercase tracking-widest">
              {currentIndex + 1} / {displayWords.length}
            </p>
            
            {/* 習得済みチェックマーク */}
            <button 
              onClick={() => toggleLearned(displayWords[currentIndex].id)}
              className={`mb-4 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black transition ${
                displayWords[currentIndex].isLearned 
                  ? "bg-green-100 text-green-600" 
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {displayWords[currentIndex].isLearned ? "✓ LEARNED" : "NOT LEARNED"}
            </button>

            <h2 className="text-5xl font-bold text-gray-900 mb-2">{displayWords[currentIndex].word}</h2>
            <p className="text-blue-500 font-bold text-sm uppercase">[{displayWords[currentIndex].partOfSpeech}]</p>
          </div>

          {showDetail && (
            <div className="space-y-4 text-center bg-blue-50 p-6 rounded-2xl">
              <div className="text-2xl font-bold text-gray-800">{displayWords[currentIndex].meaning}</div>
              <div className="pt-2 border-t border-blue-100">
                <p className="text-gray-600 italic text-sm mb-1">"{displayWords[currentIndex].example}"</p>
                {displayWords[currentIndex].exampleJp && <p className="text-gray-400 text-xs">{displayWords[currentIndex].exampleJp}</p>}
              </div>
            </div>
          )}

          <div className="flex gap-4 w-full mt-8">
            <button onClick={() => setShowDetail(!showDetail)} className="flex-1 py-4 bg-gray-200 rounded-xl font-bold">
              {showDetail ? "Hide" : "Answer"}
            </button>
            <button onClick={nextCard} className="flex-1 py-4 bg-black text-white rounded-xl font-bold shadow-lg">
              Next
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <p className="mb-4 text-gray-500 text-lg">表示できる単語がありません</p>
          <Link href="/add" className="text-blue-500 font-bold underline">新しい単語を登録する</Link>
          {hideLearned && (
            <button 
              onClick={() => setHideLearned(false)}
              className="block mt-4 text-sm text-gray-400 underline w-full"
            >
              習得済みを表示に戻す
            </button>
          )}
        </div>
      )}
      <Link href="/add" className="mt-10 text-gray-400 text-sm font-medium">＋ 一括登録・追加</Link>
    </main>
  );
}