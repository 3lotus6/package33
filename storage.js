const storedTexts = JSON.parse(localStorage.getItem("texts")) || [];

const belt1 = document.getElementById("belt1");
const belt2 = document.getElementById("belt2");

/* 🔥 이미지 매핑 */
function getBoxImage(style) {
  switch (style) {
    case "에어캡":
      return "images/bubble.png";
    case "보자기":
      return "images/bojagi.png";
    case "홀로그램":
      return "images/holo.png";
    case "진공팩":
      return "images/vacuum.png";
    case "크라프트지":
      return "images/kraft.png";
    case "황금":
      return "images/gold.png";
    default:
      return "images/kraft.png";
  }
}

/* 🔥 박스 생성 */
function createBoxes(belt) {
  storedTexts.forEach((item) => {
    const box = document.createElement("div");
    box.className = "box";

    const img = document.createElement("img");
    img.src = getBoxImage(item.style);
    img.className = "box-img";

    box.appendChild(img);

    // 👉 dataset으로 데이터 저장 (중요)
    box.dataset.text = item.text;
    box.dataset.original = item.original || "원문 없음";

    belt.appendChild(box);
  });
}

createBoxes(belt1);
createBoxes(belt2);

/* 🔥 컨베이어 (무한 루프) */
function startBelt(belt, speed) {
  belt.innerHTML += belt.innerHTML; // 복제

  let x = 0;

  function animate() {
    x -= speed;

    if (x <= -belt.scrollWidth / 2) {
      x = 0;
    }

    belt.style.transform = `translateX(${x}px)`;

    requestAnimationFrame(animate);
  }

  animate();
}

startBelt(belt1, 0.4);
startBelt(belt2, 0.6);

/* 🔥 이벤트 위임 (복제된 박스도 클릭 가능) */
document.addEventListener("click", (e) => {
  const box = e.target.closest(".box");
  if (!box) return;

  openBox(box, {
    text: box.dataset.text,
    original: box.dataset.original,
  });
});

/* 🔥 모달 열기 */
function openBox(box, item) {
  box.classList.add("opening");

  setTimeout(() => {
    const modal = document.getElementById("modal");
    const text = document.getElementById("modalText");
    const original = document.getElementById("originalText");

    // 👉 안전 체크 (에러 방지)
    if (!modal || !text || !original) {
      console.error("❌ 모달 요소 없음 (HTML 확인)");
      return;
    }

    modal.style.display = "flex";
    text.innerText = item.text;
    original.innerText = item.original;
  }, 300);
}

/* 🔥 카드 뒤집기 */
function flipCard() {
  const card = document.getElementById("cardInner");
  if (card) {
    card.classList.toggle("flip");
  }
}

/* 🔥 모달 닫기 */
function closeModal() {
  const modal = document.getElementById("modal");
  if (modal) modal.style.display = "none";

  document.querySelectorAll(".box").forEach((box) => {
    box.classList.remove("opening");
  });
}
