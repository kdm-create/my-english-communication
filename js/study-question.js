/* ==========================================================
   🎯 study-question.js（Realtime Database 連携版）
   - 出題ページ（穴埋め問題）
   - Firebaseから選択ジャンルの問題を取得
========================================================== */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

document.addEventListener("DOMContentLoaded", async () => {
  console.log("✅ study-question.js loaded (Realtime Database)");

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
  // 🔹 ジャンル取得
  // ==========================================================
  const selectedGenre = localStorage.getItem("selectedGenre");
  if (!selectedGenre) {
    alert("ジャンルが選択されていません。");
    location.href = "study-select.html";
    return;
  }

  // ==========================================================
  // 🔹 Firebaseからデータ取得
  // ==========================================================
  try {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, "wordData"));

    if (!snapshot.exists()) {
      alert("データベースに単語が登録されていません。");
      location.href = "study-select.html";
      return;
    }

    const allData = Object.values(snapshot.val());
    const data = allData.filter(item => item.genre === selectedGenre);

    if (data.length === 0) {
      alert(`「${selectedGenre}」ジャンルに登録された問題がありません。`);
      location.href = "study-select.html";
      return;
    }

    // ==========================================================
    // 🔹 インデックス管理
    // ==========================================================
    let currentIndex = parseInt(localStorage.getItem("currentIndex") || "0", 10);
    if (currentIndex >= data.length) currentIndex = 0;
    const current = data[currentIndex];
    localStorage.setItem("currentQuizData", JSON.stringify(current));

    console.log("🎓 出題データ:", current);

    // ==========================================================
    // 🔹 日本語文表示
    // ==========================================================
    if (current.highlight) {
      jpSentence.innerHTML = current.jpSentence.replace(
        current.highlight,
        `<mark>${current.highlight}</mark>`
      );
    } else {
      jpSentence.textContent = current.jpSentence || "";
    }

    // ==========================================================
    // 🔹 英文（穴埋め化）
    // ==========================================================
    if (current.enSentence && current.answer) {
      const blank = current.answer.split(" ").map(() => "(　)").join(" ");
      const regex = new RegExp(current.answer, "gi");
      enSentence.textContent = current.enSentence.replace(regex, blank);
    } else {
      enSentence.textContent = current.enSentence || "";
    }

    // ==========================================================
    // 🔹 ヒント
    // ==========================================================
    hintText.textContent = current.hint || "";

    // ==========================================================
    // 🔹 共通遷移処理
    // ==========================================================
    function goToAnswer(userInput) {
      localStorage.setItem("userAnswer", userInput);
      localStorage.setItem("currentIndex", currentIndex.toString());
      location.href = "study-answer.html";
    }

    answerBtn.addEventListener("click", () => goToAnswer(userAnswer.value.trim()));
    skipBtn.addEventListener("click", () => goToAnswer(""));

    // 🔹 Enterキー送信対応
    userAnswer.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        goToAnswer(userAnswer.value.trim());
      }
    });
  } catch (error) {
    console.error("❌ データ取得エラー:", error);
    alert("データの取得中にエラーが発生しました。");
    location.href = "study-select.html";
  }
});
