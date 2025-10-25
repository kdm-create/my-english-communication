/* ==========================================================
   review.js：Firebase連携版（wrong >= 3 の単語を出題）
========================================================== */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

document.addEventListener("DOMContentLoaded", async () => {
  console.log("✅ review.js loaded (Firebase)");

  const jpSentence = document.getElementById("jpSentence");
  const enSentence = document.getElementById("enSentence");
  const hintText = document.getElementById("hintText");
  const userAnswer = document.getElementById("userAnswer");
  const answerBtn = document.getElementById("answerBtn");
  const skipBtn = document.getElementById("skipBtn");

  // ======================================================
  // 🔹 Firebase 初期化
  // ======================================================
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

  // ======================================================
  // 🔹 Firebaseから全データ取得
  // ======================================================
  let allData = [];
  try {
    const snapshot = await get(ref(db, "wordData"));
    if (snapshot.exists()) {
      const obj = snapshot.val();
      allData = Object.entries(obj).map(([key, value]) => ({
        ...value,
        _key: key, // Firebaseキーを保持
      }));
    } else {
      alert("データベースに単語が登録されていません。");
      window.location.href = "index.html";
      return;
    }
  } catch (err) {
    console.error("❌ Firebaseデータ取得エラー:", err);
    alert("データ取得に失敗しました。");
    return;
  }

  // ======================================================
  // 🔹 不正解3回以上を抽出
  // ======================================================
  const reviewList = allData.filter(item => (item.wrong || 0) >= 3);

  if (reviewList.length === 0) {
    alert("復習対象の単語はありません！（不正解3回以上のものがありません）");
    window.location.href = "index.html";
    return;
  }

  console.log("📘 復習対象:", reviewList);

  // ======================================================
  // 🔹 現在のインデックスを管理
  // ======================================================
  let currentIndex = parseInt(localStorage.getItem("reviewIndex") || "0", 10);
  if (currentIndex >= reviewList.length) currentIndex = 0;

  const current = reviewList[currentIndex];
  localStorage.setItem("currentQuizData", JSON.stringify(current));

  // ======================================================
  // 🔹 表示
  // ======================================================
  jpSentence.innerHTML = (current.jpSentence || "").replace(
    current.highlight || "",
    `<mark>${current.highlight || ""}</mark>`
  );

  if (current.enSentence && current.answer) {
    const blank = current.answer.split(" ").map(() => "(　)").join(" ");
    enSentence.textContent = current.enSentence.replace(current.answer, blank);
  } else {
    enSentence.textContent = current.enSentence || "";
  }

  hintText.textContent = current.hint || "";

  // ======================================================
  // 🔹 答えるボタン
  // ======================================================
  answerBtn.addEventListener("click", () => {
    const input = userAnswer.value.trim();
    localStorage.setItem("userAnswer", input);
    localStorage.setItem("reviewIndex", currentIndex.toString());
    window.location.href = "study-answer.html"; // 既存の答え画面を再利用
  });

  // 🔹 わからないボタン
  skipBtn.addEventListener("click", () => {
    localStorage.setItem("userAnswer", "");
    localStorage.setItem("reviewIndex", currentIndex.toString());
    window.location.href = "study-answer.html";
  });
});
