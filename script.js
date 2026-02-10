let votes = [0, 0, 0];
let voted = false; // 一度投票したら再度投票できないようにするフラグ
function vote(option) {
// すでに投票済みなら何もしない
if (voted) {
alert("You have already voted!"); // 念のため、投票済みであることを知らせるアラートを出しても良い
return;
}
// 選択されたオプションの票を増やす
votes[option]++;
// 投票済みフラグをtrueにする
voted = true;
// ボタンを無効にする（再度投票できないように）
document.querySelectorAll('.poll button').forEach(button => {
button.disabled = true;
});
// 結果を表示する
updateResultsDisplay();
}
function updateResultsDisplay() {
const resultsDiv = document.getElementById("results");
resultsDiv.innerHTML = `
<strong>Results:</strong><br>
Iwahashi: ${votes[0]}<br>
Consolati: ${votes[1]}<br>
Cao: ${votes[2]}
`;
}
// ページ読み込み時に初期結果を表示する（これは必須ではないですが、初期状態を明確にするため）
// document.addEventListener('DOMContentLoaded', updateResultsDisplay);
