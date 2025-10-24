/* ==========================================================
   vocab.js：単語帳画面（ジャンルごとの背景色付き・リスト全体がリンク）
   ========================================================== */
document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ vocab.js loaded");

  const vocabContainer = document.getElementById("vocabContainer");
  const emptyMsg = document.getElementById("emptyMsg");

  const data = loadData("wordData") || [];

  if (data.length === 0) {
    emptyMsg.classList.remove("hidden");
    return;
  }

  // 🔹 ジャンル一覧（順番と番号を固定）
  const genreOrder = [
    "ルーティン", "家事", "食べる・飲む", "住まい", "買い物",
    "旅行・移動", "仕事", "雑談・趣味", "友達・恋愛", "家族・子育て",
    "体・健康", "スマホ・PC・SNS", "日本紹介", "授業・レッスン",
    "感想・気持ち", "人とのやりとり", "ニュアンスを伝える一言", "その他"
  ];

  // 🔹 データをジャンルごとにグループ化
  const grouped = {};
  data.forEach((item) => {
    const genre = item.genre || "その他";
    if (!grouped[genre]) grouped[genre] = [];
    grouped[genre].push(item);
  });

  // 🔹 ジャンル別画像マップ
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
    "その他": "assets/img/genre/hedgehog-default.png"
  };

  // 🔹 ジャンル別カラー設定
  const genreColors = {
    "ルーティン": "pink", "家事": "green", "食べる・飲む": "orange",
    "住まい": "purple", "買い物": "blue", "旅行・移動": "pink",
    "仕事": "green", "雑談・趣味": "orange", "友達・恋愛": "purple",
    "家族・子育て": "blue", "体・健康": "pink", "スマホ・PC・SNS": "green",
    "日本紹介": "orange", "授業・レッスン": "purple", "感想・気持ち": "blue",
    "人とのやりとり": "pink", "ニュアンスを伝える一言": "green", "その他": "gray"
  };

  // 🔹 各ジャンルを順番に生成
  genreOrder.forEach((genre, index) => {
    if (!grouped[genre]) return; // 登録がないジャンルはスキップ

    const section = document.createElement("section");
    section.className = "genre-block";

    const imgSrc = genreImages[genre] || genreImages["その他"];
    const number = String(index + 1).padStart(2, "0");
    const colorClass = genreColors[genre] || "gray";

    section.innerHTML = `
      <div class="genre-header ${colorClass}">
        <span class="genre-name">${number}. ${genre}</span>
        <img src="${imgSrc}" alt="${genre}のイラスト" class="genre-icon">
      </div>
      <ul class="word-list"></ul>
    `;

    const list = section.querySelector(".word-list");

    grouped[genre].forEach((item) => {
      const li = document.createElement("li");
      li.className = "word-item";
      li.dataset.id = item.id; // 🔸 単語IDをセット
      li.innerHTML = `
        <div class="word-text">
          <strong>${item.word}</strong>
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

  // 🔹 リスト全体クリックで詳細へ遷移
  vocabContainer.addEventListener("click", (e) => {
    const li = e.target.closest(".word-item");
    if (!li) return;

    const id = li.dataset.id;
    if (id) {
      window.location.href = `detail.html?id=${encodeURIComponent(id)}`;
    }
  });
});
