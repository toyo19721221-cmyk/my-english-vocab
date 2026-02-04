/**
 * @version 1.7.0
 * @description 一括登録画面。確実な画面遷移（window.location）を実装。
 */
"use client";
import { useState } from "react";

export default function AddPage() {
  const [jsonInput, setJsonInput] = useState("");
  const [error, setError] = useState("");

  const forceReloadHome = () => {
    // キャッシュを無視してトップページへ強制移動
    window.location.assign("/");
  };

  const handleBulkRegister = () => {
    try {
      setError("");
      if (!jsonInput.trim()) { setError("データが空です"); return; }
      const parsedData = JSON.parse(jsonInput);
      if (!Array.isArray(parsedData) || parsedData.length === 0) {
        throw new Error("形式エラー");
      }
      localStorage.setItem("my-app-data", JSON.stringify(parsedData));
      alert(`成功：${parsedData.length}件の単語を登録しました`);
      forceReloadHome();
    } catch (err) {
      setError("エラー：JSON形式が正しくありません。記号やカッコを確認してください。");
    }
  };

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', color: 'black', fontFamily: 'sans-serif' }}>
      <div style={{ width: '100%', maxWidth: '500px' }}>
        <h1 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>一括登録 (v1.7.0)</h1>
        
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
          <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '10px' }}>
            ※貼り付けると現在のデータはすべて上書きされます。
          </p>
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            style={{ width: '100%', height: '300px', marginBottom: '15px', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', display: 'block', color: 'black' }}
            placeholder='[ { "id": 1, "word": "example", ... } ]'
          />
          {error && <p style={{ color: 'red', fontSize: '12px', marginBottom: '10px' }}>{error}</p>}
          <button onClick={handleBulkRegister} style={{ width: '100%', padding: '16px', backgroundColor: 'black', color: 'white', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '15px', border: 'none' }}>
            データを上書き登録する
          </button>
          <button onClick={forceReloadHome} style={{ width: '100%', padding: '12px', backgroundColor: '#e5e7eb', color: '#4b5563', borderRadius: '12px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
            キャンセルして戻る
          </button>
        </div>
      </div>
    </main>
  );
}