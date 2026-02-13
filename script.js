let votes = [
[0, 0, 0, 0], // Q1
[0, 0],       // Q2
[0, 0]        // Q3
];

let voted = [false, false, false];

function vote(questionIndex, optionIndex) {

if (voted[questionIndex]) {
alert("You have already voted for this question!");
return;
}

votes[questionIndex][optionIndex]++;
voted[questionIndex] = true;

// その質問のボタンだけ無効化
const pollDiv = document.getElementsByClassName("poll")[questionIndex];
pollDiv.querySelectorAll("button").forEach(btn => btn.disabled = true);

updateResultsDisplay(questionIndex);
}

function updateResultsDisplay(qIndex) {

let resultsText = "<strong>Results:</strong><br>";

if (qIndex === 0) {
resultsText += `7pm: ${votes[0][0]}<br>
8pm: ${votes[0][1]}<br>
9pm: ${votes[0][2]}<br>
10pm: ${votes[0][3]}`;
}

if (qIndex === 1) {
resultsText += `Playa: ${votes[1][0]}<br>
Sobol: ${votes[1][1]}`;
}

if (qIndex === 2) {
resultsText += `Pikachu: ${votes[2][0]}<br>
Doraemon: ${votes[2][1]}`;
}

document.getElementById("results" + qIndex).innerHTML = resultsText;
}
