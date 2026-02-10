let votes = [0, 0, 0];
let voted = false;

function vote(option) {
  if (voted) return;

  votes[option]++;
  voted = true;

  document.getElementById("results").innerHTML =
    "Results:<br>" +
    "Iwahashi: " + votes[0] + "<br>" +
    "Consolati: " + votes[1] + "<br>" +
    "Cao: " + votes[2];
}
