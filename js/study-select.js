/* ==========================================================
   🎓 study-select.js（Realtime Database 連携版）
   - ジャンル選択画面
   - Firebaseからデータを取得して判定
========================================================== */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

document.addEventListener("DOMContentLoaded", async () => {
  console.log("✅ study-select.js loaded (Realtime Database)");

  // ==========================================================
  // 🔹 Firebase 初期化（このファイル単体で完結）
  // ==========================================================
  const firebaseConfig = {
    apiKey: "AIzaSyDERcyG95jc-mClX9wFcBnQ-XieE9mwWEw",
    authDomain: "my-english-communication.firebaseapp.com",
    databaseURL: "https://my-english-communication-default-rtdb.firebaseio.com",
    projectId: "my-english-communication",
    storageBucket: "my-english-communication.appspot.com",
    messagingSenderId: "880179162591",
    appId: "1:880179162591:web:7b2c85a9e75a65fd7758a0"
  };
  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);

  // ==========================================================
  // 🔹 ジャンルボタンを取得
  // ==========================================================
  const buttons = document.querySelectorAll(".genre-btn");

  // 🔹 ジャンル名を正規化（数字・ドット・全角半角スペースを削除）
  function normalizeGenre(str) {
    return (str || "")
      .replace(/^[０-９0-9]+\.\s*/, "") // 「01. 」や「０１. 」を削除
      .replace(/\s+/g, "")             // スペース削除（全角・半角）
      .trim();
  }

  // ==========================================================
  // 🔹 ボタンクリック処理
  // ==========================================================
  buttons.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const genre = btn.dataset.genre;
      console.log("🎯 選択ジャンル:", genre);

      // 🔹 ジャンルを保存（他ページで使用）
      localStorage.setItem("selectedGenre", genre);

      try {
        // 🔹 Firebaseから全データ取得
        const dbRef = ref(db);
        const snapshot = await get(child(dbRef, "wordData"));

        if (!snapshot.exists()) {
          alert("データベースに単語が登録されていません。");
          return;
        }

        const allData = Object.values(snapshot.val());
        console.log("📦 取得データ:", allData);

        // 🔹 正規化してジャンル一致を判定
        const filtered = allData.filter(item => {
          const saved = normalizeGenre(item.genre);
          const selected = normalizeGenre(genre);
          return saved === selected;
        });

        console.log("📚 該当データ数:", filtered.length);

        if (filtered.length === 0) {
          alert(`「${genre}」ジャンルにはまだ問題が登録されていません。`);
          return;
        }

        // 🔹 学習開始準備
        localStorage.setItem("currentIndex", "0");
        localStorage.setItem("currentGenreData", JSON.stringify(filtered));

        // 🔹 次のページへ
        location.href = "study-question.html";
      } catch (error) {
        console.error("❌ データ取得エラー:", error);
        alert("データの取得中にエラーが発生しました。");
      }
    });
  });
});
