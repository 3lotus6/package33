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

function shakePkg(idx) {
  if (idx < 0 || idx >= pkgs.length) return;
  const el = pkgs[idx];
  el.classList.remove("shake");
  void el.offsetWidth;
  el.classList.add("shake");
  setTimeout(() => el.classList.remove("shake"), 700);
}

function typeText(text, onDone, hideCursorEnd = false) {
  typing = true;
  if (reBtn && !reBtn.classList.contains("disabled"))
    reBtn.classList.remove("clickable");
  if (typedText) {
    typedText.innerHTML = "";
    cursor.style.display = "inline-block";
    typedText.appendChild(cursor);
  }
  let i = 0;
  function next() {
    if (i >= text.length) {
      typing = false;
      if (hideCursorEnd && cursor.parentNode) cursor.style.display = "none";
      if (onDone) onDone();
      return;
    }
    const ch = text[i++];
    const span = document.createElement("span");
    span.textContent = ch;
    if (typedText) typedText.insertBefore(span, cursor);
    const delay = ch === "\n" ? 80 : Math.random() * 40 + 40;
    setTimeout(next, delay);
  }
  next();
}

function runStep(idx) {
  if (idx >= STEPS.length) return;
  const s = STEPS[idx];

  if (idx > 0 && !s.isTone) typedText?.classList.add("small-text");
  else typedText?.classList.remove("small-text");

  if (s.isLast && reBtn) {
    reBtn.classList.add("disabled");
    reBtn.classList.remove("clickable");
  }

  if (shakeInterval) clearInterval(shakeInterval);
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
      if (s.isLast) {
        // 1. 문장 완성 후 1.4초간 유지
        setTimeout(() => {
          if (typedText) {
            typedText.style.opacity = "0"; // 문장 사라짐 시작
          }

          // 2. CSS의 transition(1초)이 끝날 때까지 기다린 후 내용 교체 (1000ms 대기)
          setTimeout(() => {
            if (typedText) {
              typedText.classList.remove("small-text");
              typedText.classList.add("tone-mode");
              typedText.innerHTML = "TONE";
              typedText.style.letterSpacing = "-0.05em";

              // 3. 내용 교체 후 0.1초 뒤에 다시 나타남 (안전한 전환)
              setTimeout(() => {
                typedText.style.opacity = "1";
                typedText.style.letterSpacing = "0em";
              }, 100);
            }

            // 4. TONE 노출 후 페이지 이동
            setTimeout(() => {
              window.location.href = "index.html";
            }, 2200);
          }, 1000);
        }, 1400);
      } else {
        if (reBtn && !reBtn.classList.contains("disabled"))
          reBtn.classList.add("clickable");
        if (reTooltip) reTooltip.classList.add("show");
      }
    },
    s.isLast,
  );
}

if (reBtn) {
  reBtn.addEventListener("click", () => {
    if (typing || step >= STEPS.length - 1) return;
    step++;
    if (reTooltip) reTooltip.classList.remove("show");
    runStep(step);
  });
}

window.addEventListener("load", () => {
  setTimeout(() => runStep(0), 400);
});
