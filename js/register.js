document.addEventListener("DOMContentLoaded", () => {
  const step1 = document.getElementById("step1");
  const step2 = document.getElementById("step2");
  const nextBtn = document.querySelector(".next-btn");
  const backBtn = document.querySelector(".back-btn");

  // --- ステップ1 → ステップ2
  nextBtn.addEventListener("click", () => {
    step1.classList.remove("active");
    step1.classList.add("hidden");
    step2.classList.remove("hidden");
    step2.classList.add("active");
    window.scrollTo(0, 0);
  });

  // --- ステップ2 → ステップ1
  backBtn.addEventListener("click", () => {
    step2.classList.remove("active");
    step2.classList.add("hidden");
    step1.classList.remove("hidden");
    step1.classList.add("active");
    window.scrollTo(0, 0);
  });

  // --- 保存処理
const form2 = document.getElementById("step2");
form2.addEventListener("submit", (e) => {
  e.preventDefault();

  // 🔹 フォームで選択されたジャンルを取得（選択がない場合は「その他」）
  const selectedGenre = step2.querySelector("[name='genre']")?.value || "その他";

  // フォーム値まとめ
  const newWord = {
    jpSentence: step1.querySelector("[name='jpSentence']").value.trim(),
    highlight: step1.querySelector("[name='highlight']").value.trim(),
    enSentence: step1.querySelector("[name='enSentence']").value.trim(),
    answer: step1.querySelector("[name='answer']").value.trim(),
    hint: step2.querySelector("[name='hint']").value.trim(),
    word: step2.querySelector("[name='word']").value.trim(),
    meaning: step2.querySelector("[name='meaning']").value.trim(),
    note: step2.querySelector("[name='note']").value.trim(),
    genre: selectedGenre, // ✅ ← ここが実際のジャンル保存部分
    tags: []
  };

  // ✅ storage.js経由で保存
  const data = loadData("wordData");
  data.push(newWord);
  saveData("wordData", data);

  alert(`「${selectedGenre}」ジャンルに登録が完了しました！ 次の問題を入力できます。`);

  // 入力リセット
  step1.reset();
  step2.reset();

  // STEP1に戻す
  step2.classList.remove("active");
  step2.classList.add("hidden");
  step1.classList.remove("hidden");
  step1.classList.add("active");
  window.scrollTo(0, 0);
});

});
