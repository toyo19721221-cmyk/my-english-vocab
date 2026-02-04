/**
 * @version 1.6.3
 * @description ビルドエラー(width重複)の完全修正。
 */
"use client";
import { useState } from "react";

export default function AddPage() {
  const [jsonInput, setJsonInput] = useState("");
  const [error, setError] = useState("");

  const forceGoHome = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (typeof window !== "undefined") {
      window.location.href = window.location.origin + "/";
    }
  };

  const handleBulkRegister = (e: React.MouseEvent) => {
    try {
      setError("");
      if (!jsonInput.trim()) { setError("データが空です"); return; }
      const parsedData = JSON.parse(jsonInput);
      if (!Array.isArray(parsedData) || parsedData.length === 0) {
        throw new Error("形式エラー");
      }
      localStorage.setItem("my-app-data", JSON.stringify(parsedData));
      alert(`成功：${parsedData.length}件登録しました`);
      forceGoHome(e);
    } catch (err) {
      setError("エラー：JSON形式が正しくありません。");
    }
  };

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', color: 'black' }}>
      <div style={{ width: '100%', maxWidth: '500px' }}>
        <h1 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>一括登録 (v1.6.3)</h1>
        
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            style={{ width: '100%', height: '300px', marginBottom: '15px', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', display: 'block' }}
            placeholder="JSONデータを貼り付け"
          />

          {error && <p style={{ color: 'red', fontSize: '12px', marginBottom: '10px' }}>{error}</p>}

          <button 
            onClick={handleBulkRegister} 
            type="button"
            style={{ width: '100%', padding: '16px', backgroundColor: 'black', color: 'white', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '15px', border: 'none', display: 'block' }}
          >
            データを上書き登録する
          </button>

          <button 
            onClick={(e) => forceGoHome(e)}
            type="button"
            style={{ width: '100%', padding: '12px', backgroundColor: '#e5e7eb', color: '#4b5563', borderRadius: '12px', border: 'none', textAlign: 'center', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', display: 'block' }}
          >
            キャンセルしてメイン画面へ
          </button>
        </div>
      </div>
      <footer style={{ marginTop: '20px', color: '#d1d5db', fontSize: '10px' }}>v1.6.3</footer>
    </main>
  );
}