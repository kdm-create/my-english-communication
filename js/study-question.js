document.addEventListener("DOMContentLoaded", () => {
  const jpSentence = document.getElementById("jpSentence");
  const enSentence = document.getElementById("enSentence");
  const hintText = document.getElementById("hintText");
  const userAnswer = document.getElementById("userAnswer");
  const answerBtn = document.getElementById("answerBtn");
  const skipBtn = document.getElementById("skipBtn");

  // 🔹 ジャンル取得
  const selectedGenre = localStorage.getItem("selectedGenre");
  if (!selectedGenre) {
    alert("ジャンルが選択されていません。");
    location.href = "study-select.html";
    return;
  }

  // 🔹 データ取得
  const allData = loadData("wordData") || [];
  const data = allData.filter(item => item.genre === selectedGenre);

  if (data.length === 0) {
    alert(`「${selectedGenre}」ジャンルに登録された問題がありません。`);
    location.href = "study-select.html";
    return;
  }

  // 🔹 インデックス管理
  let currentIndex = parseInt(localStorage.getItem("currentIndex") || "0", 10);
  if (currentIndex >= data.length) currentIndex = 0;
  const current = data[currentIndex];
  localStorage.setItem("currentQuizData", JSON.stringify(current));

  // 🔹 日本語文
  if (current.highlight) {
    jpSentence.innerHTML = current.jpSentence.replace(
      current.highlight,
      `<mark>${current.highlight}</mark>`
    );
  } else {
    jpSentence.textContent = current.jpSentence || "";
  }

  // 🔹 英文（空欄化）
  if (current.enSentence && current.answer) {
    const blank = current.answer.split(" ").map(() => "(　)").join(" ");
    const regex = new RegExp(current.answer, "g");
    enSentence.textContent = current.enSentence.replace(regex, blank);
  } else {
    enSentence.textContent = current.enSentence || "";
  }

  // 🔹 ヒント
  hintText.textContent = current.hint || "";

  // 🔹 移動共通処理
  function goToAnswer(userInput) {
    localStorage.setItem("userAnswer", userInput);
    localStorage.setItem("currentIndex", currentIndex.toString());
    location.href = "study-answer.html";
  }

  answerBtn.addEventListener("click", () => goToAnswer(userAnswer.value.trim()));
  skipBtn.addEventListener("click", () => goToAnswer(""));

  // 🔹 Enterキー送信対応
  userAnswer.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      goToAnswer(userAnswer.value.trim());
    }
  });
});
