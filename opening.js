/* ─── DOM 요소 참조 ─── */
const reBtn = document.getElementById("re-btn");
const typedText = document.getElementById("typed-text");
const reTooltip = document.getElementById("re-tooltip");
const pkgs = document.querySelectorAll(".pkg");

const cursor = document.createElement("span");
cursor.className = "cursor";

/* ─── 시나리오 (STEPS) 정의 ─── */
const STEPS = [
  { text: "빨리 해!", shakeIdx: -1 },

  { text: "조금만 서둘러\n주실 수 있나요?", shakeIdx: 0 },

  { text: "신속히 진행해 주시면\n감사드리겠습니다", shakeIdx: 2 },

  { text: "우리 조금만 더\n힘을 내볼까요?!", shakeIdx: 5 },

  {
    text: "같은 말도 포장에 따라 \n다르게 전해집니다",
    shakeIdx: -1,
    isLast: true,
  },
];

let step = 0;
let typing = false;
let shakeInterval = null;

/* ─── 패키지 흔들기 ─── */
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

/* ─── 타이핑 효과 ─── */
function typeText(text, onDone, hideCursorEnd = false) {
  typing = true;

  if (reBtn && !reBtn.classList.contains("disabled")) {
    reBtn.classList.remove("clickable");
  }

  if (typedText) {
    typedText.innerHTML = "";

    cursor.style.display = "inline-block";

    typedText.appendChild(cursor);
  }

  let i = 0;

  function next() {
    if (i >= text.length) {
      typing = false;

      if (hideCursorEnd && cursor.parentNode) {
        cursor.style.display = "none";
      }

      if (onDone) onDone();

      return;
    }

    const ch = text[i++];

    const span = document.createElement("span");
    span.textContent = ch;

    if (typedText) {
      typedText.insertBefore(span, cursor);
    }

    const delay = ch === "\n" ? 80 : Math.random() * 40 + 40;

    setTimeout(next, delay);
  }

  next();
}

/* ─── 단계 실행 ─── */
function runStep(idx) {
  if (idx >= STEPS.length) return;

  const s = STEPS[idx];

  /* 기존 클래스 제거 */
  typedText?.classList.remove("small-text");
  typedText?.classList.remove("outline-text");
  typedText?.classList.remove("hahmlet-text");

  /* 작은 텍스트 */
  if (idx > 0 && !s.isTone) {
    typedText?.classList.add("small-text");
  }

  /* 마지막 문장 스타일 */
  if (s.isLast) {
    typedText?.classList.add("outline-text");
    typedText?.classList.add("hahmlet-text");
  }

  /* 마지막 단계 */
  if (s.isLast && reBtn) {
    reBtn.classList.add("disabled");
    reBtn.classList.remove("clickable");
  }

  /* 흔들림 */
  if (shakeInterval) {
    clearInterval(shakeInterval);
  }

  if (s.shakeIdx !== -1) {
    shakePkg(s.shakeIdx);

    shakeInterval = setInterval(() => {
      if (!typing && !s.isLast) {
        clearInterval(shakeInterval);
        return;
      }

      shakePkg(s.shakeIdx);
    }, 800);
  }

  typeText(
    s.text,
    () => {
      /* 마지막 단계 */
      if (s.isLast) {
        /* 문장 유지 */
        setTimeout(() => {
          if (typedText) {
            typedText.style.opacity = "0";
          }

          /* TONE 변경 */
          setTimeout(() => {
            if (typedText) {
              typedText.classList.remove("small-text");
              typedText.classList.remove("outline-text");
              typedText.classList.remove("hahmlet-text");

              typedText.classList.add("tone-mode");

              typedText.innerHTML = "TONE";

              typedText.style.letterSpacing = "-0.05em";

              setTimeout(() => {
                typedText.style.opacity = "1";
                typedText.style.letterSpacing = "0em";
              }, 100);
            }

            /* 페이지 이동 */
            setTimeout(() => {
              window.location.href = "index.html";
            }, 2200);
          }, 1000);
        }, 1400);
      } else {
        /* 다음 단계 클릭 가능 */
        if (reBtn && !reBtn.classList.contains("disabled")) {
          reBtn.classList.add("clickable");
        }

        /* 툴팁 표시 */
        if (reTooltip) {
          reTooltip.classList.add("show");
        }
      }
    },
    s.isLast,
  );
}

/* ─── 버튼 클릭 ─── */
if (reBtn) {
  reBtn.addEventListener("click", () => {
    if (typing || step >= STEPS.length - 1) return;

    step++;

    if (reTooltip) {
      reTooltip.classList.remove("show");
    }

    runStep(step);
  });
}

/* ─── 시작 ─── */
window.addEventListener("load", () => {
  setTimeout(() => {
    runStep(0);
  }, 400);
});
