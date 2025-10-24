// ======================================================
// 画面遷移（トップページのボタン制御）
// ======================================================
function startStudy() {
  // 学習ジャンル選択ページへ遷移
  location.href = "study-select.html";
}

function registerQuestion() {
  location.href = "register.html";
}

function review() {
  location.href = "review.html";
}

function openVocab() {
  location.href = "vocab.html";
}

function openDB() {
  location.href = "database.html";
}

// ======================================================
// Service Worker 登録（PWA対応）
// ======================================================
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("sw.js")
      .then(() => {
        console.log("✅ Service Worker 登録完了");
      })
      .catch(err => {
        console.error("❌ Service Worker 登録エラー:", err);
      });
  });
}
