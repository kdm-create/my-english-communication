/* ==========================================================
   study-answer.js：答え画面（解説を改行ごとにリスト表示＋正解数カウント）
   ========================================================== */
document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ study-answer.js loaded");

  const judgeText = document.getElementById("judgeText");
  const answerWord = document.getElementById("answerWord");
  const fullSentence = document.getElementById("fullSentence");
  const answerJp = document.getElementById("answerJp");
  const noteWord = document.getElementById("noteWord");
  const noteMeaning = document.getElementById("noteMeaning");
  const noteText = document.getElementById("noteText");
  const nextBtn = document.getElementById("nextBtn");
  const playAudioBtn = document.getElementById("playAudio");

  // 🔹 保存されたデータを取得
  const currentData = JSON.parse(localStorage.getItem("currentQuizData"));
  const userAnswer = localStorage.getItem("userAnswer") || "";
  const selectedGenre = localStorage.getItem("selectedGenre");

  if (!currentData) {
    alert("問題データが見つかりません。最初からやり直してください。");
    window.location.href = "study-select.html";
    return;
  }

  // 🔹 正誤判定（Font Awesomeアイコン使用）
  const isCorrect =
    userAnswer.toLowerCase().trim() === currentData.answer.toLowerCase().trim();

  if (isCorrect) {
    judgeText.innerHTML = `<i class="fa-regular fa-circle"></i> 正解！`;
    judgeText.classList.add("correct");
  } else {
    judgeText.innerHTML = `<i class="fa-solid fa-xmark"></i> 不正解`;
    judgeText.classList.add("incorrect");
  }

  // ======================================================
  // ✅ 正解・不正解の回数をカウントして保存（復習機能用）
  // ======================================================
  const allData = loadData("wordData") || [];
  const target = allData.find(item => item.id === currentData.id);

  if (target) {
    if (typeof target.correct !== "number") target.correct = 0;
    if (typeof target.wrong !== "number") target.wrong = 0;

    if (isCorrect) {
      target.correct += 1;
    } else {
      target.wrong += 1;
    }

    saveData("wordData", allData);
  }

  // 🔹 内容を表示
  answerWord.textContent = currentData.answer || "";
  fullSentence.textContent = currentData.enSentence || "";
  answerJp.textContent = currentData.jpSentence || "";
  noteWord.textContent = currentData.word || "";
  noteMeaning.textContent = currentData.meaning || "";

  // ✅ 改行ごとにリスト化（解説部分）
  noteText.innerHTML = ""; // 既存内容クリア
  if (currentData.note && currentData.note.trim() !== "") {
    const ul = document.createElement("ul");
    const lines = currentData.note.split(/\r?\n/);

    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed !== "") {
        const li = document.createElement("li");
        li.textContent = trimmed;
        ul.appendChild(li);
      }
    });

    noteText.appendChild(ul);
  } else {
    noteText.textContent = "(解説はありません)";
  }

  // 🔊 音声再生ボタン
  playAudioBtn.addEventListener("click", () => {
    if (!currentData.enSentence) return;

    try {
      const utter = new SpeechSynthesisUtterance(currentData.enSentence);
      utter.lang = "en-US";
      utter.rate = 0.9;
      utter.pitch = 1.0;
      utter.volume = 1.0;

      // 再生中アニメーションON
      playAudioBtn.classList.add("playing");

      // 再生終了でクラス解除（＝枠線なしの元の状態に戻る）
      utter.onend = () => {
        playAudioBtn.classList.remove("playing");
      };

      // 再生中なら止めてから新しく再生
      speechSynthesis.cancel();
      speechSynthesis.speak(utter);
    } catch (err) {
      alert("音声を再生できませんでした。");
      console.error(err);
    }
  });

  // 🔸 次の問題へ
  nextBtn.addEventListener("click", () => {
    const currentIndex = parseInt(localStorage.getItem("currentIndex") || "0", 10);
    const nextIndex = currentIndex + 1;
    localStorage.setItem("currentIndex", nextIndex.toString());

    const allData = loadData("wordData") || [];
    const genreData = selectedGenre
      ? allData.filter((d) => d.genre === selectedGenre)
      : allData;

    if (nextIndex >= genreData.length) {
      alert("このジャンルの問題はすべて終了しました。最初に戻ります。");
      localStorage.setItem("currentIndex", "0");
      window.location.href = "study-select.html";
      return;
    }

    window.location.href = "study-question.html";
  });
});
