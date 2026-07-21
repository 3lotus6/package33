/* =========================
   저장된 데이터 불러오기
========================= */

const allTexts = JSON.parse(localStorage.getItem("texts")) || [];

// 최근 24개만 표시
const storedTexts = allTexts.slice(-30);

const belt1 = document.getElementById("belt1");
const belt2 = document.getElementById("belt2");
const belt3 = document.getElementById("belt3");

/* =========================
   이미지 매핑
========================= */

function getBoxImage(style) {
  const map = {
    에어캡: "images/bubble.png",
    보자기: "images/bojagi.png",
    홀로그램: "images/holo.png",
    진공팩: "images/vacuum.png",
    크라프트지: "images/kraft.png",
    황금: "images/gold.png",
  };

  return map[style] || "images/kraft.png";
}

/* =========================
   박스 생성
========================= */

function createBox(item) {
  const box = document.createElement("div");

  box.className = "box";

  const img = document.createElement("img");

  img.src = getBoxImage(item.style);
  img.className = "box-img";

  box.appendChild(img);

  box.dataset.text = item.text || "";
  box.dataset.original = item.original || "원문 없음";
  box.dataset.id = item.id || "";

  return box;
}

/* =========================
   박스 배치
========================= */

function createBoxes() {
  belt1.innerHTML = "";
  belt2.innerHTML = "";
  belt3.innerHTML = "";

  storedTexts.forEach((item, index) => {
    const box = createBox(item);

    if (index % 3 === 0) {
      belt1.appendChild(box);
    } else if (index % 3 === 1) {
      belt2.appendChild(box);
    } else {
      belt3.appendChild(box);
    }
  });
}

createBoxes();

/* =========================
   컨베이어 애니메이션
========================= */

function startBelt(belt, speed, offset) {
  const boxes = Array.from(belt.children);

  if (boxes.length === 0) return;

  const gap = Math.min(Math.max(window.innerWidth * 0.03, 20), 140);

  /* 초기 위치 */
  boxes.forEach((box, index) => {
    const width = box.offsetWidth;

    const startX = window.innerWidth * offset + index * (width + gap);

    box.style.position = "absolute";

    box.dataset.x = startX;

    box.style.left = `${startX}px`;
  });

  function animate() {
    boxes.forEach((box) => {
      let x = parseFloat(box.dataset.x);

      x -= speed;

      const width = box.offsetWidth;

      /* 왼쪽 밖으로 사라지면 다시 오른쪽 */
      if (x < -width) {
        x = window.innerWidth + width;
      }

      box.dataset.x = x;

      box.style.left = `${x}px`;
    });

    requestAnimationFrame(animate);
  }

  animate();
}

/* =========================
   벨트 시작
========================= */

startBelt(belt1, 0.5, 0.08);
startBelt(belt2, 0.6, 0.22);
startBelt(belt3, 0.4, 0.14);

/* =========================
   클릭 이벤트
========================= */

document.addEventListener("click", (e) => {
  const box = e.target.closest(".box");

  if (!box) return;

  openBox(box, {
    text: box.dataset.text,
    original: box.dataset.original,
    id: box.dataset.id,
  });
});

/* =========================
   모달 열기
========================= */

function openBox(box, item) {
  box.classList.add("opening");

  setTimeout(() => {
    const modal = document.getElementById("modal");

    const text = document.getElementById("modalText");

    const original = document.getElementById("originalText");

    if (!modal || !text || !original) return;

    modal.style.display = "flex";

    text.innerHTML = item.text.replace(/\n/g, "<br>");

    original.innerHTML = item.original.replace(/\n/g, "<br>");

    modal.dataset.currentId = item.id;
  }, 300);
}

/* =========================
   카드 뒤집기
========================= */

function flipCard() {
  const card = document.getElementById("cardInner");

  if (card) {
    card.classList.toggle("flip");
  }
}

/* =========================
   모달 닫기
========================= */

function closeModal() {
  const modal = document.getElementById("modal");

  if (modal) {
    modal.style.display = "none";
  }

  document.querySelectorAll(".box").forEach((box) => {
    box.classList.remove("opening");
  });

  const card = document.getElementById("cardInner");

  if (card) {
    card.classList.remove("flip");
  }
}

/* =========================
   삭제 기능
========================= */

function deleteCurrentCard() {
  const modal = document.getElementById("modal");

  const currentId = Number(modal.dataset.currentId);

  if (!currentId) return;

  const updated = storedTexts.filter((item) => item.id !== currentId);

  localStorage.setItem("texts", JSON.stringify(updated));

  location.reload();
}

/* =========================
   ESC 닫기
========================= */

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeModal();
  }
});
