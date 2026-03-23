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
  apiKey: "YOUR_API_KEY", // ←ここだけ自分のに戻す
  authDomain: "anonymous-voting-72546.firebaseapp.com",
  projectId: "anonymous-voting-72546",
  storageBucket: "anonymous-voting-72546.appspot.com",
  messagingSenderId: "122187938085",
  appId: "1:122187938085:web:3851149bbb70950a1dc2cc"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const pollsData = [
  {
    id: "curfew",
    question: "If the Curfew can be extended, when do you want it to be?",
    options: ["7pm", "8pm", "9pm", "10pm"]
  },
  {
    id: "acai",
    question: "Which acai bowl do you prefer to Uber?",
    options: ["Playa", "Sobol"]
  },
  {
    id: "anime",
    question: "Which Japanese anime is famous worldwide?",
    options: ["Pikachu", "Doraemon"]
  }
];

// 初期データ作成
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

// 投票（1人1回 + 競合防止）
async function vote(pollId, index) {
  const key = "voted_" + pollId;

  // すでに投票済み
  if (localStorage.getItem(key)) {
    alert("You have already voted!");
    return;
  }

  const pollRef = doc(db, "polls", pollId);

  try {
    await runTransaction(db, async (transaction) => {
      const docSnap = await transaction.get(pollRef);
      const data = docSnap.data();

      data.votes[index] += 1;

      transaction.update(pollRef, {
        votes: data.votes
      });
    });

    // 投票済み記録
    localStorage.setItem(key, "true");

    // ボタン無効化（即時反映）
    document.querySelectorAll(`[data-poll="${pollId}"] button`)
      .forEach(btn => btn.disabled = true);

  } catch (e) {
    console.error("Transaction failed:", e);
  }
}

// UI表示
function renderPoll(docSnap, container) {
  const data = docSnap.data();
  const pollDiv = document.createElement("div");
  pollDiv.style.marginBottom = "20px";
  pollDiv.setAttribute("data-poll", docSnap.id);

  const title = document.createElement("h2");
  title.innerText = data.question;
  pollDiv.appendChild(title);

  const key = "voted_" + docSnap.id;

  data.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.innerText = opt;
    btn.style.marginRight = "5px";

    // 投票済みなら無効
    if (localStorage.getItem(key)) {
      btn.disabled = true;
    }

    btn.onclick = () => vote(docSnap.id, i);
    pollDiv.appendChild(btn);
  });

  const resultsDiv = document.createElement("div");
  resultsDiv.style.marginTop = "10px";

  const updateResults = () => {
    resultsDiv.innerHTML = "<b>Results:</b><br>";
    data.options.forEach((opt, i) => {
      resultsDiv.innerHTML += `${opt}: ${data.votes[i]} votes<br>`;
    });
  };

  updateResults();
  pollDiv.appendChild(resultsDiv);

  // リアルタイム更新
  const pollRef = doc(db, "polls", docSnap.id);
  onSnapshot(pollRef, (snap) => {
    const updatedData = snap.data();
    data.votes = updatedData.votes;
    updateResults();
  });

  container.appendChild(pollDiv);
}

// 初期化
await createPollsIfNotExist();

const container = document.getElementById("polls");

// 表示
for (const poll of pollsData) {
  const pollRef = doc(db, "polls", poll.id);
  const docSnap = await getDoc(pollRef);

  if (docSnap.exists()) {
    renderPoll(docSnap, container);
  }
}
