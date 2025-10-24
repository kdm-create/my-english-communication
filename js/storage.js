/* ==========================================================
   storage.js：ローカルストレージ管理用
   ========================================================== */

// ✅ データの読み込み
function loadData(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

// ✅ データの保存
function saveData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// ✅ データの削除（キー単位）
function clearData(key) {
  localStorage.removeItem(key);
}

// ✅ データに一意のIDを自動付与（登録用ユーティリティ）
function generateId() {
  return 'id-' + Math.random().toString(36).substr(2, 9);
}
