/* ======================================================
  include.js
  共通パーツ（head.html）を動的に読み込むスクリプト
====================================================== */

document.addEventListener("DOMContentLoaded", async () => {
  console.log("✅ include.js 読み込み開始");

  // ======================================================
  // ▼ <head> の読み込み
  // ======================================================
  try {
    const headResponse = await fetch("parts/head.html");
    if (!headResponse.ok) throw new Error("head.html の取得に失敗しました");

    const headHTML = await headResponse.text();
    document.head.insertAdjacentHTML("beforeend", headHTML);

    console.log("✅ head.html 読み込み完了");
  } catch (err) {
    console.error("❌ head.html の読み込みエラー:", err);
  }

  console.log("✨ include.js の処理が完了しました");
});

