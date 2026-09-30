// =========================
// 10초 동안 조작 없으면 index.html로 이동
// =========================

const IDLE_TIME = 90 * 1000;

let idleTimer;

function resetIdleTimer() {
  clearTimeout(idleTimer);

  console.log("⏱ 타이머 다시 시작");

  idleTimer = setTimeout(() => {
    console.log("🚨 10초 경과");

    window.location.href = "index.html";
  }, IDLE_TIME);
}

const activityEvents = [
  "mousedown",
  "click",
  "keydown",
  "touchstart",
  "scroll",
];

activityEvents.forEach((eventName) => {
  window.addEventListener(eventName, resetIdleTimer, {
    passive: true,
  });
});

console.log("✅ common.js 실행됨");

resetIdleTimer();
