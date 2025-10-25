/* ==========================================================
   🎯 study-answer.js（Realtime Database 連携版）
   - 答え画面（解説を改行ごとにリスト表示）
   - 正解数・不正解数を Realtime Database に保存
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
  // 🔹 localStorageからデータ取得
  // ==========================================================
  const currentData = JSON.parse(localStorage.getItem("currentQuizData"));
  const userAnswer = localStorage.getItem("userAnswer") || "";

  if (!currentData) {
    alert("問題データが見つかりません。最初からやり直してください。");
    location.href = "study-select.html";
    return;
  }

  // ==========================================================
  // 🔹 正誤判定
  // ==========================================================
  const isCorrect =
    userAnswer.toLowerCase().trim() === (currentData.answer || "").toLowerCase().trim();

  if (isCorrect) {
    judgeText.innerHTML = `<i class="fa-regular fa-circle"></i> 正解！`;
    judgeText.classList.add("correct");
  } else {
    judgeText.innerHTML = `<i class="fa-solid fa-xmark"></i> 不正解`;
    judgeText.classList.add("incorrect");
  }

  // ==========================================================
  // 🔹 Firebase のデータ更新（正解／不正解カウント）
  // ==========================================================
  try {
    const key = currentData._key; // ← vocab.js / review.js で保存してある Firebaseキー
    if (!key) {
      console.warn("⚠️ Firebaseキーが見つからないため更新をスキップしました。");
    } else {
      const updates = {};
      updates[`wordData/${key}/correct`] = (currentData.correct || 0) + (isCorrect ? 1 : 0);
      updates[`wordData/${key}/wrong`] = (currentData.wrong || 0) + (isCorrect ? 0 : 1);
      updates[`wordData/${key}/lastReviewed`] = Date.now();

      await update(ref(db), updates);
      console.log("✅ Firebaseに結果を更新:", updates);
    }
  } catch (err) {
    console.error("❌ Firebase更新エラー:", err);
  }

  // ==========================================================
  // 🔹 内容を画面に表示
  // ==========================================================
  answerWord.textContent = currentData.answer || "";
  fullSentence.textContent = currentData.enSentence || "";
  answerJp.textContent = currentData.jpSentence || "";
  noteWord.textContent = currentData.word || "";
  noteMeaning.textContent = currentData.meaning || "";

  // ✅ 改行ごとにリスト化
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
    try {
      const utter = new SpeechSynthesisUtterance(currentData.enSentence);
      utter.lang = "en-US";
      utter.rate = 0.9;
      utter.pitch = 1.0;

      playAudioBtn.classList.add("playing");
      utter.onend = () => playAudioBtn.classList.remove("playing");

      speechSynthesis.cancel();
      speechSynthesis.speak(utter);
    } catch (err) {
      console.error("❌ 音声再生エラー:", err);
      alert("音声を再生できませんでした。");
    }
  });

  // ==========================================================
  // 🔹 次の問題へ
  // ==========================================================
  nextBtn.addEventListener("click", () => {
    const currentIndex = parseInt(localStorage.getItem("currentIndex") || "0", 10);
    const nextIndex = currentIndex + 1;
    localStorage.setItem("currentIndex", nextIndex.toString());

    const currentGenreData = JSON.parse(localStorage.getItem("currentGenreData") || "[]");
    if (nextIndex >= currentGenreData.length) {
      alert("このジャンルの問題はすべて終了しました。最初に戻ります。");
      localStorage.setItem("currentIndex", "0");
      location.href = "study-select.html";
      return;
    }

    location.href = "study-question.html";
  });
});
