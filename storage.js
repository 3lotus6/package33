/* =========================
   포장지 이미지 목록
========================= */

const boxImages = {
  에어캡: ["images/bubble.png", "images/bubble2.png"],

  보자기: ["images/bojagi.png", "images/bojagibox2.png"],

  홀로그램: ["images/holo.png", "images/holobox2.png"],

  진공팩: ["images/vacuum.png"],

  크라프트지: ["images/kraft.png", "images/kraftbox2.png"],

  황금: ["images/gold.png", "images/goldbox2.png"],
};

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

function getBoxImage(style, variantIndex = 0) {
  const images = boxImages[style];

  if (!images || images.length === 0) {
    return "images/kraft.png";
  }

  return images[variantIndex % images.length];
}

/* =========================
   박스 생성
========================= */

function createBox(item, imageIndex = 0) {
  const box = document.createElement("div");

  box.className = "box";

  const img = document.createElement("img");

  img.src = getBoxImage(item.style, imageIndex);
  img.className = "box-img";

  box.appendChild(img);

  box.dataset.text = item.text || "";
  box.dataset.original = item.original || "원문 없음";
  box.dataset.id = item.id || "";
  box.dataset.style = item.style || "";

  return box;
}

/* =========================
   박스 배치
========================= */

/* =========================
   박스 배치
========================= */

function arrangeWithoutAdjacentSameStyle(items) {
  const groups = {};

  items.forEach((item) => {
    const style = item.style || "크라프트지";

    if (!groups[style]) {
      groups[style] = [];
    }

    groups[style].push(item);
  });

  const result = [];
  let previousStyle = null;

  while (Object.values(groups).some((group) => group.length > 0)) {
    const candidates = Object.keys(groups)
      .filter((style) => groups[style].length > 0)
      .sort((a, b) => groups[b].length - groups[a].length);

    // 이전 포장지와 다른 종류를 우선 선택
    let selectedStyle = candidates.find((style) => style !== previousStyle);

    // 다른 종류가 없으면 어쩔 수 없이 선택
    if (!selectedStyle) {
      selectedStyle = candidates[0];
    }

    const item = groups[selectedStyle].shift();

    result.push(item);
    previousStyle = selectedStyle;
  }

  return result;
}
function createBoxes() {
  belt1.innerHTML = "";
  belt2.innerHTML = "";
  belt3.innerHTML = "";

  const arrangedTexts = arrangeWithoutAdjacentSameStyle(storedTexts);

  const belts = [belt1, belt2, belt3];

  const imageIndex = {};

  /*
   * 각 벨트에 들어간 포장지 종류 기록
   * 예:
   * belt1 마지막 = 에어캡
   * belt2 마지막 = 보자기
   * belt3 마지막 = 황금
   */
  const lastStyles = [null, null, null];

  arrangedTexts.forEach((item) => {
    const style = item.style || "크라프트지";

    // 이미지 번호
    if (imageIndex[style] === undefined) {
      imageIndex[style] = 0;
    }

    const box = createBox(item, imageIndex[style]);

    imageIndex[style]++;

    /*
     * 현재 포장지와 다른 포장지가
     * 마지막에 들어간 벨트만 선택
     */
    const availableBelts = [];

    for (let i = 0; i < 3; i++) {
      if (lastStyles[i] !== style) {
        availableBelts.push(i);
      }
    }

    let selectedBelt;

    if (availableBelts.length > 0) {
      // 가장 적게 들어간 벨트 선택
      selectedBelt = availableBelts.reduce((best, current) => {
        const bestCount = belts[best].children.length;

        const currentCount = belts[current].children.length;

        return currentCount < bestCount ? current : best;
      }, availableBelts[0]);
    } else {
      // 정말 가능한 벨트가 없을 경우
      selectedBelt = [0, 1, 2].reduce((best, current) => {
        return belts[current].children.length < belts[best].children.length
          ? current
          : best;
      }, 0);
    }

    belts[selectedBelt].appendChild(box);

    // 마지막 포장지 기록
    lastStyles[selectedBelt] = style;
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

  /*
   * 박스들을 처음부터 정확한 간격으로 배치
   */
  let currentX = window.innerWidth * offset;

  boxes.forEach((box) => {
    const width = box.offsetWidth;

    box.style.position = "absolute";
    box.dataset.x = currentX;
    box.style.left = `${currentX}px`;

    currentX += width + gap;
  });

  /*
   * 모든 박스가 차지하는 전체 길이
   */
  function getTotalWidth() {
    return boxes.reduce((total, box) => {
      return total + box.offsetWidth + gap;
    }, 0);
  }

  function animate() {
    const totalWidth = getTotalWidth();

    boxes.forEach((box) => {
      let x = parseFloat(box.dataset.x);

      x -= speed;

      box.dataset.x = x;
      box.style.left = `${x}px`;
    });

    /*
     * 가장 왼쪽에서 화면 밖으로 나간 박스를
     * 가장 오른쪽 박스 바로 뒤로 이동
     */
    boxes.forEach((box) => {
      const width = box.offsetWidth;
      const x = parseFloat(box.dataset.x);

      if (x + width < 0) {
        const rightmostBox = boxes.reduce((rightmost, current) => {
          return parseFloat(current.dataset.x) > parseFloat(rightmost.dataset.x)
            ? current
            : rightmost;
        }, boxes[0]);

        const rightmostX = parseFloat(rightmostBox.dataset.x);
        const rightmostWidth = rightmostBox.offsetWidth;

        const newX = rightmostX + rightmostWidth + gap;

        box.dataset.x = newX;
        box.style.left = `${newX}px`;
      }
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
    style: box.dataset.style,
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
    const front = document.querySelector(".card-front");
    const back = document.querySelector(".card-back");
    const packDate = document.getElementById("packDate");
    if (!modal || !text || !original) return;

    modal.classList.add("show");

    const card = document.querySelector(".card-flip");

    card.classList.remove("drop");

    // 다시 애니메이션 실행
    void card.offsetWidth;

    card.classList.add("drop");
    const frontImage = cardFrontImages[item.style];

    front.style.backgroundImage = `url(${frontImage})`;
    back.style.backgroundImage = 'url("images/card2.png")';

    front.style.setProperty("--card-mask", `url(${frontImage})`);
    back.style.setProperty("--card-mask", 'url("images/card2.png")');

    /* =========================
   포장 날짜 / 시간
========================= */

    if (packDate && item.id) {
      const date = new Date(Number(item.id));

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");

      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");

      packDate.textContent = `${year}.${month}.${day} ${hours}:${minutes}      포장됨`;
    }
    /* =========================
   포장지별 글꼴 + 색상
   언어 포장 페이지와 동일
========================= */
    const dateColors = {
      보자기: "#433c7f",
      홀로그램: "#76729b",
      진공팩: "#4E4E4E",
      크라프트지: "#815b3f",
      황금: "#664912",
      에어캡: "#aaafb4",
    };

    packDate.style.color = dateColors[item.style] || "#482c23";
    const styleText = {
      보자기: {
        color: "#231c60",
        fontFamily: '"Nanum Myeongjo", serif',
        fontSize: "0.95vw",
        left: "9%",
        top: "15%",
        lineHeight: "2.8",
      },

      홀로그램: {
        color: "#3e3a64",
        fontFamily: '"Nanum Myeongjo", serif',
        fontSize: "0.95vw",
        left: "9%",
        top: "15%",
        lineHeight: "2.8",
      },

      진공팩: {
        color: "#4E4E4E",
        fontFamily: '"Nanum Myeongjo", serif',
        fontSize: "0.95vw",
        left: "9%",
        top: "15%",
        lineHeight: "2.8",
      },

      크라프트지: {
        color: "#643e22",
        fontFamily: '"Nanum Myeongjo", serif',
        fontSize: "0.95vw",
        left: "9%",
        top: "15%",
        lineHeight: "2.8",
      },

      황금: {
        color: "#472f03",
        fontFamily: '"Nanum Myeongjo", serif',
        fontSize: "0.95vw",
        left: "9%",
        top: "15%",
        lineHeight: "2.8",
      },

      에어캡: {
        color: "#56616c",
        fontFamily: '"Nanum Myeongjo", serif',
        fontSize: "0.95vw",
        left: "9%",
        top: "15%",
        lineHeight: "2.8",
      },
    };

    const selectedStyle = styleText[item.style];

    if (selectedStyle) {
      text.style.color = selectedStyle.color;
    }
    const result = (item.text || "")
      .slice(0, 47)
      .replace(/^["'“”‘’]|["'“”‘’]$/g, "")
      .trim();

    function makeTwoLines(text) {
      const words = text.split(/\s+/);

      // 짧은 문장은 한 줄
      if (text.length <= 17) {
        return {
          firstLine: text,
          secondLine: "",
        };
      }

      let bestFirst = text;
      let bestSecond = "";
      let bestScore = Infinity;

      for (let i = 1; i < words.length; i++) {
        const first = words.slice(0, i).join(" ");
        const second = words.slice(i).join(" ");

        // 너무 긴 줄 제외
        if (first.length > 24 || second.length > 24) continue;

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

    const lines = makeTwoLines(result);

    text.textContent = "";
    text.append(document.createTextNode(lines.firstLine));

    if (lines.secondLine) {
      text.append(document.createElement("br"));
      text.append(document.createTextNode(lines.secondLine));
    }

    original.innerHTML = (item.original || "").replace(/\n/g, "<br>");

    modal.dataset.currentId = item.id;
  }, 500);
}

/* =========================
   카드 뒤집기
========================= */

function flipCard() {
  const card = document.getElementById("cardInner");

  if (!card) return;

  // 앞면 → 뒷면
  if (!card.classList.contains("flip")) {
    card.classList.add("breaking");

    setTimeout(() => {
      card.classList.add("flip");
      card.classList.remove("breaking");
    }, 320);
  } else {
    // 다시 앞면
    card.classList.remove("flip");
  }
}
/* =========================
   모달 닫기
========================= */

function closeModal() {
  const modal = document.getElementById("modal");

  if (modal) {
    modal.classList.remove("show");

    const card = document.querySelector(".card-flip");

    card.classList.remove("drop");
    card.style.opacity = "";
    card.style.transform = "";
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
const cardFrontImages = {
  에어캡: "images/card2_aircap.png",
  보자기: "images/card2_bojagi.png",
  홀로그램: "images/card2_holo.png",
  진공팩: "images/card2_vacuum.png",
  크라프트지: "images/card2_kraft.png",
  황금: "images/card2_gold.png",
};
/* =========================
   포장지별 폰트
========================= */

document.querySelectorAll(".rail").forEach((rail) => {
  const dotCount = 30;

  for (let i = 0; i < dotCount; i++) {
    const dot = document.createElement("div");

    dot.classList.add("rail-dot");

    dot.style.left = `calc(${i} * (100% - 0.5vw) / ${dotCount - 1})`;

    rail.appendChild(dot);
  }
});
