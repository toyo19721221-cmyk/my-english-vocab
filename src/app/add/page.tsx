/**
 * @version 1.7.0
 * @description 【登録用】データ上書き・強制リダイレクト機能
 */
"use client";
import { useState } from "react";

export default function AddPage() {
  const [jsonInput, setJsonInput] = useState("");
  const [error, setError] = useState("");

  const forceReloadHome = () => { window.location.assign("/"); };

  const handleBulkRegister = () => {
    try {
      setError("");
      if (!jsonInput.trim()) return;
      const parsedData = JSON.parse(jsonInput);
      localStorage.setItem("my-app-data", JSON.stringify(parsedData));
      alert(`成功：${parsedData.length}件登録しました`);
      forceReloadHome();
    } catch (err) {
      setError("JSON形式が正しくありません。");
    }
  };

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', color: 'black' }}>
      <div style={{ width: '100%', maxWidth: '500px', backgroundColor: 'white', padding: '20px', borderRadius: '15px' }}>
        <h1 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>一括登録 (v1.7.0)</h1>
        <textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          style={{ width: '100%', height: '300px', marginBottom: '15px', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', color: 'black' }}
          placeholder='JSONを貼り付け'
        />
        <button onClick={handleBulkRegister} style={{ width: '100%', padding: '16px', backgroundColor: 'black', color: 'white', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '10px' }}>データを上書き登録する</button>
        <button onClick={forceReloadHome} style={{ width: '100%', padding: '12px', backgroundColor: '#e5e7eb', color: '#4b5563', borderRadius: '12px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>戻る</button>
      </div>
    </main>
  );
}