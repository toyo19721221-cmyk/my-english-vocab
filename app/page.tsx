"use client";

import React, { useState, useEffect } from 'react';

// 単語のデータ構造を定義
interface Word {
  id: number;
  word: string;
  meaning: string;
}

export default function FlashcardApp() {
  const [words, setWords] = useState<Word[]>([]);
  const [newWord, setNewWord] = useState('');
  const [newMeaning, setNewMeaning] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMeaning, setShowMeaning] = useState(false);

  // 1. 保存されたデータの読み込み
  useEffect(() => {
    const saved = localStorage.getItem('my-vocab-data');
    if (saved) {
      try {
        setWords(JSON.parse(saved));
      } catch (e) {
        console.error("データの読み込みに失敗しました", e);
      }
    } else {
      // 初期データ（初めて開いた時用）
      setWords([
        { id: 1, word: 'consistency', meaning: '一貫性' },
        { id: 2, word: 'resilience', meaning: '回復力・弾力性' },
      ]);
    }
  }, []);

  // 2. データの自動保存
  useEffect(() => {
    if (words.length > 0) {
      localStorage.setItem('my-vocab-data', JSON.stringify(words));
    }
  }, [words]);

  // 単語追加
  const addWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWord.trim() || !newMeaning.trim()) return;
    
    const newEntry: Word = {
      id: Date.now(),
      word: newWord.trim(),
      meaning: newMeaning.trim(),
    };
    
    setWords([...words, newEntry]);
    setNewWord('');
    setNewMeaning('');
  };

  // 単語削除
  const deleteWord = (id: number) => {
    if (confirm("この単語をリストから削除しますか？")) {
      const updated = words.filter(w => w.id !== id);
      setWords(updated);
      if (currentIndex >= updated.length && currentIndex > 0) {
        setCurrentIndex(updated.length - 1);
      }
    }
  };

  // 次のカードへ
  const nextCard = () => {
    setShowMeaning(false);
    if (words.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % words.length);
    }
  };

  // 音声再生 (Web Speech API)
  const playVoice = (text: string) => {
    if ('speechSynthesis' in window) {
      const uttr = new SpeechSynthesisUtterance(text);
      uttr.lang = 'en-US';
      uttr.rate = 0.9; // 少しゆっくりめに再生
      window.speechSynthesis.speak(uttr);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-800">
      <div className="max-w-md mx-auto space-y-6">
        <header className="text-center">
          <h1 className="text-3xl font-extrabold text-indigo-600 tracking-tight">Vocab Master</h1>
          <p className="text-slate-400 text-xs mt-1 uppercase tracking-widest font-semibold">Self-Learning App</p>
        </header>

        {/* クイズカードセクション */}
        {words.length > 0 ? (
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-indigo-50 text-center relative overflow-hidden">
            {/* プログレスバー */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-100">
              <div 
                className="h-full bg-indigo-500 transition-all duration-500 ease-out" 
                style={{ width: `${((currentIndex + 1) / words.length) * 100}%` }}
              ></div>
            </div>

            <div className="text-xs font-bold text-indigo-300 mb-6 tracking-widest mt-2">
              CARD {currentIndex + 1} / {words.length}
            </div>
            
            <div className="flex flex-col items-center justify-center min-h-[12rem]">
              <div className="text-5xl font-bold mb-4 text-slate-800 break-words w-full">
                {words[currentIndex]?.word}
              </div>
              
              <button 
                onClick={() => playVoice(words[currentIndex].word)}
                className="mb-6 p-3 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 active:scale-95 transition-all"
                aria-label="音声を聞く"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              </button>

              <div className={`text-2xl text-emerald-600 font-semibold min-h-[2rem] transition-all duration-300 ${showMeaning ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                {words[currentIndex]?.meaning}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8">
              <button 
                onClick={() => setShowMeaning(!showMeaning)}
                className="py-3.5 rounded-2xl border-2 border-indigo-600 text-indigo-600 font-bold hover:bg-indigo-50 active:bg-indigo-100 transition-colors"
              >
                {showMeaning ? '隠す' : '意味を見る'}
              </button>
              <button 
                onClick={nextCard}
                className="py-3.5 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 active:scale-95 transition-all"
              >
                次のカード
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center p-12 bg-white rounded-3xl border-2 border-dashed border-slate-200 text-slate-400">
            下のフォームから単語を追加してください
          </div>
        )}

        {/* 単語追加フォーム */}
        <form onSubmit={addWord} className="bg-white p-6 rounded-2xl shadow-md border border-slate-100 space-y-3">
          <h3 className="text-sm font-bold text-slate-500 ml-1">新しい単語を登録</h3>
          <div className="space-y-2">
            <input 
              type="text" 
              placeholder="English word (e.g. apple)" 
              className="w-full p-3.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              value={newWord}
              onChange={(e) => setNewWord(e.target.value)}
            />
            <input 
              type="text" 
              placeholder="意味 (例: りんご)" 
              className="w-full p-3.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              value={newMeaning}
              onChange={(e) => setNewMeaning(e.target.value)}
            />
          </div>
          <button className="w-full bg-slate-800 text-white py-3.5 rounded-xl font-bold hover:bg-slate-900 active:scale-[0.98] transition-all mt-2">
            リストに追加する
          </button>
        </form>

        {/* 管理用リスト */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-5 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-700 text-sm">マイ単語リスト</h3>
            <span className="text-xs font-bold text-slate-400 bg-slate-200 px-2 py-0.5 rounded-full">{words.length}</span>
          </div>
          <ul className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
            {words.map(w => (
              <li key={w.id} className="p-4 flex justify-between items-center hover:bg-slate-50 transition-colors group">
                <div className="flex-1">
                  <div className="font-bold text-slate-800">{w.word}</div>
                  <div className="text-sm text-slate-500">{w.meaning}</div>
                </div>
                <button 
                  onClick={() => deleteWord(w.id)}
                  className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-red-500 transition-all"
                  title="削除"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}