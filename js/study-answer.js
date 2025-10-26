/* ==========================================================
   🎯 study-answer.js（Realtime Database 連携版）
   - URLパラメータから id & 回答(a) を取得
   - Firebase から問題データを取得して正誤判定・更新
========================================================== */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
  update
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

document.addEventListener("DOMContentLoaded", async () => {
  console.log("✅ study-answer.js loaded (Realtime Database)");

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
  // 🔹 URLパラメータから id と 回答 を取得
  // ==========================================================
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const userAnswer = decodeURIComponent(params.get("a") || "");

  console.log("🧩 URLパラメータ:", { id, userAnswer });

  if (!id) {
    alert("問題IDが見つかりません。最初からやり直してください。");
    location.href = "study-select.html";
    return;
  }

  // ==========================================================
  // 🔹 Firebaseから該当問題データを取得
  // ==========================================================
  let currentData = null;
  try {
    const snapshot = await get(ref(db, `wordData/${id}`));
    if (!snapshot.exists()) {
      alert("データの取得中にエラーが発生しました。");
      location.href = "study-select.html";
      return;
    }
    currentData = snapshot.val();
    console.log("📘 問題データ:", currentData);
  } catch (err) {
    console.error("❌ Firebase取得エラー:", err);
    alert("データの取得中にエラーが発生しました。");
    return;
  }

  // ==========================================================
  // 🔹 要素取得
  // ==========================================================
  const judgeText = document.getElementById("judgeText");
  const answerWord = document.getElementById("answerWord");
  const fullSentence = document.getElementById("fullSentence");
  const answerJp = document.getElementById("answerJp");
  const noteWord = document.getElementById("noteWord");
  const noteMeaning = document.getElementById("noteMeaning");
  const noteText = document.getElementById("noteText");
  const nextBtn = document.getElementById("nextBtn");
  const playAudioBtn = document.getElementById("playAudio");

  // ==========================================================
  // 🔹 正誤判定
  // ==========================================================
  const correctAns = (currentData.answer || "").trim().toLowerCase();
  const userInput = (userAnswer || "").trim().toLowerCase();
  const isCorrect = correctAns === userInput;

  console.log("🧩 比較結果:", { userInput, correctAns, isCorrect });

  if (isCorrect) {
    judgeText.innerHTML = `<i class="fa-regular fa-circle"></i> 正解！`;
    judgeText.classList.add("correct");
  } else {
    judgeText.innerHTML = `<i class="fa-solid fa-xmark"></i> 不正解`;
    judgeText.classList.add("incorrect");
  }

  // ==========================================================
  // 🔹 Firebase の正誤カウントを更新
  // ==========================================================
  try {
    const updates = {
      correct: (currentData.correct || 0) + (isCorrect ? 1 : 0),
      wrong: (currentData.wrong || 0) + (isCorrect ? 0 : 1),
      lastReviewed: Date.now()
    };
    await update(ref(db, `wordData/${id}`), updates);
    console.log("✅ Firebase更新:", updates);
  } catch (err) {
    console.error("❌ Firebase更新エラー:", err);
  }

  // ==========================================================
  // 🔹 表示処理
  // ==========================================================
  answerWord.textContent = currentData.answer || "";
  fullSentence.textContent = currentData.enSentence || "";
  answerJp.textContent = currentData.jpSentence || "";
  noteWord.textContent = currentData.word || "";
  noteMeaning.textContent = currentData.meaning || "";

  noteText.innerHTML = "";
  if (currentData.note && currentData.note.trim() !== "") {
    const ul = document.createElement("ul");
    currentData.note.split(/\r?\n/).forEach((line) => {
      const trimmed = line.trim();
      if (trimmed !== "") {
        const li = document.createElement("li");
        li.textContent = trimmed;
        ul.appendChild(li);
      }
    });
    noteText.appendChild(ul);
  } else {
    noteText.textContent = "(解説はありません)";
  }

  // ==========================================================
  // 🔊 音声再生
  // ==========================================================
  playAudioBtn.addEventListener("click", () => {
    if (!currentData.enSentence) return;
    const utter = new SpeechSynthesisUtterance(currentData.enSentence);
    utter.lang = "en-US";
    utter.rate = 0.9;
    utter.pitch = 1.0;
    speechSynthesis.cancel();
    speechSynthesis.speak(utter);
  });

  // ==========================================================
  // 🔹 次の問題へ
  // ==========================================================
  nextBtn.addEventListener("click", () => {
    location.href = "study-select.html";
  });
});
