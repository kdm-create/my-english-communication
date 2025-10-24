/* ==========================================================
   detail.js：単語の詳細表示ページ（解説をリスト形式で表示）
   ========================================================== */
document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ detail.js loaded");

  const detailCard = document.getElementById("detailCard");
  const editBtn = document.getElementById("editBtn");
  const backBtn = document.getElementById("backBtn");

  // 🔹 URLからIDを取得
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    detailCard.innerHTML = `<p class="error">⚠️ 単語IDが指定されていません。</p>`;
    return;
  }

  // 🔹 データ読み込み
  const allData = loadData("wordData") || [];
  const item = allData.find(d => d.id === id);

  if (!item) {
    detailCard.innerHTML = `<p class="error">⚠️ 指定された単語が見つかりません。</p>`;
    return;
  }

  // 🔹 HTML生成
  const detailBox = document.createElement("div");
  detailBox.className = "detail-box";

  // --- 単語と意味
  detailBox.innerHTML = `
    <h3 class="word">${item.word || "(未設定)"}</h3>
    <p class="meaning">${item.meaning || ""}</p>

    <div class="sentence-block">
      <h4>英文</h4>
      <p>${item.enSentence || ""}</p>
      <h4>日本語文</h4>
      <p>${item.jpSentence || ""}</p>
    </div>

    <div class="extra-block">
      ${item.hint ? `
        <h4>ヒント</h4>
        <p>${item.hint}</p>
      ` : ""}
    </div>
  `;

  // --- 解説（改行ごとにリスト表示）
  if (item.note && item.note.trim() !== "") {
    const lines = item.note.split(/\r?\n/).filter(line => line.trim() !== "");
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

  // DOMに挿入
  detailCard.innerHTML = "";
  detailCard.appendChild(detailBox);

});
