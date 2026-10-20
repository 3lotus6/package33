/* ───────── DOM 요소 ───────── */

const typingSound = document.getElementById("typingSound");
const clickSound = document.getElementById("clickSound");

const reBtn = document.getElementById("re-btn");
const typedText = document.getElementById("typed-text");
const reTooltip = document.getElementById("re-tooltip");

const colonArea = document.getElementById("colon-area");
const openingScene = document.getElementById("opening-scene");
const toneImage = document.getElementById("tone-image");

const pkgs = document.querySelectorAll(".pkg");

/* ───────── 커서 ───────── */

const cursor = document.createElement("span");
cursor.className = "cursor";

/* ───────── 시나리오 ───────── */

const STEPS = [
  {
    text: "빨리 해!",
    shakeIdx: -1,
  },

  {
    text: "조금만 서둘러\n주실 수 있나요?",
    shakeIdx: 0,
  },

  {
    text: "신속히 진행해 주시면\n감사드리겠습니다",
    shakeIdx: 2,
  },

  {
    text: "우리 조금만 더\n힘을 내볼까요?!",
    shakeIdx: 5,
  },

  {
    text: "같은 말도 포장에 따라\n다르게 전해집니다",
    shakeIdx: -1,
    isLast: true,
  },
];

/* ───────── 상태 ───────── */

let step = 0;
let typing = false;
let shakeInterval = null;

let currentText = "";
let transitioning = false;
let finished = false;

/* ───────── 효과음 ───────── */

function playSound(audio, volume = 1, rate = 1) {
  if (!audio) return;

  audio.pause();

  // 타이핑 음원은 앞부분의 무음을 건너뛰고 재생
  audio.currentTime = audio === typingSound ? 0.42 : 0;

  audio.volume = volume;
  audio.playbackRate = rate;

  audio.play().catch(() => {});
}

/* ───────── 포장지 흔들림 ───────── */

function shakePkg(idx) {
  if (idx < 0 || idx >= pkgs.length) return;

  const el = pkgs[idx];

  el.classList.remove("shake");

  void el.offsetWidth;

  el.classList.add("shake");

  setTimeout(() => {
    el.classList.remove("shake");
  }, 700);
}

/* ───────── 문장 크기 자동 조절 ───────── */

function fitStepText(text) {
  // 첫 번째 문장: 커서까지 포함해서 오른쪽 끝 정렬
  if (step === 0) {
    typedText.style.fontSize = "13vw";
    typedText.style.letterSpacing = "0px";

    const textArea = document.querySelector(".text-area");

    const style = getComputedStyle(typedText);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    ctx.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;

    const naturalWidth = ctx.measureText(text).width;
    const charCount = [...text].length;

    // 커서 너비 + 왼쪽 여백 + 안전 여백
    const cursorWidth = 3;
    const cursorMargin = 5;
    const safeGap = 12;

    const availableWidth =
      textArea.getBoundingClientRect().right -
      typedText.getBoundingClientRect().left -
      cursorWidth -
      cursorMargin -
      safeGap;

    if (charCount > 1) {
      const spacing = (availableWidth - naturalWidth) / charCount;

      typedText.style.letterSpacing = `${spacing}px`;
    }

    return;
  }

  if (!typedText) return;

  const textArea = document.querySelector(".text-area");

  if (!textArea) return;

  const availableWidth =
    textArea.getBoundingClientRect().right -
    typedText.getBoundingClientRect().left -
    8;

  if (availableWidth <= 0) return;

  const style = getComputedStyle(typedText);

  const baseSize = parseFloat(style.fontSize);
  const fontFamily = style.fontFamily;
  const fontWeight = style.fontWeight;

  const lines = text.split("\n");

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) return;

  ctx.font = `${fontWeight} ${baseSize}px ${fontFamily}`;

  const spacing = parseFloat(style.letterSpacing) || 0;

  const measurements = lines.map((line) => ({
    width: ctx.measureText(line).width,
    count: [...line].length,
  }));

  const longest = measurements.reduce((a, b) =>
    a.width + (a.count - 1) * spacing > b.width + (b.count - 1) * spacing
      ? a
      : b,
  );

  const naturalWidth = longest.width + Math.max(0, longest.count - 1) * spacing;

  if (naturalWidth <= availableWidth) return;

  let fittedSpacing = spacing;

  if (longest.count > 1) {
    fittedSpacing = (availableWidth - longest.width) / (longest.count - 1);
  }

  const minSpacing = -baseSize * 0.09;

  fittedSpacing = Math.max(fittedSpacing, minSpacing);

  typedText.style.letterSpacing = `${fittedSpacing}px`;

  const fittedWidth = Math.max(
    ...measurements.map(
      (item) => item.width + Math.max(0, item.count - 1) * fittedSpacing,
    ),
  );

  if (fittedWidth > availableWidth) {
    const scale = availableWidth / fittedWidth;

    typedText.style.fontSize = `${baseSize * scale}px`;
  }
}

/* ───────── 타이핑 효과 ───────── */

function typeText(text, onDone, hideCursorEnd = false) {
  typing = true;
  currentText = text;

  reBtn?.classList.remove("clickable");

  typedText.innerHTML = "";

  cursor.style.display = "inline-block";
  typedText.appendChild(cursor);

  let i = 0;
  const chars = [...text];

  function next() {
    if (i >= chars.length) {
      typing = false;

      if (hideCursorEnd) {
        cursor.style.display = "none";
      }

      if (onDone) onDone();

      return;
    }

    const ch = chars[i++];

    // 줄바꿈은 텍스트 노드로 삽입
    // white-space: pre에 의해 줄바꿈 적용
    const node = document.createTextNode(ch);

    typedText.insertBefore(node, cursor);

    const delay = ch === "\n" ? 80 : Math.random() * 40 + 40;

    setTimeout(next, delay);
  }

  next();
}

/* ───────── 텍스트 스타일 초기화 ───────── */

function resetTextStyle() {
  typedText.classList.remove(
    "small-text",
    "outline-text",
    "hahmlet-text",
    "final-text",
    "tone-mode",
    "visible",
  );

  typedText.style.opacity = "1";
  typedText.style.fontSize = "";
  typedText.style.letterSpacing = "";
  typedText.style.color = "";

  toneImage?.classList.remove("visible");
}

/* ───────── 마지막 TONE 이미지 표시 ───────── */

function showToneLogo() {
  // 타이핑 효과음 즉시 정지
  if (typingSound) {
    typingSound.pause();
    typingSound.currentTime = 0;
  }

  // 마지막 문장을 먼저 페이드아웃
  typedText.style.opacity = "0";

  setTimeout(() => {
    // 타이핑 텍스트 영역 숨김
    typedText.style.display = "none";

    // 실제 이미지로 TONE 표시
    if (toneImage) {
      // 기존 텍스트가 차지하던 자리 다음에
      // 이미지를 배치하도록 위치 조정
      const textArea = document.querySelector(".text-area");

      if (textArea) {
        const areaRect = textArea.getBoundingClientRect();

        const colonRect = colonArea.getBoundingClientRect();

        const imageLeft =
          colonRect.right - areaRect.left + window.innerWidth * 0.06;

        toneImage.style.left = `${imageLeft}px`;

        toneImage.style.width = `${Math.max(0, textArea.getBoundingClientRect().right - colonRect.right - window.innerWidth * 0.06)}px`;
      }

      // 자연스러운 이미지 페이드인
      requestAnimationFrame(() => {
        toneImage.classList.add("visible");
      });
    }

    // 로고 유지 후 전체 화면 페이드아웃
    setTimeout(() => {
      fadeToIndex();
    }, 2500);
  }, 1000);
}

/* ───────── 화면 전체 페이드아웃 ───────── */

function fadeToIndex() {
  if (transitioning) return;

  transitioning = true;

  // RE, TONE 이미지, 패키지, 선, 푸터 모두 사라짐
  openingScene.classList.add("fade-out");

  setTimeout(() => {
    window.location.href = "opening.html";
  }, 1250);
}

/* ───────── 단계 실행 ───────── */

function runStep(idx) {
  if (idx >= STEPS.length || finished) return;

  const s = STEPS[idx];

  resetTextStyle();

  reTooltip?.classList.remove("show");

  // 2번째 문장부터 2줄 텍스트
  if (idx > 0) {
    typedText.classList.add("small-text");
  }

  // 마지막 문장
  if (s.isLast) {
    typedText.classList.add("final-text");

    reBtn?.classList.add("disabled");
    reBtn?.classList.remove("clickable");
  }

  // 텍스트 폭 자동 조절
  fitStepText(s.text);

  // 이전 흔들림 중지
  if (shakeInterval) {
    clearInterval(shakeInterval);
    shakeInterval = null;
  }

  // 포장지 흔들기
  if (s.shakeIdx !== -1) {
    shakePkg(s.shakeIdx);

    shakeInterval = setInterval(() => {
      if (!typing) {
        clearInterval(shakeInterval);
        shakeInterval = null;
        return;
      }

      shakePkg(s.shakeIdx);
    }, 800);
  }
  if (s.isLast) {
    playSound(typingSound, 1, 1);

    // 타이핑 소리는 1초 후 정지
    setTimeout(() => {
      if (typingSound) {
        typingSound.pause();
        typingSound.currentTime = 0;
      }
    }, 1000);
  }

  typeText(
    s.text,

    () => {
      if (s.isLast) {
        finished = true;

        setTimeout(() => {
          showToneLogo();
        }, 1400);
      } else {
        reBtn?.classList.add("clickable");
        reTooltip?.classList.add("show");
      }
    },

    s.isLast,
  );
}

/* ───────── RE 버튼 클릭 ───────── */

if (reBtn) {
  reBtn.addEventListener("click", () => {
    if (typing || transitioning || finished) return;
    if (step >= STEPS.length - 1) return;

    // 마지막 단계 클릭 시에는 효과음 제외
    if (step < STEPS.length - 2) {
      playSound(clickSound);
    }

    step++;

    reTooltip?.classList.remove("show");

    runStep(step);
  });
}

/* ───────── 창 크기 변경 ───────── */

window.addEventListener("resize", () => {
  if (finished || transitioning) return;
  if (!currentText) return;

  typedText.style.fontSize = "";
  typedText.style.letterSpacing = "";

  fitStepText(currentText);
});

/* ───────── 오프닝 시작 ───────── */

window.addEventListener("load", () => {
  setTimeout(() => {
    runStep(0);
  }, 400);
});
