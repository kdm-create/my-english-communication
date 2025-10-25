/* ==========================================================
   vocab.js：Realtime Database連携（Firebaseキー保持＋detail遷移）
   ========================================================== */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

document.addEventListener("DOMContentLoaded", async () => {
  console.log("✅ vocab.js loaded (Realtime Database)");

  const vocabContainer = document.getElementById("vocabContainer");
  const emptyMsg = document.getElementById("emptyMsg");

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
  // 🔹 データ読み込み
  // ======================================================
  try {
    const snapshot = await get(ref(db, "wordData"));
    if (!snapshot.exists()) {
      emptyMsg.classList.remove("hidden");
      console.warn("⚠️ データが存在しません。");
      return;
    }

    const obj = snapshot.val();
    const data = Object.entries(obj).map(([key, value]) => ({
      ...value,
      _key: key, // ✅ Firebaseキー保持
    }));

    console.log("📘 取得データ:", data);

    // ======================================================
    // 🔹 ジャンル設定
    // ======================================================
    const genreImages = {
      "ルーティン": "assets/img/genre/hedgehog-routine.png",
      "家事": "assets/img/genre/hedgehog-housework.png",
      "食べる・飲む": "assets/img/genre/hedgehog-eat.png",
      "住まい": "assets/img/genre/hedgehog-home.png",
      "買い物": "assets/img/genre/hedgehog-shopping.png",
      "旅行・移動": "assets/img/genre/hedgehog-travel.png",
      "仕事": "assets/img/genre/hedgehog-work.png",
      "雑談・趣味": "assets/img/genre/hedgehog-hobby.png",
      "友達・恋愛": "assets/img/genre/hedgehog-love.png",
      "家族・子育て": "assets/img/genre/hedgehog-family.png",
      "体・健康": "assets/img/genre/hedgehog-health.png",
      "スマホ・PC・SNS": "assets/img/genre/hedgehog-digital.png",
      "日本紹介": "assets/img/genre/hedgehog-japan.png",
      "授業・レッスン": "assets/img/genre/hedgehog-lesson.png",
      "感想・気持ち": "assets/img/genre/hedgehog-feeling.png",
      "人とのやりとり": "assets/img/genre/hedgehog-communication.png",
      "ニュアンスを伝える一言": "assets/img/genre/hedgehog-phrase.png",
      "その他": "assets/img/genre/hedgehog-other.png"
    };

    const genreOrder = [
      "ルーティン", "家事", "食べる・飲む", "住まい", "買い物",
      "旅行・移動", "仕事", "雑談・趣味", "友達・恋愛", "家族・子育て",
      "体・健康", "スマホ・PC・SNS", "日本紹介", "授業・レッスン",
      "感想・気持ち", "人とのやりとり", "ニュアンスを伝える一言", "その他"
    ];

    // 🔹 グループ化
    const grouped = {};
    data.forEach((item) => {
      const genre = item.genre || "その他";
      if (!grouped[genre]) grouped[genre] = [];
      grouped[genre].push(item);
    });

    // ======================================================
    // 🔹 各ジャンルを描画
    // ======================================================
    genreOrder.forEach((genre, index) => {
      if (!grouped[genre]) return;

      const section = document.createElement("section");
      section.className = "genre-block";
      const number = String(index + 1).padStart(2, "0");

      // ✅ ここで imgSrc を定義（バグ修正）
      const imgSrc = genreImages[genre] || genreImages["その他"];

      section.innerHTML = `
        <div class="genre-header pink">
          <span class="genre-name">${number}. ${genre}</span>
          <img src="${imgSrc}" alt="${genre}のイラスト" class="genre-icon">
        </div>
        <ul class="word-list"></ul>
      `;

      const list = section.querySelector(".word-list");
      grouped[genre].forEach((item) => {
        const li = document.createElement("li");
        li.className = "word-item";
        li.dataset.key = item._key; // ✅ pushキーを保持
        li.innerHTML = `
          <div class="word-text">
            <strong>${item.word || "(未設定)"}</strong>
            <p>${item.meaning || ""}</p>
          </div>
          <div class="word-stats">
            <span class="right">○ ${item.correct || 0}</span>
            <span class="wrong">× ${item.wrong || 0}</span>
            <i class="fa-solid fa-chevron-right arrow-icon"></i>
          </div>
        `;
        list.appendChild(li);
      });

      vocabContainer.appendChild(section);
    });

    // ======================================================
    // 🔹 詳細ページ遷移
    // ======================================================
    vocabContainer.addEventListener("click", (e) => {
      const li = e.target.closest(".word-item");
      if (!li) return;
      const key = li.dataset.key;
      if (key) {
        console.log("🔗 detail.html?id=" + key);
        window.location.href = `detail.html?id=${encodeURIComponent(key)}`;
      }
    });

  } catch (error) {
    console.error("❌ Firebase取得エラー:", error);
    emptyMsg.textContent = "データ取得中にエラーが発生しました。";
    emptyMsg.classList.remove("hidden");
  }
});
