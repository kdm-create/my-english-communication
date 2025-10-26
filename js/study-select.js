/* ==========================================================
   🎓 study-select.js（Realtime Database 連携版）
   - ジャンル選択画面
   - Firebaseからデータ存在確認のみ実施
========================================================== */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

document.addEventListener("DOMContentLoaded", async () => {
  console.log("✅ study-select.js loaded (Firebase専用)");

  // ==========================================================
  // 🔹 Firebase 初期化
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
  // 🔹 要素取得
  // ==========================================================
  const buttons = document.querySelectorAll(".genre-btn");

  // 🔹 ジャンル名正規化関数（全角・半角対応）
  function normalizeGenre(str) {
    return (str || "")
      .replace(/^[０-９0-9]+\.\s*/, "") // 「01. 」や「０１. 」を削除
      .replace(/\s+/g, "")             // スペース削除
      .trim();
  }

  // ==========================================================
  // 🔹 クリックイベント登録
  // ==========================================================
  buttons.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const genre = btn.dataset.genre;
      console.log("🎯 選択ジャンル:", genre);

      // 一時保存（ページ間受け渡し用）
      sessionStorage.setItem("selectedGenre", genre);

      try {
        // 🔹 Firebaseから全単語データ取得
        const dbRef = ref(db);
        const snapshot = await get(child(dbRef, "wordData"));

        if (!snapshot.exists()) {
          alert("データベースに単語が登録されていません。");
          return;
        }

        const allData = Object.values(snapshot.val());
        const matched = allData.filter((item) => {
          return normalizeGenre(item.genre) === normalizeGenre(genre);
        });

        if (matched.length === 0) {
          alert(`「${genre}」ジャンルにはまだ問題が登録されていません。`);
          return;
        }

        console.log(`✅ 「${genre}」ジャンルに ${matched.length} 件の問題があります。`);

        // 🔹 次ページへ遷移
        location.href = "study-question.html";

      } catch (error) {
        console.error("❌ Firebase取得エラー:", error);
        alert("データの取得中にエラーが発生しました。");
      }
    });
  });
});
