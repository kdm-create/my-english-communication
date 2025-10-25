/* ==========================================================
   storage.js：Firebase Realtime Database 管理用
   ========================================================== */

// ✅ Firebase SDKのモジュールを読み込む
import { getDatabase, ref, push, get, remove, set, update } 
  from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// ✅ Firebaseアプリを初期化済みの状態で使う（index.htmlにfirebaseConfigあり）
const db = getDatabase();

/* -----------------------------------
   データ登録（単語追加など）
----------------------------------- */
export function saveData(key, value) {
  // key（例："wordData"）の下に自動生成IDで追加
  const dataRef = ref(db, key);
  push(dataRef, value);
}

/* -----------------------------------
   データ読み込み（一覧取得）
----------------------------------- */
export async function loadData(key) {
  const snapshot = await get(ref(db, key));
  if (snapshot.exists()) {
    // Firebaseのオブジェクト → 配列に変換
    const data = Object.entries(snapshot.val()).map(([id, item]) => ({
      id,
      ...item,
    }));
    return data;
  } else {
    return [];
  }
}

/* -----------------------------------
   データ削除（ID指定）
----------------------------------- */
export function clearData(key, id = null) {
  if (id) {
    // 特定のデータのみ削除
    remove(ref(db, `${key}/${id}`));
  } else {
    // 全削除
    remove(ref(db, key));
  }
}

/* -----------------------------------
   データ更新（既存データの編集など）
----------------------------------- */
export function updateData(key, id, newValue) {
  const targetRef = ref(db, `${key}/${id}`);
  update(targetRef, newValue);
}

/* -----------------------------------
   一意のID生成（従来互換）
----------------------------------- */
export function generateId() {
  return 'id-' + Math.random().toString(36).substr(2, 9);
}
