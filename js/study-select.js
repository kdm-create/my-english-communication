// 🎓 study-select.js（完全対応版）
document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ study-select.js loaded");

  const buttons = document.querySelectorAll(".genre-btn");

  // 🔹 ジャンル名を正規化（数字・ドット・全角半角スペースを削除）
  function normalizeGenre(str) {
    return (str || "")
      .replace(/^[０-９0-9]+\.\s*/, "") // 「01. 」や「０１. 」を削除
      .replace(/\s+/g, "")             // スペース削除（全角・半角）
      .trim();
  }

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const genre = btn.dataset.genre;
      console.log("🎯 選択ジャンル:", genre);

      // 🔹 ジャンルを保存
      localStorage.setItem("selectedGenre", genre);

      // 🔹 データ取得
      const allData = loadData("wordData") || [];
      console.log("📦 全データ:", allData);

      // ✅ 正規化して比較
      const filtered = allData.filter(item => {
        const saved = normalizeGenre(item.genre);
        const selected = normalizeGenre(genre);
        return saved === selected;
      });

      console.log("📚 該当データ数:", filtered.length);

      if (filtered.length === 0) {
        alert(`「${genre}」ジャンルにはまだ問題が登録されていません。`);
        return;
      }

      localStorage.setItem("currentIndex", "0");
      location.href = "study-question.html";
    });
  });
});
