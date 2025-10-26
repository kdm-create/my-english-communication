/* ==========================================================
   vocab.js：Realtime Database連携（一覧＋キー保持）
========================================================== */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ vocab.js loaded");

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

  const vocabContainer = document.getElementById("vocabContainer");
  const emptyMsg = document.getElementById("emptyMsg");

  // 🔹 Firebaseからリアルタイム取得
  onValue(ref(db, "wordData"), (snapshot) => {
    if (!snapshot.exists()) {
      emptyMsg.classList.remove("hidden");
      vocabContainer.innerHTML = "";
      return;
    }

    const data = Object.entries(snapshot.val()).map(([key, value]) => ({
      ...value,
      _key: key
    }));

    renderVocabList(data);
  });

  // 🔹 ジャンル順指定
  const genreOrder = [
    "ルーティン", "家事", "食べる・飲む", "住まい", "買い物",
    "旅行・移動", "仕事", "雑談・趣味", "友達・恋愛", "家族・子育て",
    "体・健康", "スマホ・PC・SNS", "日本紹介", "授業・レッスン",
    "感想・気持ち", "人とのやりとり", "ニュアンスを伝える一言", "その他"
  ];

  // 🔹 描画関数
  function renderVocabList(data) {
    vocabContainer.innerHTML = "";
    const grouped = {};

    data.forEach((item) => {
      const genre = item.genre || "その他";
      if (!grouped[genre]) grouped[genre] = [];
      grouped[genre].push(item);
    });

    genreOrder.forEach((genre) => {
      if (!grouped[genre]) return;
      const section = document.createElement("section");
      section.className = "genre-block";

      section.innerHTML = `
        <div class="genre-header">
          <span class="genre-name">${genre}</span>
        </div>
        <ul class="word-list"></ul>
      `;

      const list = section.querySelector(".word-list");
      grouped[genre].forEach((item) => {
        const li = document.createElement("li");
        li.className = "word-item";
        li.dataset.key = item._key;
        const correct = item.correct ?? 0;
        const wrong = item.wrong ?? 0;

        li.innerHTML = `
          <div class="word-text">
            <strong>${item.word || "(未設定)"}</strong>
            <p>${item.meaning || ""}</p>
          </div>
          <div class="word-stats">
            <span>○ ${correct}</span>
            <span>× ${wrong}</span>
          </div>
        `;
        list.appendChild(li);
      });

      vocabContainer.appendChild(section);
    });
  }

  // 🔹 詳細ページへ遷移
  vocabContainer.addEventListener("click", (e) => {
    const li = e.target.closest(".word-item");
    if (!li) return;
    const key = li.dataset.key;
    if (key) location.href = `detail.html?id=${encodeURIComponent(key)}`;
  });
});
