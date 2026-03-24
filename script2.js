import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  runTransaction
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAFke1UF4RkI-Y7HXX7x0I5gfPnls9Bod8",
  authDomain: "anonymous-voting-72546.firebaseapp.com",
  projectId: "anonymous-voting-72546",
  storageBucket: "anonymous-voting-72546.firebasestorage.app",
  messagingSenderId: "122187938085",
  appId: "1:122187938085:web:3851149bbb70950a1dc2cc"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 🔥 ページ2専用の質問
const pollsData = [
  {
    id: "investment_page2", // ページ2専用ID
    question: "Which one do you want to invest in the most?",
    options: [
      "Dorm-Voice",
      "Best Notes Market",
      "Did You Submit It?",
      "Is This Allowed?"
    ]
  }
];

// 以下コピペ（同じ処理）

async function createPollsIfNotExist() {
  for (const poll of pollsData) {
    const pollRef = doc(db, "polls", poll.id);
    const docSnap = await getDoc(pollRef);

    if (!docSnap.exists()) {
      await setDoc(pollRef, {
        question: poll.question,
        options: poll.options,
        votes: new Array(poll.options.length).fill(0)
      });
    }
  }
}

async function vote(pollId, index) {
  const key = "voted_" + pollId;

  if (localStorage.getItem(key) === "true") {
    alert("You already voted!");
    return;
  }

  const pollRef = doc(db, "polls", pollId);

  await runTransaction(db, async (transaction) => {
    const snap = await transaction.get(pollRef);
    const data = snap.data();

    data.votes[index]++;
    transaction.update(pollRef, { votes: data.votes });
  });

  localStorage.setItem(key, "true");

  document.querySelectorAll(`[data-poll="${pollId}"] button`)
    .forEach(btn => btn.disabled = true);
}

function renderPoll(docSnap, container) {
  const data = docSnap.data();
  const pollDiv = document.createElement("div");
  pollDiv.setAttribute("data-poll", docSnap.id);

  const title = document.createElement("h2");
  title.innerText = data.question;
  pollDiv.appendChild(title);

  const key = "voted_" + docSnap.id;

  data.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.innerText = opt;

    if (localStorage.getItem(key) === "true") {
      btn.disabled = true;
    }

    btn.onclick = () => vote(docSnap.id, i);
    pollDiv.appendChild(btn);
  });

  const resultsDiv = document.createElement("div");

  const updateResults = () => {
    resultsDiv.innerHTML = "<b>Results:</b><br>";
    data.options.forEach((opt, i) => {
      resultsDiv.innerHTML += `${opt}: ${data.votes[i]} votes<br>`;
    });
  };

  updateResults();
  pollDiv.appendChild(resultsDiv);

  const pollRef = doc(db, "polls", docSnap.id);
  onSnapshot(pollRef, (snap) => {
    const updatedData = snap.data();
    data.votes = updatedData.votes;
    updateResults();
  });

  container.appendChild(pollDiv);
}

await createPollsIfNotExist();

const container = document.getElementById("polls");

for (const poll of pollsData) {
  const pollRef = doc(db, "polls", poll.id);
  const docSnap = await getDoc(pollRef);

  if (docSnap.exists()) {
    renderPoll(docSnap, container);
  }
}
