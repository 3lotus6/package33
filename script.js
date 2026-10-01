const paperSound = document.getElementById("paperSound");
fetch("https://package33.onrender.com/ping").catch(() => {});
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
  bojagi: "images/card_bojagi.png",
  hologram: "images/card_holo.png",
  vacuum: "images/card_vacuum.png",
  kraft: "images/card_kraft.png",
  gold: "images/card_gold.png",
  aircap: "images/card_aircap.png",
};

// 첫 화면은 일반 카드

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

  el.addEventListener("mouseenter", () => {
    if (currentSelected === key) return;

    if (paperSound) {
      paperSound.currentTime = 0;
      paperSound.volume = 0.5;
      paperSound.play().catch(() => {});
    }

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
const textarea = document.getElementById("input-text");
const fakePlaceholder = document.querySelector(".fake-placeholder");
const inputWrap = document.querySelector(".input-wrap");

if (textarea && fakePlaceholder && inputWrap) {
  textarea.style.caretColor = "transparent";

  // 페이지 열리자마자 바로 입력 가능
  textarea.focus();

  inputWrap.addEventListener("click", () => {
    textarea.focus();
  });

  textarea.addEventListener("input", () => {
    const lines = textarea.value.split("\n");

    if (lines.length > 2) {
      textarea.value = lines.slice(0, 2).join("\n");
    }

    if (textarea.value.length > 0) {
      fakePlaceholder.style.display = "none";
      textarea.style.caretColor = "#999";
    } else {
      fakePlaceholder.style.display = "block";
      textarea.style.caretColor = "transparent";
    }
  });

  textarea.addEventListener("focus", () => {
    if (textarea.value.length === 0) {
      textarea.style.caretColor = "transparent";
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
  card.classList.add("loading");
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

    if (!res.ok) {
      const errorText = await res.text();
      console.error("서버 응답 오류:", res.status, errorText);
      throw new Error(`서버 오류 ${res.status}`);
    }

    const data = await res.json();

    console.log("서버 응답:", data);

    // 🔥 카드 축소 → 사라짐 → 새 카드 등장

    const sparkle = document.getElementById("sparkle");

    sparkle.classList.remove("sparkle-active");
    void sparkle.offsetWidth;
    sparkle.classList.add("sparkle-active");

    setTimeout(() => {
      sparkle.classList.remove("sparkle-active");
    }, 1200);
    // 카드가 사라지는 순간 새 카드 이미지로 교체
    const baseCard = document.querySelector(".base-card-image");
    if (baseCard && cardImages[currentSelected]) {
      const imagePath = cardImages[currentSelected];

      baseCard.src = imagePath;

      document
        .querySelector(".landing-dust")
        ?.style.setProperty("--dust-mask", `url("${imagePath}")`);
    }
    card.classList.remove("loading", "impact", "card-shine");
    void card.offsetWidth;
    card.classList.add("impact");

    setTimeout(() => {
      card.classList.add("card-shine");
    }, 1550);

    setTimeout(() => {
      card.classList.remove("impact", "card-shine");
    }, 2600);
    // 2. 연기가 가장 짙어지는 타이밍(약 500ms 뒤)에 텍스트와 버튼 교체
    setTimeout(() => {
      // 텍스트 교체
      inputEl.style.display = "none";
      resultEl.style.display = "block";
      let limitedResult = (data.result || "변환 실패 😢").slice(0, 47);
      limitedResult = limitedResult.replace(/^["'“”‘’]|["'“”‘’]$/g, "");
      function makeTwoLines(text) {
        const cleanText = text.trim();
        const words = cleanText.split(/\s+/);

        // 짧으면 굳이 두 줄로 나누지 않음
        if (cleanText.length <= 17) {
          return {
            firstLine: cleanText,
            secondLine: "",
          };
        }

        let bestFirst = cleanText;
        let bestSecond = "";
        let bestScore = Infinity;

        // 띄어쓰기 위치를 기준으로 가장 균형 좋은 줄바꿈 찾기
        for (let i = 1; i < words.length; i++) {
          const first = words.slice(0, i).join(" ");
          const second = words.slice(i).join(" ");

          // 한 줄이 너무 길어지는 경우 제외
          if (first.length > 24 || second.length > 24) continue;

          // 두 줄 길이 차이가 적을수록 좋음
          const difference = Math.abs(first.length - second.length);

          if (difference < bestScore) {
            bestScore = difference;
            bestFirst = first;
            bestSecond = second;
          }
        }

        return {
          firstLine: bestFirst,
          secondLine: bestSecond,
        };
      }
      const lines = makeTwoLines(limitedResult);

      resultEl.innerHTML = "";

      const line1 = document.createElement("span");
      line1.className = "result-line-1";
      line1.textContent = lines.firstLine;

      resultEl.appendChild(line1);

      if (lines.secondLine) {
        resultEl.appendChild(document.createElement("br"));

        const line2 = document.createElement("span");
        line2.className = "result-line-2";
        line2.textContent = lines.secondLine;

        resultEl.appendChild(line2);
      }
      resultEl.style.fontWeight = "700";
      // =========================
      // 🔥 포장지별 글꼴 & 글자색
      // =========================

      const styleText = {
        bojagi: {
          color: "#231c60",
          top: "47%",
          left: "50%",
          rotate: "10deg",
        },

        hologram: {
          color: "#3e3a64",
          top: "47%",
          left: "49%",
          rotate: "8deg",
        },

        vacuum: {
          color: "#4E4E4E",
          top: "45%",
          left: "50%",
          rotate: "8deg",
        },

        kraft: {
          color: "#5e2a00",
          top: "48%",
          left: "50%",
          rotate: "8deg",
        },

        gold: {
          color: "#472f03",
          top: "46%",
          left: "50%",
          rotate: "10deg",
        },

        aircap: {
          color: "#56616c",
          top: "47%",
          left: "50%",
          rotate: "11deg",
        },
      };
      const buttonStyle = {
        bojagi: {
          left: "47%",
          top: "64%",
          rotate: "10deg",
        },

        hologram: {
          left: "48%",
          top: "64%",
          rotate: "8deg",
        },

        vacuum: {
          left: "47%",
          top: "64%",
          rotate: "8deg",
        },

        kraft: {
          left: "46%",
          top: "68%",
          rotate: "8deg",
        },

        gold: {
          left: "47%",
          top: "65%",
          rotate: "10deg",
        },

        aircap: {
          left: "47%",
          top: "62%",
          rotate: "11deg",
        },
      };
      const selectedStyle = styleText[currentSelected];

      if (selectedStyle) {
        resultEl.style.color = selectedStyle.color;
        resultEl.style.top = selectedStyle.top;
        resultEl.style.left = selectedStyle.left;

        resultEl.style.transform = `translate(-50%, -50%) rotate(${selectedStyle.rotate})`;
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

      // 포장한 순간의 날짜와 시간
      const createdAt = Date.now();

      saved.push({
        id: createdAt,
        text: data.result,
        original: text,
        style: styleMap[currentSelected],
        createdAt: createdAt,
      });

      localStorage.setItem("texts", JSON.stringify(saved));
      // =========================
      // 🔥 재포장하기 버튼으로 변경
      // =========================

      btnEl.innerHTML = `
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20 11a8 8 0 0 0-15.5-2" />
    <path d="M4 4v5h5" />
    <path d="M4 13a8 8 0 0 0 15.5 2" />
    <path d="M20 20v-5h-5" />
  </svg>
  <span>재포장하기</span>
`;
      // 기존 포장지 색상 클래스 혹시 있으면 제거
      btnEl.classList.remove(
        "repackage-bojagi",
        "repackage-hologram",
        "repackage-vacuum",
        "repackage-kraft",
        "repackage-gold",
        "repackage-aircap",
      );

      // 유리 버튼 활성화
      btnEl.classList.add("repackage");

      // 현재 선택한 포장지 색 적용
      btnEl.classList.add(`repackage-${currentSelected}`);
      const selectedButtonStyle = buttonStyle[currentSelected];

      if (selectedButtonStyle) {
        btnEl.style.left = selectedButtonStyle.left;
        btnEl.style.top = selectedButtonStyle.top;
        btnEl.style.bottom = "auto";

        btnEl.style.transform = `translateX(-50%) rotate(${selectedButtonStyle.rotate})`;
      }
      btnEl.disabled = false;

      // 재포장하기 클릭 → 처음 상태로 돌아가기
      btnEl.onclick = () => {
        location.reload();
      };
    }, 0);
  } catch (error) {
    console.error("변환 오류:", error);

    alert("에러 발생 😢\n" + error.message);

    btnEl.innerText = "포장하기";
    btnEl.disabled = false;
  }
}
