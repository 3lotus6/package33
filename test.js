const questions = [
  {
    question: "친구가 단체 채팅방에서 내 흑역사를 말했을 때 나는?",

    answers: [
      {
        text: "그 얘긴 조금 부끄럽다 😊",
        type: "aircap",
      },

      {
        text: "그 이야기는 여기까지만 하는 게 좋을 것 같아.",
        type: "bojagi",
      },

      {
        text: "나 진짜 얼굴 빨개졌어 😭",
        type: "holo",
      },

      {
        text: "그 얘기 하지 마.",
        type: "vacuum",
      },
    ],
  },

  {
    question: "팀플 자료를 아직 안 보낸 팀원에게 나는?",

    answers: [
      {
        text: "혹시 언제쯤 보내줄 수 있을까?",
        type: "aircap",
      },

      {
        text: "다들 기다리고 있어서 확인 부탁드립니다.",
        type: "bojagi",
      },

      {
        text: "나 이거 은근 초조하다 😂",
        type: "gold",
      },

      {
        text: "아직도 안 보냈어?",
        type: "vacuum",
      },
    ],
  },

  {
    question: "카페 주문이 너무 늦게 나올 때 나는?",

    answers: [
      {
        text: "혹시 주문이 누락됐을까요?",
        type: "bojagi",
      },

      {
        text: "엄청 바쁘신가 보다 🥹",
        type: "aircap",
      },

      {
        text: "제 음료 아직 멀었나요?",
        type: "vacuum",
      },

      {
        text: "나 목말라 죽기 직전이야 ☕",
        type: "gold",
      },
    ],
  },

  {
    question: "친구가 약속 시간에 늦었을 때 나는?",

    answers: [
      {
        text: "괜찮아~ 천천히 와!",
        type: "aircap",
      },

      {
        text: "몇 시쯤 도착하는지 알려줄래?",
        type: "bojagi",
      },

      {
        text: "나 혼자 멍하니 기다리는 중 😶",
        type: "holo",
      },

      {
        text: "왜 이렇게 늦어?",
        type: "vacuum",
      },
    ],
  },

  {
    question: "상대가 내 물건을 망가뜨렸을 때 나는?",

    answers: [
      {
        text: "일부러 그런 건 아니지?",
        type: "aircap",
      },

      {
        text: "다음부터는 조금만 더 조심 부탁할게.",
        type: "bojagi",
      },

      {
        text: "헉… 나 진짜 아끼던 건데 🥲",
        type: "holo",
      },

      {
        text: "이거 망가졌잖아.",
        type: "vacuum",
      },
    ],
  },

  {
    question: "과제를 너무 많이 받았을 때 나는?",

    answers: [
      {
        text: "조금 벅차긴 한데 열심히 해볼게요!",
        type: "aircap",
      },

      {
        text: "일정 조율이 가능할지 여쭤봐도 될까요?",
        type: "bojagi",
      },

      {
        text: "나 오늘 밤 새는 거 확정 😂",
        type: "gold",
      },

      {
        text: "이걸 다 하라고요?",
        type: "vacuum",
      },
    ],
  },

  {
    question: "친구가 너무 과한 선물을 줬을 때 나는?",

    answers: [
      {
        text: "마음만으로도 충분했는데 🥺",
        type: "aircap",
      },

      {
        text: "이렇게까지 챙겨줘서 정말 고마워.",
        type: "bojagi",
      },

      {
        text: "와 나 진짜 감동받았어 😭",
        type: "holo",
      },

      {
        text: "너무 비싼 거 아니야?",
        type: "vacuum",
      },
    ],
  },

  {
    question: "친구가 계속 연락을 많이 할 때 나는?",

    answers: [
      {
        text: "답장이 조금 늦어질 수도 있어 🥹",
        type: "aircap",
      },

      {
        text: "요즘 조금 정신이 없어서 답장이 늦을 수 있어.",
        type: "bojagi",
      },

      {
        text: "나 오늘 카톡창 터질 것 같아 😂",
        type: "gold",
      },

      {
        text: "연락 너무 많이 하는 거 아니야?",
        type: "vacuum",
      },
    ],
  },

  {
    question: "회의 의견이 마음에 들지 않을 때 나는?",

    answers: [
      {
        text: "다른 방향도 한번 생각해볼 수 있을 것 같아요.",
        type: "aircap",
      },

      {
        text: "조금 더 효율적인 방법도 있을 것 같습니다.",
        type: "bojagi",
      },

      {
        text: "뭔가 살짝 불안한 느낌이 드는데 😅",
        type: "holo",
      },

      {
        text: "그건 비효율적인데요.",
        type: "vacuum",
      },
    ],
  },

  {
    question: "친구가 내 비밀을 말했을 때 나는?",

    answers: [
      {
        text: "다음엔 조금만 더 조심해주라 🥲",
        type: "aircap",
      },

      {
        text: "그 이야기는 다른 사람들 앞에서는 안 하는 게 좋을 것 같아.",
        type: "bojagi",
      },

      {
        text: "나 진짜 서운했다 😭",
        type: "holo",
      },

      {
        text: "그 얘기 왜 했어?",
        type: "vacuum",
      },
    ],
  },

  {
    question: "발표 직전에 나는?",

    answers: [
      {
        text: "조금 떨리지만 잘 해볼게요 😊",
        type: "aircap",
      },

      {
        text: "차분하게 정리해서 전달해야겠다.",
        type: "bojagi",
      },

      {
        text: "심장 터질 것 같아 😵",
        type: "gold",
      },

      {
        text: "빨리 끝났으면 좋겠다.",
        type: "vacuum",
      },
    ],
  },

  {
    question: "친구가 고민 상담을 할 때 나는?",

    answers: [
      {
        text: "많이 힘들었겠다 🥺",
        type: "aircap",
      },

      {
        text: "상황을 하나씩 정리해보자.",
        type: "bojagi",
      },

      {
        text: "듣기만 해도 너무 속상해 😭",
        type: "holo",
      },

      {
        text: "그래서 해결은 어떻게 할 건데?",
        type: "vacuum",
      },
    ],
  },
];

/* =========================================
   점수
========================================= */

const scores = {
  aircap: 0,
  bojagi: 0,
  holo: 0,
  vacuum: 0,
  kraft: 0,
  gold: 0,
};

/* =========================================
   현재 질문 번호
========================================= */

let currentQuestion = 0;

/* =========================================
   요소
========================================= */

const questionEl = document.getElementById("question");

const choicesEl = document.getElementById("choices");

const progressEl = document.getElementById("progress");

const percentEl = document.getElementById("percent");

const questionCountEl = document.getElementById("questionCount");

/* =========================================
   질문 출력
========================================= */

function showQuestion() {
  const q = questions[currentQuestion];

  questionEl.innerHTML = `
    <span class="question-number">
      Q${currentQuestion + 1}
    </span>

    ${q.question}
  `;

  choicesEl.innerHTML = "";

  q.answers.forEach((answer) => {
    const button = document.createElement("button");

    button.classList.add("choice-btn");

    button.textContent = answer.text;

    button.addEventListener("click", () => selectAnswer(answer.type));

    choicesEl.appendChild(button);
  });

  updateProgress();
}

/* =========================================
   선택
========================================= */

function selectAnswer(type) {
  scores[type]++;

  currentQuestion++;

  if (currentQuestion < questions.length) {
    showQuestion();
  } else {
    localStorage.setItem("retoneResult", JSON.stringify(scores));

    showResultButton();
  }
}

/* =========================================
   진행률
========================================= */

function updateProgress() {
  const percent = Math.round(((currentQuestion + 1) / questions.length) * 100);

  progressEl.style.width = `${percent}%`;

  percentEl.textContent = `${percent}%`;

  questionCountEl.textContent = `QUESTION ${
    currentQuestion + 1
  } / ${questions.length}`;
}

/* =========================================
   결과 버튼 화면
========================================= */

function showResultButton() {
  const topCard = document.querySelector(".top-card");

  topCard.style.display = "none";

  const card = document.querySelector(".test-card");

  card.classList.add("finish-mode");

  card.innerHTML = `
    <div class="result-finish">
      <p class="finish-text">
        포장 유형 테스트가 완료되었어요!
      </p>

      <button class="result-btn">
     유형 확인하기
      </button>
    </div>
  `;

  const resultBtn = document.querySelector(".result-btn");

  resultBtn.addEventListener("click", () => {
    document.body.classList.add("page-out");

    setTimeout(() => {
      window.location.href = "result.html";
    }, 700);
  });
}

/* =========================================
   시작
========================================= */

showQuestion();
