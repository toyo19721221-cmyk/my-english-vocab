"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Word {
  id: number;
  word: string;       // 英語
  partOfSpeech: string; // 品詞/用法
  meaning: string;    // 日本語訳
  example: string;    // 例文
  exampleJp: string;  // 例文訳
}

export default function AddWordPage() {
  const [words, setWords] = useState<Word[]>([]);
  const [formData, setFormData] = useState({
    word: "",
    partOfSpeech: "",
    meaning: "",
    example: "",
    exampleJp: ""
  });

  useEffect(() => {
    const savedWords = localStorage.getItem("vocab-words");
    if (savedWords) setWords(JSON.parse(savedWords));
  }, []);

  const addWord = () => {
    if (!formData.word || !formData.meaning) {
      alert("英語と日本語訳は必須です！");
      return;
    }
    const updatedWords = [...words, { id: Date.now(), ...formData }];
    setWords(updatedWords);
    localStorage.setItem("vocab-words", JSON.stringify(updatedWords));
    setFormData({ word: "", partOfSpeech: "", meaning: "", example: "", exampleJp: "" });
    alert("登録完了！");
  };

  const deleteWord = (id: number) => {
    if (!confirm("削除しますか？")) return;
    const updatedWords = words.filter(w => w.id !== id);
    setWords(updatedWords);
    localStorage.setItem("vocab-words", JSON.stringify(updatedWords));
  };

  return (
    <main className="min-h-screen bg-white p-6 flex flex-col items-center">
      <div className="w-full max-w-md">
        <Link href="/" className="text-blue-500 mb-6 inline-block font-bold">← 学習画面に戻る</Link>
        <h1 className="text-2xl font-bold mb-6">単語登録</h1>

        <div className="space-y-4 mb-10">
          <input type="text" placeholder="【英語】" value={formData.word} onChange={(e) => setFormData({...formData, word: e.target.value})} className="w-full p-3 border-b-2 outline-none focus:border-blue-500" />
          <input type="text" placeholder="【品詞／用法】" value={formData.partOfSpeech} onChange={(e) => setFormData({...formData, partOfSpeech: e.target.value})} className="w-full p-3 border-b-2 outline-none focus:border-blue-500" />
          <input type="text" placeholder="【日本語訳】" value={formData.meaning} onChange={(e) => setFormData({...formData, meaning: e.target.value})} className="w-full p-3 border-b-2 outline-none focus:border-blue-500" />
          <textarea placeholder="【例文】" value={formData.example} onChange={(e) => setFormData({...formData, example: e.target.value})} className="w-full p-3 border-b-2 outline-none focus:border-blue-500 h-20" />
          <textarea placeholder="【例文訳】" value={formData.exampleJp} onChange={(e) => setFormData({...formData, exampleJp: e.target.value})} className="w-full p-3 border-b-2 outline-none focus:border-blue-500 h-20" />
          
          <button onClick={addWord} className="w-full py-4 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition">登録する</button>
        </div>

        <h2 className="font-bold text-gray-400 mb-4 uppercase text-xs tracking-widest">List</h2>
        <div className="space-y-2">
          {words.map((w) => (
            <div key={w.id} className="flex justify-between items-center p-3 border-b border-gray-100 text-sm">
              <span className="font-bold">{w.word}</span>
              <button onClick={() => deleteWord(w.id)} className="text-red-300">×</button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}