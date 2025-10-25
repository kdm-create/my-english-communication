/* ======================================================
  include.js（修正版）
  head.html を動的に読み込みつつ、
  style.css を最優先で適用して FOUC を防止
====================================================== */

document.addEventListener("DOMContentLoaded", async () => {
  console.log("✅ include.js 読み込み開始");

  // ======================================================
  // ▼ head.html 読み込み処理
  // ======================================================
  try {
    const res = await fetch("parts/head.html");
    if (!res.ok) throw new Error("head.html の取得に失敗しました");

    const html = await res.text();
    const temp = document.createElement("div");
    temp.innerHTML = html;

    // ------------------------------------------------------
    // ✅ 1. CSSのみを最優先で適用
    // ------------------------------------------------------
    const cssLinks = temp.querySelectorAll('link[rel="stylesheet"]');
    cssLinks.forEach(link => {
      const href = link.getAttribute("href");
      // style.cssなどを最優先でheadに追加（重複チェックあり）
      if (href && !document.querySelector(`link[href="${href}"]`)) {
        const clone = link.cloneNode(true);
        document.head.appendChild(clone);
        console.log(`🎨 CSS 先行適用: ${href}`);
      }
      // 後で重複しないようにtempから削除
      link.remove();
    });

    // ------------------------------------------------------
    // ✅ 2. 残りの要素（meta・manifest・scriptなど）を追加
    // ------------------------------------------------------
    document.head.insertAdjacentHTML("beforeend", temp.innerHTML);
    console.log("✅ head.html 読み込み完了 & CSS優先適用済み");
  } catch (err) {
    console.error("❌ head.html の読み込みエラー:", err);
  }

  console.log("✨ include.js の処理が完了しました");
});
