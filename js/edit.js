// ======================================================
// edit.js：STEP切り替え＋Firebase対応版（最終安定版）
// ======================================================
import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
  update,
  child
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

document.addEventListener("DOMContentLoaded", async () => {
  console.log("✅ edit.js loaded (Realtime Database)");

  // ======================================================
  // 🔹 Firebase 初期化
  // ======================================================
  const firebaseConfig = {
    apiKey: "AIzaSyDERcyG95jc-mClX9wFcBnQ-XieE9mwWEw",
    authDomain: "my-english-communication.firebaseapp.com",
    databaseURL: "https://my-english-communication-default-rtdb.firebaseio.com",
    projectId: "my-english-communication",
    storageBucket: "my-english-communication.appspot.com",
    messagingSenderId: "701043899162",
    appId: "1:701043899162:web:cfda519e5aa12c7461b5ac"
  };

  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);

  // ======================================================
  // 🔹 要素取得
  // ======================================================
  const step1 = document.getElementById("step1");
  const step2 = document.getElementById("step2");
  const nextBtn = document.querySelector(".next-btn");
  const backBtn = document.querySelector(".back-btn");
  const cancelBtn = document.getElementById("cancelBtn");

  if (!nextBtn || !backBtn) {
    console.error("❌ ボタンが見つかりません。");
    return;
  }

  // ======================================================
  // 🔹 STEP切り替え
  // ======================================================
  nextBtn.addEventListener("click", (e) => {
    e.preventDefault();
    step1.classList.add("hidden");
    step1.classList.remove("active");
    step2.classList.remove("hidden");
    step2.classList.add("active");
    window.scrollTo(0, 0);
  });

  backBtn.addEventListener("click", (e) => {
    e.preventDefault();
    step2.classList.add("hidden");
    step2.classList.remove("active");
    step1.classList.remove("hidden");
    step1.classList.add("active");
    window.scrollTo(0, 0);
  });

  cancelBtn.addEventListener("click", () => {
    if (confirm("編集をキャンセルしますか？")) {
      window.location.href = "database.html";
    }
  });

  // ======================================================
  // 🔹 編集対象の取得
  // ======================================================
  const editId = localStorage.getItem("editId"); // Firebase pushキー
  if (!editId) {
    alert("編集対象が見つかりません。");
    window.location.href = "database.html";
    return;
  }

  // ======================================================
  // 🔹 Firebaseからデータ取得
  // ======================================================
  try {
    const snapshot = await get(child(ref(db), `wordData/${editId}`));

    if (!snapshot.exists()) {
      alert("データが見つかりません。");
      window.location.href = "database.html";
      return;
    }

    const item = snapshot.val();
    console.log("📘 取得データ:", item);

    // ✅ フォームへ反映
    document.getElementById("jpSentence").value = item.jpSentence || "";
    document.getElementById("highlight").value = item.highlight || "";
    document.getElementById("enSentence").value = item.enSentence || "";
    document.getElementById("answer").value = item.answer || "";
    document.getElementById("genre").value = item.genre || "";
    document.getElementById("hint").value = item.hint || "";
    document.getElementById("word").value = item.word || "";
    document.getElementById("meaning").value = item.meaning || "";
    document.getElementById("note").value = item.note || "";

  } catch (err) {
    console.error("❌ Firebase読み込みエラー:", err);
    alert("データの読み込みに失敗しました。");
  }

  // ======================================================
  // 🔹 保存処理（Firebase更新）
  // ======================================================
  const form2 = document.getElementById("step2");

  form2.addEventListener("submit", async (e) => {
    e.preventDefault();

    const updated = {
      jpSentence: document.getElementById("jpSentence").value.trim(),
      highlight: document.getElementById("highlight").value.trim(),
      enSentence: document.getElementById("enSentence").value.trim(),
      answer: document.getElementById("answer").value.trim(),
      genre: document.getElementById("genre").value.trim(),
      hint: document.getElementById("hint").value.trim(),
      word: document.getElementById("word").value.trim(),
      meaning: document.getElementById("meaning").value.trim(),
      note: document.getElementById("note").value.trim(),
      updatedAt: Date.now()
    };

    if (!updated.word || !updated.meaning) {
      alert("⚠️ 英単語と日本語訳は必須です。");
      return;
    }

    try {
      await update(ref(db, `wordData/${editId}`), updated);
      alert("✅ 変更を保存しました！");
      localStorage.removeItem("editId");

      // 少し遅延してリダイレクト（UX向上）
      setTimeout(() => {
        window.location.href = "database.html";
      }, 400);
    } catch (err) {
      console.error("❌ Firebase更新エラー:", err);
      alert("更新に失敗しました。");
    }
  });
});
