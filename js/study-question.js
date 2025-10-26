/* ==========================================================
   🎯 study-question.js（Realtime Database 連携版）
   - 出題ページ（穴埋め問題）
   - Firebaseからジャンル別問題を取得
========================================================== */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

document.addEventListener("DOMContentLoaded", async () => {
  console.log("✅ study-question.js loaded (Firebase専用)");

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
  const jpSentence = document.getElementById("jpSentence");
  const enSentence = document.getElementById("enSentence");
  const hintText = document.getElementById("hintText");
  const userAnswer = document.getElementById("userAnswer");
  const answerBtn = document.getElementById("answerBtn");
  const skipBtn = document.getElementById("skipBtn");

  // ==========================================================
  // 🔹 選択ジャンル取得
  // ==========================================================
  const selectedGenre = sessionStorage.getItem("selectedGenre");
  if (!selectedGenre) {
    alert("ジャンルが選択されていません。");
    location.href = "study-select.html";
    return;
  }

  // ==========================================================
  // 🔹 Firebaseから問題データ取得
  // ==========================================================
  try {
    const snapshot = await get(child(ref(db), "wordData"));
    if (!snapshot.exists()) {
      alert("データが登録されていません。");
      location.href = "study-select.html";
      return;
    }

    const allData = Object.entries(snapshot.val()).map(([key, value]) => ({
      ...value,
      _key: key,
    }));
    const genreData = allData.filter(item => item.genre === selectedGenre);

    if (genreData.length === 0) {
      alert(`「${selectedGenre}」ジャンルの問題はありません。`);
      location.href = "study-select.html";
      return;
    }

    // ==========================================================
    // 🔹 出題インデックス管理
    // ==========================================================
    let index = parseInt(sessionStorage.getItem("quizIndex") || "0", 10);
    if (index >= genreData.length) index = 0;
    const current = genreData[index];
    console.log("🎓 出題データ:", current);

    // ==========================================================
    // 🔹 表示処理
    // ==========================================================
    if (current.highlight && current.jpSentence) {
      jpSentence.innerHTML = current.jpSentence.replace(
        current.highlight,
        `<mark>${current.highlight}</mark>`
      );
    } else {
      jpSentence.textContent = current.jpSentence || "";
    }

    if (current.enSentence && current.answer) {
      const blank = current.answer.split(" ").map(() => "(　)").join(" ");
      const regex = new RegExp(current.answer, "gi");
      enSentence.textContent = current.enSentence.replace(regex, blank);
    } else {
      enSentence.textContent = current.enSentence || "";
    }

    hintText.textContent = current.hint || "";

    // ==========================================================
    // 🔹 回答・スキップ処理
    // ==========================================================
    function goToAnswer(inputValue) {
      sessionStorage.setItem("quizIndex", (index + 1).toString());
      const url = `study-answer.html?id=${encodeURIComponent(current._key)}&a=${encodeURIComponent(inputValue)}`;
      location.href = url;
    }

    answerBtn.addEventListener("click", () => goToAnswer(userAnswer.value.trim()));
    skipBtn.addEventListener("click", () => goToAnswer(""));

    userAnswer.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        goToAnswer(userAnswer.value.trim());
      }
    });
  } catch (err) {
    console.error("❌ データ取得エラー:", err);
    alert("データの読み込みに失敗しました。");
    location.href = "study-select.html";
  }
});
