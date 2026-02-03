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

  const displayWords = words;

  const nextCard = () => {
    setShowDetail(false);
    if (displayWords.length > 0) setCurrentIndex((prev) => (prev + 1) % displayWords.length);
  };

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', color: 'black', fontFamily: 'sans-serif' }}>
      <div style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '20px' }}>VOCAB MASTER</h1>

        {displayWords.length > 0 ? (
          <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '40px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', minHeight: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ marginBottom: '10px', color: '#9ca3af', fontSize: '12px' }}>{currentIndex + 1} / {displayWords.length}</div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '900', margin: '10px 0' }}>{displayWords[currentIndex].word}</h2>
            <p style={{ color: '#3b82f6', fontWeight: 'bold', marginBottom: '30px' }}>[{displayWords[currentIndex].partOfSpeech}]</p>

            <div style={{ minHeight: '100px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {showDetail ? (
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '10px' }}>{displayWords[currentIndex].meaning}</div>
                  <div style={{ fontSize: '14px', color: '#6b7280', fontStyle: 'italic' }}>{displayWords[currentIndex].example}</div>
                </div>
              ) : (
                <div style={{ color: '#d1d5db', fontSize: '12px' }}>Tap Answer to Reveal</div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '10px', width: '100%', marginTop: '40px' }}>
              <button onClick={() => setShowDetail(!showDetail)} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', backgroundColor: '#e5e7eb', cursor: 'pointer' }}>Answer</button>
              <button onClick={nextCard} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', backgroundColor: 'black', color: 'white', cursor: 'pointer' }}>Next</button>
            </div>
          </div>
        ) : (
          <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '24px' }}>
            <p style={{ color: '#9ca3af', marginBottom: '20px' }}>単語が登録されていません</p>
            <Link href="/add" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 'bold' }}>単語を追加する</Link>
          </div>
        )}
      </div>
    </main>
  );
}