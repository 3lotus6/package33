// =========================
// 🔥 프레임 설정
// =========================
const rolls = {
  bojagi: {
    element: document.getElementById("bojagiRoll"),
    frames: [
      "images/bojagi1.png",
      "images/bojagi2.png",
      "images/bojagi3.png",
      "images/bojagi4.png",
      "images/bojagi5.png",
    ],
  },
  hologram: {
    element: document.getElementById("holoRoll"),
    frames: [
      "images/holo1.png",
      "images/holo2.png",
      "images/holo3.png",
      "images/holo4.png",
      "images/holo5.png",
    ],
  },
  vacuum: {
    element: document.getElementById("vacuumRoll"),
    frames: [
      "images/vacuum1.png",
      "images/vacuum2.png",
      "images/vacuum3.png",
      "images/vacuum4.png",
      "images/vacuum5.png",
    ],
  },
  kraft: {
    element: document.getElementById("kraftRoll"),
    frames: [
      "images/kraft1.png",
      "images/kraft2.png",
      "images/kraft3.png",
      "images/kraft4.png",
      "images/kraft5.png",
    ],
  },
  aircap: {
    element: document.getElementById("aircapRoll"),
    frames: [
      "images/aircap1.png",
      "images/aircap2.png",
      "images/aircap3.png",
      "images/aircap4.png",
      "images/aircap5.png",
    ],
  },
  gold: {
    element: document.getElementById("goldRoll"),
    frames: [
      "images/gold1.png",
      "images/gold2.png",
      "images/gold3.png",
      "images/gold4.png",
      "images/gold5.png",
    ],
  },
};
const cardBg = document.getElementById("card-bg");

const cardImages = {
  default: "card.png",

  bojagi: "images/card_bojagi.png",
  hologram: "images/card_holo.png",
  vacuum: "images/card_vacuum.png",
  kraft: "images/card_kraft.png",
  gold: "images/card_gold.png",
  aircap: "images/card_aircap.png",
};

// 첫 화면은 일반 카드
cardBg.style.backgroundImage = `url(${cardImages.default})`;
let currentSelected = null;
let intervals = {};

// =========================
// 🔥 펼치기
// =========================
function playForward(key) {
  const roll = rolls[key];
  if (!roll?.element) return;

  const img = roll.element.querySelector("img");
  let i = 0;
  clearInterval(intervals[key]);

  intervals[key] = setInterval(() => {
    img.src = roll.frames[i];
    i++;
    if (i >= roll.frames.length) {
      clearInterval(intervals[key]);
    }
  }, 80);
}

// =========================
// 🔥 되감기
// =========================
function playReverse(key) {
  const roll = rolls[key];
  if (!roll?.element) return;

  const img = roll.element.querySelector("img");
  let i = roll.frames.length - 1;
  clearInterval(intervals[key]);

  intervals[key] = setInterval(() => {
    img.src = roll.frames[i];
    i--;
    if (i < 0) {
      clearInterval(intervals[key]);
    }
  }, 80);
}

// =========================
// 🔥 이벤트 등록
// =========================
Object.keys(rolls).forEach((key) => {
  const roll = rolls[key];
  const el = roll.element;

  if (!el) return;

  const img = el.querySelector("img");

  // hover
  el.addEventListener("mouseenter", () => {
    if (currentSelected === key) return;
    playForward(key);
  });

  el.addEventListener("mouseleave", () => {
    if (currentSelected === key) return;
    playReverse(key);
  });

  // 클릭
  el.addEventListener("click", () => {
    // 같은 거 클릭 → 해제
    if (currentSelected === key) {
      el.classList.remove("active");
      playReverse(key);
      currentSelected = null;
      return;
    }

    // 기존 선택 해제
    if (currentSelected) {
      const prev = rolls[currentSelected];
      if (prev?.element) {
        prev.element.classList.remove("active");
        playReverse(currentSelected);
      }
    }

    // 새 선택
    currentSelected = key;
    el.classList.add("active");

    // 마지막 프레임 고정
    img.src = roll.frames[roll.frames.length - 1];
    console.log("선택된 스타일:", key);
  });
});

// =========================
// 🔥 textarea 제한
// =========================
const textarea = document.getElementById("input-text");

if (textarea) {
  textarea.addEventListener("input", () => {
    const lines = textarea.value.split("\n");
    if (lines.length > 2) {
      textarea.value = lines.slice(0, 2).join("\n");
    }
  });
}

// =========================
// 🔥 변환 (연기 효과 & 교체 포함)
// =========================
async function convert() {
  const inputEl = document.getElementById("input-text");
  const resultEl = document.getElementById("result-text");
  const btnEl = document.getElementById("convert-btn");
  const smokeEl = document.getElementById("smoke-overlay");
  const sparkleEl = document.getElementById("sparkle");
  const card = document.querySelector(".card-inner");

  if (!inputEl) return;

  const text = inputEl.value;

  if (!text) {
    alert("문장을 입력해 주세요!");
    return;
  }

  if (!currentSelected) {
    alert("포장지를 선택해 주세요!");
    return;
  }

  // 버튼 로딩 상태로 변경
  btnEl.disabled = true;

  let dots = 0;

  const loadingAnimation = setInterval(() => {
    dots = (dots + 1) % 4;
    btnEl.innerText = "포장 중" + ".".repeat(dots);
  }, 300);

  // 1. 연기 애니메이션 강제 시작

  smokeEl.classList.remove("smoke-active");
  void smokeEl.offsetWidth;
  smokeEl.classList.add("smoke-active");

  sparkleEl.classList.remove("sparkle-active");
  void sparkleEl.offsetWidth;
  sparkleEl.classList.add("sparkle-active");

  try {
    const res = await fetch("https://package33.onrender.com/convert", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: text,
        style: currentSelected,
      }),
    });

    let data;
    try {
      data = await res.json();

      clearInterval(loadingAnimation);

      card.classList.remove("flipping");
      void card.offsetWidth;
      card.classList.add("flipping");
      setTimeout(() => {
        cardBg.style.backgroundImage = `url(${cardImages[currentSelected]})`;
      }, 700);
    } catch {
      clearInterval(loadingAnimation);

      alert("서버 응답 오류 😢");
      btnEl.innerText = "포장하기";
      btnEl.disabled = false;
      return;
    }

    // 2. 연기가 가장 짙어지는 타이밍(약 500ms 뒤)에 텍스트와 버튼 교체
    setTimeout(() => {
      // 텍스트 교체
      inputEl.style.display = "none";
      resultEl.style.display = "block";
      let limitedResult = (data.result || "변환 실패 😢").slice(0, 47);
      limitedResult = limitedResult.replace(/^["'“”‘’]|["'“”‘’]$/g, "");

      resultEl.innerText = limitedResult;
      if (currentSelected === "bojagi") {
        resultEl.style.color = "#ffffff";
      } else {
        resultEl.style.color = "#5b2506"; // 기본 색
      }
      const saved = JSON.parse(localStorage.getItem("texts")) || [];

      const styleMap = {
        aircap: "에어캡",
        bojagi: "보자기",
        hologram: "홀로그램",
        vacuum: "진공팩",
        kraft: "크라프트지",
        gold: "황금",
      };

      saved.push({
        text: data.result,
        original: text,
        style: styleMap[currentSelected],
      });

      localStorage.setItem("texts", JSON.stringify(saved));

      // 버튼 교체 (포장하기 -> 재포장하기)
      btnEl.innerText = "재포장하기";
      btnEl.disabled = false;

      // 재포장하기 클릭 시 페이지 완전 새로고침
      btnEl.onclick = () => {
        location.reload();
      };
    }, 700);
  } catch (error) {
    clearInterval(loadingAnimation);

    console.error(error);
    alert("에러 발생 😢");
    btnEl.innerText = "포장하기";
    btnEl.disabled = false;
  }
}
