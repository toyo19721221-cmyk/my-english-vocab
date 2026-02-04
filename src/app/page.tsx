/**
 * @version 1.5.0
 * @description 登録エンジンの刷新：JSON一括上書き・バリデーション・二重登録防止機能
 */
"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AddPage() {
  const [jsonInput, setJsonInput] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleBulkRegister = () => {
    try {
      setError("");
      // 入力チェック
      if (!jsonInput.trim()) {
        setError("データが空です");
        return;
      }

      // JSONを解析
      const parsedData = JSON.parse(jsonInput);
      
      // データの形式が正しいか最低限のチェック
      if (!Array.isArray(parsedData) || parsedData.length === 0 || !parsedData[0].word) {
        throw new Error("正しいJSON形式（配列）で入力してください");
      }

      // 既存のデータを無視して「完全に上書き」保存
      localStorage.setItem("my-app-data", JSON.stringify(parsedData));
      
      alert(`成功：${parsedData.length}件の単語を登録（上書き）しました`);
      setJsonInput(""); // 入力欄をクリア
      router.push("/"); // メイン画面へ戻る
      
    } catch (e) {
      setError("エラー：JSONの形式が正しくありません。記号やカッコを確認してください。");
      console.error(e);
    }
  };

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', color: 'black', fontFamily: 'sans-serif' }}>
      <div style={{ width: '100%', maxWidth: '500px' }}>
        <h1 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>一括登録・管理 (v1.5.0)</h1>
        
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
          <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '10px' }}>
            ※ここに貼り付けると、これまでのデータは消去され、新しい内容で上書きされます。
          </p>
          
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder='[ { "id": 1, "word": "example", ... } ]'
            style={{ width: '100%', height: '300px', padding: '15px', borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '13px', fontFamily: 'monospace', marginBottom: '10px', outline: 'none' }}
          />

          {error && <p style={{ color: '#ef4444', fontSize: '12px', marginBottom: '10px', fontWeight: 'bold' }}>{error}</p>}

          <button
            onClick={handleBulkRegister}
            style={{ width: '100%', padding: '15px', backgroundColor: 'black', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '10px' }}
          >
            データを上書き登録する
          </button>

          <Link href="/" style={{ display: 'block', textAlign: 'center', color: '#9ca3af', fontSize: '13px', textDecoration: 'none' }}>
            戻る
          </Link>
        </div>
      </div>
    </main>
  );
}