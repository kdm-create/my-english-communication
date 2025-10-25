/* ==========================================================
   database.js：Realtime Database連携版（pushキー保持）
   単語一覧・絞り込み・一括編集・削除処理
========================================================== */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
  update,
  remove,
  child,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

document.addEventListener("DOMContentLoaded", async () => {
  console.log("✅ database.js loaded (Realtime Database)");

  // --------------------------------------------------
  // 🔹 要素取得
  // --------------------------------------------------
  const wordList = document.getElementById("wordList");
  const emptyMsg = document.getElementById("emptyMsg");
  const genreFilter = document.getElementById("genreFilter");
  const editAllBtn = document.getElementById("editAllBtn");
  const deleteAllBtn = document.getElementById("deleteAllBtn");

  // モーダル関連
  const bulkModal = document.getElementById("bulkEditModal");
  const bulkGenre = document.getElementById("bulkGenre");
  const bulkTags = document.getElementById("bulkTags");
  const bulkSave = document.getElementById("bulkSave");
  const bulkCancel = document.getElementById("bulkCancel");

  // --------------------------------------------------
  // 🔹 Firebase設定
  // --------------------------------------------------
  const firebaseConfig = {
    apiKey: "AIzaSyDERcyG95jc-mClX9wFcBnQ-XieE9mwWEw",
    authDomain: "my-english-communication.firebaseapp.com",
    databaseURL: "https://my-english-communication-default-rtdb.firebaseio.com",
    projectId: "my-english-communication",
    storageBucket: "my-english-communication.appspot.com",
    messagingSenderId: "701043899162",
    appId: "1:701043899162:web:cfda519e5aa12c7461b5ac",
  };

  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);
  const dbRef = ref(db, "wordData");

  let data = [];

  // --------------------------------------------------
  // 🔹 データ読み込み（pushキー保持）
  // --------------------------------------------------
  async function loadWords() {
    try {
      const snapshot = await get(dbRef);
      if (snapshot.exists()) {
        const obj = snapshot.val();

        // ✅ pushキーを各itemに付与して保持
        data = Object.entries(obj).map(([key, value]) => ({
          ...value,
          _key: key, // ← Firebase pushキー
        }));

        renderList();
      } else {
        data = [];
        emptyMsg.classList.remove("hidden");
      }
    } catch (error) {
      console.error("❌ データ取得エラー:", error);
      emptyMsg.textContent = "データの読み込みに失敗しました。";
      emptyMsg.classList.remove("hidden");
    }
  }

  // --------------------------------------------------
  // 🔹 一覧描画関数
  // --------------------------------------------------
  function renderList(filter = "all") {
    wordList.innerHTML = "";

    const filtered = filter === "all" ? data : data.filter((d) => d.genre === filter);
    emptyMsg.classList.toggle("hidden", filtered.length > 0);

    const sorted = [...filtered].reverse(); // 最新データを上に

    sorted.forEach((item) => {
      const div = document.createElement("div");
      div.className = "word-item";
      div.innerHTML = `
        <div class="word-item-left">
          <input type="checkbox" data-id="${item._key}">
          <div class="word-info">
            <div class="word">${item.word || "(未設定)"}</div>
            <div class="meaning">${item.meaning || ""}</div>
            <div class="genre">ジャンル：${item.genre || "未分類"}</div>
          </div>
        </div>
        <div class="word-item-right">
          <button class="edit" data-id="${item._key}">
            <i class="fa-solid fa-pen"></i> 編集
          </button>
        </div>
      `;
      wordList.appendChild(div);
    });
  }

  // ✅ 初期読み込み
  await loadWords();

  // --------------------------------------------------
  // 🔸 ジャンルフィルタ変更
  // --------------------------------------------------
  genreFilter.addEventListener("change", (e) => renderList(e.target.value));

  // --------------------------------------------------
  // 🔸 編集ページへ遷移（pushキーを渡す）
  // --------------------------------------------------
  wordList.addEventListener("click", (e) => {
    if (e.target.closest(".edit")) {
      const id = e.target.closest(".edit").dataset.id;
      localStorage.setItem("editId", id); // ← pushキーを保存
      window.location.href = "edit.html";
    }
  });

  // --------------------------------------------------
  // 🔸 一括削除（Realtime Database対応）
  // --------------------------------------------------
  deleteAllBtn.addEventListener("click", async () => {
    const checked = document.querySelectorAll(".word-item input:checked");
    if (checked.length === 0) return alert("削除対象が選択されていません。");

    if (confirm(`${checked.length}件を削除しますか？`)) {
      try {
        const promises = [];
        checked.forEach((chk) => {
          const id = chk.dataset.id;
          promises.push(remove(child(dbRef, id)));
        });
        await Promise.all(promises);
        alert("🗑️ 選択した単語を削除しました。");
        await loadWords();
      } catch (error) {
        console.error("❌ 削除エラー:", error);
        alert("削除中にエラーが発生しました。");
      }
    }
  });

  // --------------------------------------------------
  // 🔸 一括編集モーダルを開く
  // --------------------------------------------------
  editAllBtn.addEventListener("click", () => {
    const checked = document.querySelectorAll(".word-item input:checked");
    if (checked.length === 0) return alert("編集対象が選択されていません。");
    bulkModal.classList.remove("hidden");
  });

  // --------------------------------------------------
  // 🔸 一括編集を保存（Firebase更新）
  // --------------------------------------------------
  bulkSave.addEventListener("click", async () => {
    const checked = document.querySelectorAll(".word-item input:checked");
    const newGenre = bulkGenre.value.trim();
    const newTags = bulkTags.value
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      const updates = {};

      checked.forEach((chk) => {
        const id = chk.dataset.id;
        const item = data.find((d) => d._key === id);
        if (!item) return;

        if (newGenre) item.genre = newGenre;
        if (newTags.length > 0) {
          item.tags = Array.from(new Set([...(item.tags || []), ...newTags]));
        }

        updates[`wordData/${id}`] = item;
      });

      await update(ref(db), updates);

      bulkModal.classList.add("hidden");
      bulkGenre.value = "";
      bulkTags.value = "";

      alert("✅ 一括編集を保存しました！");
      await loadWords();
    } catch (error) {
      console.error("❌ 更新エラー:", error);
      alert("一括編集の保存中にエラーが発生しました。");
    }
  });

  // --------------------------------------------------
  // 🔸 モーダルキャンセル
  // --------------------------------------------------
  bulkCancel.addEventListener("click", () => {
    bulkModal.classList.add("hidden");
  });
});
