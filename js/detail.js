/* ==========================================================
   detail.js：Firebaseキー指定で単語を取得＋音声読み上げ＋波動アニメーション
========================================================== */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

document.addEventListener("DOMContentLoaded", async () => {
  console.log("✅ detail.js loaded (with speech + animation)");

  const detailCard = document.getElementById("detailCard");

  // 🔹 Firebase初期化
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

  // 🔹 URLからid（Firebaseキー）を取得
  const params = new URLSearchParams(window.location.search);
  const key = params.get("id");

  if (!key) {
    detailCard.innerHTML = `<p class="error">⚠️ 単語IDが指定されていません。</p>`;
    return;
  }

  try {
    const snapshot = await get(child(ref(db), `wordData/${key}`));

    if (!snapshot.exists()) {
      detailCard.innerHTML = `<p class="error">⚠️ 指定された単語が見つかりません。</p>`;
      return;
    }

    const item = snapshot.val();
    console.log("📘 取得データ:", item);

    // ✅ 詳細表示（英文横に音声ボタン）
    const detailBox = document.createElement("div");
    detailBox.className = "detail-box";
    detailBox.innerHTML = `
      <h3 class="word">
        ${item.word || "(未設定)"}
      </h3>

      <p class="meaning">${item.meaning || ""}</p>

      <div class="sentence-block">
        <h4>英文</h4>
        <div class="sentence-line">
          <p class="sentence-text">${item.enSentence || ""}</p>
          ${item.enSentence ? `<button id="playSentence" class="btn-audio-icon" title="英文を再生">
            <i class="fa-solid fa-volume-high"></i>
            <span class="wave"></span>
            <span class="wave"></span>
            <span class="wave"></span>
          </button>` : ""}
        </div>
        <h4>日本語文</h4>
        <p>${item.jpSentence || ""}</p>
      </div>

      ${item.hint ? `
      <div class="extra-block">
        <h4>ヒント</h4>
        <p>${item.hint}</p>
      </div>` : ""}
    `;

    if (item.note && item.note.trim()) {
      const lines = item.note.split(/\r?\n/).filter(Boolean);
      const ul = document.createElement("ul");
      ul.className = "note-list";
      lines.forEach(line => {
        const li = document.createElement("li");
        li.textContent = line.trim();
        ul.appendChild(li);
      });
      const noteBlock = document.createElement("div");
      noteBlock.className = "note-block";
      noteBlock.innerHTML = "<h4>解説</h4>";
      noteBlock.appendChild(ul);
      detailBox.appendChild(noteBlock);
    }

    detailCard.innerHTML = "";
    detailCard.appendChild(detailBox);

    // ======================================================
    // 🔊 音声読み上げ機能
    // ======================================================
    const playAudio = (btn, text) => {
      if (!text) return;
      try {
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = "en-US";
        utter.rate = 0.9;

        // 再生中アニメーションON
        btn.classList.add("playing");

        // 再生終了でリセット
        utter.onend = () => {
          btn.classList.remove("playing");
        };

        // 既存再生を停止して新しく再生
        speechSynthesis.cancel();
        speechSynthesis.speak(utter);
      } catch (err) {
        console.error("❌ 音声再生エラー:", err);
      }
    };

    // 🔹 イベント登録
    const playWordBtn = document.getElementById("playWord");
    const playSentenceBtn = document.getElementById("playSentence");

    if (playWordBtn) playWordBtn.addEventListener("click", () => playAudio(playWordBtn, item.word));
    if (playSentenceBtn) playSentenceBtn.addEventListener("click", () => playAudio(playSentenceBtn, item.enSentence));

  } catch (err) {
    console.error("❌ Firebase読み込みエラー:", err);
    detailCard.innerHTML = `<p class="error">⚠️ データ取得中にエラーが発生しました。</p>`;
  }
});
