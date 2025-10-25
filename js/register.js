// ======================================================
// register.js：Firebase Realtime Database 対応
// ======================================================
import {
  ref,
  push
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ register.js loaded");

  const db = window.db; // register.htmlで初期化済み
  const step1 = document.getElementById("step1");
  const step2 = document.getElementById("step2");
  const nextBtn = document.querySelector(".next-btn");
  const backBtn = document.querySelector(".back-btn");

  // --- Step1 → Step2
  nextBtn.addEventListener("click", () => {
    step1.classList.remove("active");
    step1.classList.add("hidden");
    step2.classList.remove("hidden");
    step2.classList.add("active");
    window.scrollTo(0, 0);
  });

  // --- Step2 → Step1
  backBtn.addEventListener("click", () => {
    step2.classList.remove("active");
    step2.classList.add("hidden");
    step1.classList.remove("hidden");
    step1.classList.add("active");
    window.scrollTo(0, 0);
  });

  // --- 登録処理（Firebaseへ保存）
  const form2 = document.getElementById("step2");
  form2.addEventListener("submit", async (e) => {
    e.preventDefault();

    const selectedGenre =
      step2.querySelector("[name='genre']")?.value || "その他";

    const newWord = {
      jpSentence: step1.querySelector("[name='jpSentence']").value.trim(),
      highlight: step1.querySelector("[name='highlight']").value.trim(),
      enSentence: step1.querySelector("[name='enSentence']").value.trim(),
      answer: step1.querySelector("[name='answer']").value.trim(),
      hint: step2.querySelector("[name='hint']").value.trim(),
      word: step2.querySelector("[name='word']").value.trim(),
      meaning: step2.querySelector("[name='meaning']").value.trim(),
      note: step2.querySelector("[name='note']").value.trim(),
      genre: selectedGenre,
      correct: 0,
      wrong: 0,
      tags: [],
      createdAt: Date.now()
    };

    try {
      // ✅ Firebaseに登録
      await push(ref(db, "wordData"), newWord);
      alert(`「${selectedGenre}」ジャンルに登録が完了しました！`);

      // 入力リセット＆STEP1に戻す
      step1.reset();
      step2.reset();
      step2.classList.remove("active");
      step2.classList.add("hidden");
      step1.classList.remove("hidden");
      step1.classList.add("active");
      window.scrollTo(0, 0);
    } catch (err) {
      console.error("❌ Firebase保存エラー:", err);
      alert("登録に失敗しました。ネット接続を確認してください。");
    }
  });
});
