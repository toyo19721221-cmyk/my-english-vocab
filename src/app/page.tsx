/**
 * @version 1.4.3
 * @description 【学習用】学習済み非表示 + シャッフル機能搭載
 */
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Word {
  id: number; word: string; partOfSpeech: string; meaning: string; example: string; exampleJp?: string; isLearned?: boolean;
}

export default function StudyPage() {
  const [words, setWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("my-app-data");
    if (saved) {
      const parsed = JSON.parse(saved);
      // 初回読み込み時にシャッフルしてセット
      setWords(parsed.sort(() => Math.random() - 0.5));
    }
  }, []);

  // 未学習単語のみ抽出
  const activeWords = words.filter(w => !w.isLearned);

  const saveToStorage = (updatedWords: Word[]) => {
    setWords(updatedWords);
    localStorage.setItem("my-app-data", JSON.stringify(updatedWords));
  };

  const nextCard = () => {
    setShowDetail(false);
    if (activeWords.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % activeWords.length);
    }
  };

  const toggleLearned = (id: number) => {
    const updated = words.map(w => w.id === id ? { ...w, isLearned: true } : w);
    saveToStorage(updated);
    setShowDetail(false);
    if (currentIndex >= activeWords.length - 1) setCurrentIndex(0);
  };

  const resetAll = () => {
    const reset = words.map(w => ({ ...w, isLearned: false })).sort(() => Math.random() - 0.5);
    saveToStorage(reset);
    setCurrentIndex(0);
  };

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 20px', color: 'black' }}>
      <div style={{ width: '100%', maxWidth: '400px', textAlign: 'center', marginTop: '10px' }}>
        {activeWords.length > 0 ? (
          <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '30px', boxShadow: '0 8px 20px rgba(0,0,0,0.08)', minHeight: '420px', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
            <div style={{ marginBottom: '8px', color: '#9ca3af', fontSize: '11px', fontWeight: 'bold' }}>
              未学習: {currentIndex + 1} / {activeWords.length}
            </div>

            <button onClick={() => toggleLearned(activeWords[currentIndex].id)} style={{ marginBottom: '15px', padding: '6px 14px', borderRadius: '20px', border: '1px solid #e5e7eb', fontSize: '10px', fontWeight: 'bold', backgroundColor: '#f3f4f6', color: '#9ca3af', cursor: 'pointer' }}>
              MARK AS LEARNED
            </button>

            <h2 style={{ fontSize: '2.4rem', fontWeight: '900', margin: '5px 0' }}>{activeWords[currentIndex].word}</h2>
            <p style={{ color: '#3b82f6', fontWeight: 'bold', marginBottom: '20px', fontSize: '14px' }}>[{activeWords[currentIndex].partOfSpeech}]</p>

            <div style={{ flexGrow: 1, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {showDetail ? (
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '10px' }}>{activeWords[currentIndex].meaning}</div>
                  <div style={{ fontSize: '13px', color: '#6b7280', fontStyle: 'italic' }}>"{activeWords[currentIndex].example}"</div>
                  {activeWords[currentIndex].exampleJp && <div style={{ fontSize: '12px', color: '#9ca3af' }}>（{activeWords[currentIndex].exampleJp}）</div>}
                </div>
              ) : (
                <div style={{ color: '#d1d5db', fontSize: '11px', fontWeight: 'bold' }}>TAP ANSWER TO REVEAL</div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '10px', width: '100%', marginTop: '20px' }}>
              <button onClick={() => setShowDetail(!showDetail)} style={{ flex: 1, padding: '14px', borderRadius: '15px', border: 'none', backgroundColor: '#f3f4f6', fontWeight: 'bold', cursor: 'pointer' }}>{showDetail ? "Hide" : "Answer"}</button>
              <button onClick={nextCard} style={{ flex: 1, padding: '14px', borderRadius: '15px', border: 'none', backgroundColor: 'black', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>Next</button>
            </div>
          </div>
        ) : (
          <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '24px', marginTop: '20px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>🎉 Perfect!</h2>
            <p style={{ color: '#6b7280', margin: '20px 0', fontSize: '14px' }}>すべての単語をマスターしました！</p>
            <button onClick={resetAll} style={{ width: '100%', padding: '12px', backgroundColor: 'black', color: 'white', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>もう一度学習する（シャッフル）</button>
          </div>
        )}
        <Link href="/add" style={{ marginTop: '20px', display: 'inline-block', color: '#9ca3af', fontSize: '12px', textDecoration: 'none' }}>＋ 一括登録・管理</Link>
      </div>
      <footer style={{ marginTop: 'auto', padding: '20px 0', color: '#d1d5db', fontSize: '10px' }}>VOCAB MASTER v1.4.3</footer>
    </main>
  );
}