/**
 * @version 1.5.4
 * @description 従来のリンクをすべて廃止し、最優先の絶対パス移動のみを実装
 */
"use client";
import { useState } from "react";

export default function AddPage() {
  const [jsonInput, setJsonInput] = useState("");
  const [error, setError] = useState("");

  const handleBulkRegister = () => {
    try {
      setError("");
      if (!jsonInput.trim()) { setError("データが空です"); return; }
      const parsedData = JSON.parse(jsonInput);
      if (!Array.isArray(parsedData) || parsedData.length === 0 || !parsedData[0].word) {
        throw new Error("形式エラー");
      }
      localStorage.setItem("my-app-data", JSON.stringify(parsedData));
      alert(`成功：${parsedData.length}件登録しました`);
      // どこにいても絶対にトップへ飛ばす
      window.location.href = window.location.origin;
    } catch (e) {
      setError("エラー：JSON形式が正しくありません。");
    }
  };

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', color: 'black' }}>
      <div style={{ width: '100%', maxWidth: '500px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '20px' }}>一括登録 (v1.5.4)</h1>
        
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            style={{ width: '100%', height: '300px', marginBottom: '10px', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
            placeholder="JSONデータを貼り付け"
          />
          {error && <p style={{ color: 'red', fontSize: '12px', marginBottom: '10px' }}>{error}</p>}
          <button onClick={handleBulkRegister} style={{ width: '100%', padding: '15px', backgroundColor: 'black', color: 'white', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '15px' }}>
            データを上書き登録する
          </button>
          
          {/* Aタグによる原始的かつ確実な移動 */}
          <a href="/" style={{ display: 'block', width: '100%', padding: '10px', backgroundColor: '#e5e7eb', color: '#4b5563', borderRadius: '12px', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold' }}>
            キャンセルして戻る
          </a>
        </div>
      </div>
    </main>
  );
}