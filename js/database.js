/* ==========================================================
   database.js：単語一覧・一括編集・削除処理（ジャンル付き）
   ========================================================== */
document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ database.js loaded");

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

  // ✅ データ読み込み
  let data = loadData("wordData") || [];

  // ✅ IDが存在しないデータに自動でUUIDを付与（安全版）
  function generateId() {
    if (window.crypto && crypto.randomUUID) {
      return crypto.randomUUID();
    } else {
      return 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 8);
    }
  }

  data = data.map(item => {
    if (!item.id) item.id = generateId();
    return item;
  });
  saveData("wordData", data);

  // --------------------------------------------------
  // 🔹 一覧描画関数
  // --------------------------------------------------
function renderList(filter = "all") {
  wordList.innerHTML = "";

  const filtered = filter === "all" ? data : data.filter(d => d.genre === filter);
  emptyMsg.classList.toggle("hidden", filtered.length > 0);

  // 🔹 最新データを上に表示
  const sorted = [...filtered].reverse();

  sorted.forEach((item) => {
    const div = document.createElement("div");
    div.className = "word-item";
    div.innerHTML = `
      <div class="word-item-left">
        <input type="checkbox" data-id="${item.id}">
        <div class="word-info">
          <div class="word">${item.word || "(未設定)"}</div>
          <div class="meaning">${item.meaning || ""}</div>
          <div class="genre">ジャンル：${item.genre || "未分類"}</div>
        </div>
      </div>
      <div class="word-item-right">
        <button class="edit" data-id="${item.id}">
          <i class="fa-solid fa-pen"></i> 編集
        </button>
      </div>
    `;
    wordList.appendChild(div);
  });
}

  // 初回描画
  renderList();

  // --------------------------------------------------
  // 🔸 ジャンルフィルタ変更
  // --------------------------------------------------
  genreFilter.addEventListener("change", (e) => renderList(e.target.value));

  // --------------------------------------------------
  // 🔸 編集ページへ遷移
  // --------------------------------------------------
  wordList.addEventListener("click", (e) => {
    if (e.target.closest(".edit")) {
      const id = e.target.closest(".edit").dataset.id;
      localStorage.setItem("editId", id);
      window.location.href = "edit.html";
    }
  });

  // --------------------------------------------------
  // 🔸 一括削除
  // --------------------------------------------------
  deleteAllBtn.addEventListener("click", () => {
    const checked = document.querySelectorAll(".word-item input:checked");
    if (checked.length === 0) return alert("削除対象が選択されていません。");

    if (confirm(`${checked.length}件を削除しますか？`)) {
      const ids = [...checked].map(chk => chk.dataset.id);
      data = data.filter(d => !ids.includes(d.id));
      saveData("wordData", data);
      renderList(genreFilter.value);
      alert("🗑️ 選択した単語を削除しました。");
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
  // 🔸 モーダル保存（alertで通知）
  // --------------------------------------------------
  bulkSave.addEventListener("click", () => {
    const checked = document.querySelectorAll(".word-item input:checked");
    const newGenre = bulkGenre.value.trim();
    const newTags = bulkTags.value.split(",").map(t => t.trim()).filter(Boolean);

    checked.forEach((chk) => {
      const id = chk.dataset.id;
      const item = data.find(d => d.id === id);
      if (!item) return;

      if (newGenre) item.genre = newGenre;
      if (newTags.length > 0) {
        item.tags = Array.from(new Set([...(item.tags || []), ...newTags]));
      }
    });

    saveData("wordData", data);
    bulkModal.classList.add("hidden");
    bulkGenre.value = "";
    bulkTags.value = "";
    renderList(genreFilter.value);

    // ✅ alertで成功通知
    alert("一括編集を保存しました！");
  });

  // --------------------------------------------------
  // 🔸 モーダルキャンセル
  // --------------------------------------------------
  bulkCancel.addEventListener("click", () => {
    bulkModal.classList.add("hidden");
  });
});
