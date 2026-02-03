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
  const [hideLearned, setHideLearned] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("my-app-data");
    if (saved) setWords(JSON.parse(saved));
  }, []);

  const saveToStorage = (updatedWords: Word[]) => {
    setWords(updatedWords);
    localStorage.setItem("my-app-data", JSON.stringify(updatedWords));
  };

  const displayWords = hideLearned ? words.filter(w => !w.isLearned) : words;

  const nextCard = () => {
    setShowDetail(false);
    if (displayWords.length > 0) setCurrentIndex((prev) => (prev + 1) % displayWords.length);
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
    /* 🎨 強制中央寄せ設定 */
    <main style={{ minHeight: '100vh', backgroundColor: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'sans-serif', color: 'black' }}>
      <div style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '30px', fontStyle: 'italic' }}>VOCAB MASTER</h1>
        
        <button 
          onClick={() => { setHideLearned(!hideLearned); setCurrentIndex(0); }}
          style={{ marginBottom: '40px', padding: '10px 25px', borderRadius: '50px', fontSize: '12px', fontWeight: 'bold', border: '2px solid #e5e7eb', backgroundColor: hideLearned ? 'black' : 'white', color: hideLearned ? 'white' : '#9ca3af', cursor: 'pointer' }}
        >
          {hideLearned ? "✓ 習得済みを非表示中" : "習得済みを表示中"}
        </button>

        {displayWords.length > 0 ? (
          /* 🎨 強制カードデザイン */
          <div style={{ backgroundColor: 'white', borderRadius: '40px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)', padding: '40px', position: 'relative', border: '1px solid #f3f4f6', minHeight: '500px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            
            <button onClick={() => deleteWord(displayWords[currentIndex].id)} style={{ position: 'absolute', top: '30px', right: '30px', color: '#e5e7eb', background: 'none', border: 'none', cursor: 'pointer' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>

            <span style={{ color: '#d1d5db', fontSize: '10px', fontWeight: '900', letterSpacing: '0.2em', marginBottom: '15px' }}>{currentIndex + 1} / {displayWords.length}</span>

            <button onClick={() => toggleLearned(displayWords[currentIndex].id)} style={{ marginBottom: '30px', padding: '6px 15px', borderRadius: '50px', fontSize: '10px', fontWeight: '900', border: 'none', backgroundColor: displayWords[currentIndex].isLearned ? '#22c55e' : '#f3f4f6', color: displayWords[currentIndex].isLearned ? 'white' : '#9ca3af', cursor: 'pointer' }}>
              {displayWords[currentIndex].isLearned ? "✓ LEARNED" : "NOT LEARNED"}
            </button>

            <h2 style={{ fontSize: '3rem', fontWeight: '900', color: '#111827', margin: '0 0 10px 0' }}>{displayWords[currentIndex].word}</h2>
            <p style={{ color: '#3b82f6', fontWeight: 'bold', fontSize: '12px', marginBottom: '40px', textTransform: 'uppercase' }}>[{displayWords[currentIndex].partOfSpeech}]</p>

            <div style={{ width: '100%', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              {showDetail ? (
                <div style={{ animation: 'fadeIn 0.3s' }}>
                  <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '20px' }}>{displayWords[currentIndex].meaning}</div>
                  <div style={{ backgroundColor: '#f9fafb', padding: '20px', borderRadius: '20px', fontSize: '14px', color: '#4b5563', fontStyle: 'italic' }}>
                    "{displayWords[currentIndex].example}"
                  </div>
                </div>
              ) : (
                <p style={{ color: '#e5e7eb', fontSize: '10px', fontWeight: 'bold', letterSpacing: '0.1em' }}>TAP ANSWER TO REVEAL</p>
              )}
            </div>

            <div style={{ width: '100%', display: 'flex', gap: '15px', marginTop: '30px' }}>
              <button onClick={() => setShowDetail(!showDetail)} style={{ flex: 1, padding: '15px', backgroundColor: '#f3f4f6', border: 'none', borderRadius: '15px', fontWeight: 'bold', color: '#6b7280', cursor: 'pointer' }}>{showDetail ? "Hide" : "Answer"}</button>
              <button onClick={nextCard} style={{ flex: 1, padding: '15px', backgroundColor: 'black', border: 'none', borderRadius: '15px', fontWeight: 'bold', color: 'white', cursor: 'pointer' }}>Next</button>
            </div>
          </div>
        ) : (
          <div style={{ backgroundColor: 'white', padding: '50px', borderRadius: '30px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
            <p style={{ color: '#9ca3af', marginBottom: '20px' }}>表示できる単語がありません</p>
            <Link href="/add" style={{ backgroundColor: '#3b82f6', color: 'white', padding: '12px 25px', borderRadius: '12px', textDecoration: 'none', fontWeight: 'bold', display: 'inline-block' }}>単語を登録する</Link>
          </div>
        )}
        
        <Link href="/add" style={{ marginTop: '50px', display: 'block', color: '#9ca3af', fontSize: '10px', fontWeight: '900', textDecoration: 'none', letterSpacing: '0.1em' }}>＋ 一括登録・追加</Link>
      </div>
    </main>
  );
}