document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ edit.js loaded");

  const step1 = document.getElementById("step1");
  const step2 = document.getElementById("step2");
  const nextBtn = document.querySelector(".next-btn");
  const backBtn = document.querySelector(".back-btn");
  const cancelBtn = document.getElementById("cancelBtn");

  // ✅ Step切り替え
  nextBtn.addEventListener("click", () => {
    step1.classList.remove("active");
    step1.classList.add("hidden");
    step2.classList.remove("hidden");
    step2.classList.add("active");
    window.scrollTo(0, 0);
  });

  backBtn.addEventListener("click", () => {
    step2.classList.remove("active");
    step2.classList.add("hidden");
    step1.classList.remove("hidden");
    step1.classList.add("active");
    window.scrollTo(0, 0);
  });

  cancelBtn.addEventListener("click", () => {
    if (confirm("編集をキャンセルしますか？")) {
      window.location.href = "database.html";
    }
  });

  // ✅ データ読み込み
  const data = loadData("wordData") || [];
  const editId = localStorage.getItem("editId");
  const item = data.find((d) => String(d.id) === String(editId));

  if (!item) {
    alert("編集対象のデータが見つかりません。");
    window.location.href = "database.html";
    return;
  }

  // ✅ 古いデータ構造(category)対応
  if (item.category && !item.genre) {
    item.genre = item.category;
    delete item.category; // ← 混乱防止のため削除！
  }

  // ✅ 既存データをフォームに反映
  document.getElementById("jpSentence").value = item.jpSentence || "";
  document.getElementById("highlight").value = item.highlight || "";
  document.getElementById("enSentence").value = item.enSentence || "";
  document.getElementById("answer").value = item.answer || "";
  document.getElementById("genre").value = item.genre || "";
  document.getElementById("hint").value = item.hint || "";
  document.getElementById("word").value = item.word || "";
  document.getElementById("meaning").value = item.meaning || "";
  document.getElementById("note").value = item.note || "";

  // ✅ 保存処理
  const form2 = document.getElementById("step2");
  form2.addEventListener("submit", (e) => {
    e.preventDefault();

    // 🔹 最新構造（category禁止、genre統一）
    item.jpSentence = document.getElementById("jpSentence").value.trim();
    item.highlight = document.getElementById("highlight").value.trim();
    item.enSentence = document.getElementById("enSentence").value.trim();
    item.answer = document.getElementById("answer").value.trim();
    item.genre = document.getElementById("genre").value.trim(); // ✅ 統一ポイント！
    item.hint = document.getElementById("hint").value.trim();
    item.word = document.getElementById("word").value.trim();
    item.meaning = document.getElementById("meaning").value.trim();
    item.note = document.getElementById("note").value.trim();

    // 🔹 古い category プロパティを完全削除
    delete item.category;

    saveData("wordData", data);
    alert("変更を保存しました。");
    window.location.href = "database.html";
  });
});
