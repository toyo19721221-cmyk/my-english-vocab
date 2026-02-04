/**
 * @version 1.3.0
 * @description レイアウトの調整：コンテンツの繰り上げとバージョン表記の最下部移動
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
    if (saved) setWords(JSON.parse(saved));
  }, []);

  const saveToStorage = (updatedWords: Word[]) => {
    setWords(updatedWords);
    localStorage.setItem("my-app-data", JSON.stringify(updatedWords));
  };

  const nextCard = () => {
    setShowDetail(false);
    if (words.length > 0) setCurrentIndex((prev) => (prev + 1) % words.length);
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
    <main style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', color: 'black', fontFamily: 'sans-serif', position: 'relative' }}>
      
      {/* メインコンテンツエリア：上部に配置 */}
      <div style={{ width: '100%', maxWidth: '400px', textAlign: 'center', marginTop: '10px' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 'bold', marginBottom: '15px', letterSpacing: '0.05em' }}>VOCAB MASTER</h1>

        {words.length > 0 ? (
          <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '30px', boxShadow: '0 8px 20px rgba(0,0,0,0.08)', minHeight: '420px', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
            
            <button onClick={() => deleteWord(words[currentIndex].id)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', cursor: 'pointer', color: '#d1d5db', padding: '5px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>

            <div style={{ marginBottom: '8px', color: '#9ca3af', fontSize: '11px', fontWeight: 'bold' }}>{currentIndex + 1} / {words.length}</div>

            <button onClick={() => toggleLearned(words[currentIndex].id)} style={{ marginBottom: '15px', padding: '4px 10px', borderRadius: '20px', border: 'none', fontSize: '9px', fontWeight: 'bold', backgroundColor: words[currentIndex].isLearned ? '#22c55e' : '#f3f4f6', color: words[currentIndex].isLearned ? 'white' : '#9ca3af', cursor: 'pointer' }}>
              {words[currentIndex].isLearned ? "✓ LEARNED" : "NOT LEARNED"}
            </button>

            <h2 style={{ fontSize: '2.2rem', fontWeight: '900', margin: '5px 0', wordBreak: 'break-word' }}>{words[currentIndex].word}</h2>
            <p style={{ color: '#3b82f6', fontWeight: 'bold', marginBottom: '20px', fontSize: '13px' }}>[{words[currentIndex].partOfSpeech}]</p>

            <div style={{ flexGrow: 1, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
              {showDetail ? (
                <div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '10px', color: '#1f2937' }}>{words[currentIndex].meaning}</div>
                  <div style={{ fontSize: '13px', color: '#6b7280', fontStyle: 'italic', lineHeight: '1.4' }}>"{words[currentIndex].example}"</div>
                </div>
              ) : (
                <div style={{ color: '#d1d5db', fontSize: '11px', letterSpacing: '0.1em', fontWeight: 'bold' }}>TAP ANSWER TO REVEAL</div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '10px', width: '100%', marginTop: '20px' }}>
              <button onClick={() => setShowDetail(!showDetail)} style={{ flex: 1, padding: '14px', borderRadius: '15px', border: 'none', backgroundColor: '#f3f4f6', fontWeight: 'bold', color: '#4b5563', cursor: 'pointer' }}>{showDetail ? "Hide" : "Answer"}</button>
              <button onClick={nextCard} style={{ flex: 1, padding: '14px', borderRadius: '15px', border: 'none', backgroundColor: 'black', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>Next</button>
            </div>
          </div>
        ) : (
          <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '24px' }}>
            <p style={{ color: '#9ca3af', marginBottom: '20px' }}>単語が登録されていません</p>
            <Link href="/add" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 'bold' }}>＋ 単語を追加する</Link>
          </div>
        )}
        
        <Link href="/add" style={{ marginTop: '20px', display: 'inline-block', color: '#9ca3af', fontSize: '12px', textDecoration: 'none', borderBottom: '1px solid #e5e7eb' }}>＋ 一括登録・管理</Link>
      </div>

      {/* バージョン表記：最下部に固定 */}
      <footer style={{ marginTop: 'auto', padding: '20px 0', color: '#d1d5db', fontSize: '10px', fontWeight: 'bold', letterSpacing: '0.05em' }}>
        VOCAB MASTER Ver 1.3.0
      </footer>
    </main>
  );
}