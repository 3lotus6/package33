// =========================
// 🔥 프레임 설정
// =========================
const rolls = {
  bojagi: {
    element: document.getElementById("bojagiRoll"),
    frames: [
      "bojagi1.png",
      "bojagi2.png",
      "bojagi3.png",
      "bojagi4.png",
      "bojagi5.png",
    ],
  },
  hologram: {
    element: document.getElementById("holoRoll"),
    frames: ["holo1.png", "holo2.png", "holo3.png", "holo4.png", "holo5.png"],
  },
  vacuum: {
    element: document.getElementById("vacuumRoll"),
    frames: [
      "vacuum1.png",
      "vacuum2.png",
      "vacuum3.png",
      "vacuum4.png",
      "vacuum5.png",
    ],
  },
  kraft: {
    element: document.getElementById("kraftRoll"),
    frames: [
      "kraft1.png",
      "kraft2.png",
      "kraft3.png",
      "kraft4.png",
      "kraft5.png",
    ],
  },
  aircap: {
    element: document.getElementById("aircapRoll"),
    frames: [
      "aircap1.png",
      "aircap2.png",
      "aircap3.png",
      "aircap4.png",
      "aircap5.png",
    ],
  },
  gold: {
    element: document.getElementById("goldRoll"),
    frames: ["gold1.png", "gold2.png", "gold3.png", "gold4.png", "gold5.png"],
  },
};

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
  btnEl.innerText = "포장 중...";
  btnEl.disabled = true;

  // 1. 연기 애니메이션 강제 시작
  smokeEl.classList.remove("smoke-active");
  void smokeEl.offsetWidth; // 애니메이션 재시작을 위한 트릭
  smokeEl.classList.add("smoke-active");

  try {
    const res = await fetch("http://localhost:3000/convert", {
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
    } catch {
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
      resultEl.innerText = data.result || "변환 실패 😢";

      // 버튼 교체 (포장하기 -> 재포장하기)
      btnEl.innerText = "재포장하기";
      btnEl.disabled = false;

      // 재포장하기 클릭 시 페이지 완전 새로고침
      btnEl.onclick = () => {
        location.reload();
      };
    }, 500);
  } catch (error) {
    console.error(error);
    alert("에러 발생 😢");
    btnEl.innerText = "포장하기";
    btnEl.disabled = false;
  }
}
