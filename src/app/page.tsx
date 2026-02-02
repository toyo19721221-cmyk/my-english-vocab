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
  
  // 一括登録用のテキストエリアの状態
  const [bulkInput, setBulkInput] = useState('');
  const [showBulkInput, setShowBulkInput] = useState(false);

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
      // 初期データ
      const initialData = [
        { id: 1, word: 'consistency', meaning: '一貫性' },
        { id: 2, word: 'resilience', meaning: '回復力・弾力性' },
      ];
      setWords(initialData);
      localStorage.setItem('my-vocab-data', JSON.stringify(initialData));
    }
  }, []);

  // 2. データの保存
  useEffect(() => {
    if (words.length > 0) {
      localStorage.setItem('my-vocab-data', JSON.stringify(words));
    }
  }, [words]);

  // 単語追加（個別）
  const addWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWord || !newMeaning) return;
    const word: Word = {
      id: Date.now(),
      word: newWord,
      meaning: newMeaning
    };
    setWords([...words, word]);
    setNewWord('');
    setNewMeaning('');
  };

  // ★一括登録機能
  const handleBulkAdd = () => {
    if (!bulkInput.trim()) return;

    const lines = bulkInput.trim().split('\n');
    const newWords: Word[] = [];

    lines.forEach((line) => {
      // カンマ（,）またはタブ、あるいは読点（、）で区切られていると想定
      const parts = line.split(/[,\t、]/);
      if (parts.length >= 2) {
        newWords.push({
          id: Date.now() + Math.random(),
          word: parts[0].trim(),
          meaning: parts[1].trim()
        });
      }
    });

    if (newWords.length > 0) {
      setWords([...words, ...newWords]);
      setBulkInput('');
      setShowBulkInput(false);
      alert(`${newWords.length}件の単語を追加しました！`);
    } else {
      alert("形式が正しくありません。「単語,意味」の形式で入力してください。");
    }
  };

  const nextCard = () => {
    setShowMeaning(false);
    setCurrentIndex((prev) => (prev + 1) % words.length);
  };

  const deleteWord = (id: number) => {
    if (words.length <= 1) {
      alert("最後の1枚は削除できません。");
      return;
    }
    const updated = words.filter(w => w.id !== id);
    setWords(updated);
    if (currentIndex >= updated.length) {
      setCurrentIndex(0);
    }
  };

  if (words.length === 0) return <div className="p-8">読み込み中...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-blue-600 mb-2">Vocab Master</h1>
          <p className="text-gray-500 text-sm tracking-widest uppercase">Self-Learning App</p>
        </div>

        {/* カード部分 */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 text-center min-h-[300px] flex flex-col justify-between border border-gray-100">
          <p className="text-blue-400 font-bold text-xs tracking-widest uppercase mb-4">
            Card {currentIndex + 1} / {words.length}
          </p>
          
          <div className="flex-grow flex flex-col justify-center py-8">
            <h2 className="text-5xl font-bold text-gray-800 mb-6">
              {words[currentIndex].word}
            </h2>
            {showMeaning && (
              <p className="text-2xl text-blue-500 font-medium animate-bounce">
                {words[currentIndex].meaning}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <button
              onClick={() => setShowMeaning(!showMeaning)}
              className="py-4 px-6 rounded-2xl border-2 border-blue-500 text-blue-500 font-bold hover:bg-blue-50 transition-all active:scale-95"
            >
              意味を見る
            </button>
            <button
              onClick={nextCard}
              className="py-4 px-6 rounded-2xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
            >
              次のカード
            </button>
          </div>
        </div>

        {/* 登録セクション */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-700">新しい単語を登録</h3>
            <button 
              onClick={() => setShowBulkInput(!showBulkInput)}
              className="text-xs text-blue-600 underline"
            >
              {showBulkInput ? "個別登録に戻る" : "リストから一括登録"}
            </button>
          </div>

          {!showBulkInput ? (
            <form onSubmit={addWord} className="space-y-3">
              <input
                type="text"
                placeholder="英単語"
                value={newWord}
                onChange={(e) => setNewWord(e.target.value)}
                className="w-full p-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                type="text"
                placeholder="意味"
                value={newMeaning}
                onChange={(e) => setNewMeaning(e.target.value)}
                className="w-full p-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button className="w-full py-3 bg-gray-800 text-white rounded-xl font-bold hover:bg-gray-900 transition-all">
                登録する
              </button>
            </form>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-gray-400">「単語,意味」の形式で1行ずつ入力してください</p>
              <textarea
                placeholder="apple,りんご&#10;banana,バナナ"
                value={bulkInput}
                onChange={(e) => setBulkInput(e.target.value)}
                rows={5}
                className="w-full p-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              />
              <button 
                onClick={handleBulkAdd}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all"
              >
                一括で追加する
              </button>
            </div>
          )}
        </div>

        {/* 単語リスト一覧 */}
        <div className="mt-8">
          <h3 className="font-bold text-gray-600 mb-4 px-2">登録済みリスト</h3>
          <div className="space-y-2">
            {words.map((w) => (
              <div key={w.id} className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
                <div>
                  <span className="font-bold text-gray-800">{w.word}</span>
                  <span className="mx-2 text-gray-300">|</span>
                  <span className="text-gray-500 text-sm">{w.meaning}</span>
                </div>
                <button 
                  onClick={() => deleteWord(w.id)}
                  className="text-red-400 hover:text-red-600 p-2"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}