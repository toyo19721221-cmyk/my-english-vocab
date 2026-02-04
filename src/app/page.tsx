/**
 * @version 1.5.1
 * @description 戻るボタンおよび登録後の移動機能の安定化（window.locationを使用）
 */
"use client";
import { useState } from "react";

export default function AddPage() {
  const [jsonInput, setJsonInput] = useState("");
  const [error, setError] = useState("");

  const handleBulkRegister = () => {
    try {
      setError("");
      if (!jsonInput.trim()) {
        setError("データが空です");
        return;
      }

      const parsedData = JSON.parse(jsonInput);
      
      if (!Array.isArray(parsedData) || parsedData.length === 0 || !parsedData[0].word) {
        throw new Error("形式が正しくありません");
      }

      localStorage.setItem("my-app-data", JSON.stringify(parsedData));
      
      alert(`成功：${parsedData.length}件登録しました`);
      // 確実な画面移動
      window.location.href = "/";
      
    } catch (e) {
      setError("エラー：JSONの形式が正しくありません。");
    }
  };

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', color: 'black', fontFamily: 'sans-serif' }}>
      <div style={{ width: '100%', maxWidth: '500px' }}>
        <h1 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>一括登録・管理 (v1.5.1)</h1>
        
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder='ここにJSONを貼り付け'
            style={{ width: '100%', height: '300px', padding: '15px', borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '13px', marginBottom: '10px', outline: 'none' }}
          />

          {error && <p style={{ color: '#ef4444', fontSize: '12px', marginBottom: '10px', fontWeight: 'bold' }}>{error}</p>}

          <button
            onClick={handleBulkRegister}
            style={{ width: '100%', padding: '15px', backgroundColor: 'black', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '15px' }}
          >
            データを上書き登録する
          </button>

          {/* 確実な戻るリンク */}
          <button 
            onClick={() => window.location.href = "/"}
            style={{ width: '100%', background: 'none', border: 'none', color: '#9ca3af', fontSize: '13px', textDecoration: 'underline', cursor: 'pointer' }}
          >
            保存せずに戻る
          </button>
        </div>
      </div>
    </main>
  );
}