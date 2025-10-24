/* ==========================================================
   review.js：復習モード（wrong >= 3 の単語を出題）
   ========================================================== */
document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ review.js loaded");

  const jpSentence = document.getElementById("jpSentence");
  const enSentence = document.getElementById("enSentence");
  const hintText = document.getElementById("hintText");
  const userAnswer = document.getElementById("userAnswer");
  const answerBtn = document.getElementById("answerBtn");
  const skipBtn = document.getElementById("skipBtn");

  // 🔹 全データ取得
  const allData = loadData("wordData") || [];

  // 🔹 不正解が3回以上のものを抽出
  const reviewList = allData.filter(item => (item.wrong || 0) >= 3);

  if (reviewList.length === 0) {
    alert("復習対象の単語はありません！（不正解3回以上のものがありません）");
    window.location.href = "index.html";
    return;
  }

  // 🔹 現在のインデックス
  let currentIndex = parseInt(localStorage.getItem("reviewIndex") || "0", 10);
  if (currentIndex >= reviewList.length) currentIndex = 0;

  const current = reviewList[currentIndex];
  localStorage.setItem("currentQuizData", JSON.stringify(current));

  // 🔹 表示
  jpSentence.innerHTML = current.jpSentence.replace(
    current.highlight || "",
    `<mark>${current.highlight || ""}</mark>`
  );

  // 答え部分を空欄にする
  if (current.enSentence && current.answer) {
    const blank = current.answer.split(" ").map(() => "(　)").join(" ");
    enSentence.textContent = current.enSentence.replace(current.answer, blank);
  } else {
    enSentence.textContent = current.enSentence || "";
  }

  hintText.textContent = current.hint || "";

  // 🔸 答えるボタン
  answerBtn.addEventListener("click", () => {
    const input = userAnswer.value.trim();
    localStorage.setItem("userAnswer", input);
    localStorage.setItem("reviewIndex", currentIndex.toString());
    window.location.href = "study-answer.html"; // 既存の答え画面を再利用
  });

  // 🔸 わからないボタン
  skipBtn.addEventListener("click", () => {
    localStorage.setItem("userAnswer", "");
    localStorage.setItem("reviewIndex", currentIndex.toString());
    window.location.href = "study-answer.html";
  });
});
