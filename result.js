/* =========================================
   결과 데이터 가져오기
========================================= */

const resultData = JSON.parse(localStorage.getItem("retoneResult"));

/* =========================================
   요소
========================================= */

const resultTypeEl = document.getElementById("resultType");

const resultShortEl = document.getElementById("resultShort");

const resultImageEl = document.getElementById("resultImage");

const resultMainEl = document.getElementById("resultMain");

const resultDesc1El = document.getElementById("resultDesc1");

const resultDesc2El = document.getElementById("resultDesc2");

const resultDesc3El = document.getElementById("resultDesc3");

const featureListEl = document.getElementById("featureList");

const jobListEl = document.getElementById("jobList");

/* =========================================
   유형 데이터
========================================= */

const types = {
  bojagi: {
    title: "보자기",

    short: `정중하고 격식 있는<br />클래식한 어조`,

    image: "images/bojagi.png",

    main: "당신은 상황을 단정하게 정리하는 보자기 유형입니다.",

    desc1:
      "예의와 균형을 중요하게 생각하며 관계를 안정적으로 유지하려고 합니다.",

    desc2:
      "감정을 과하게 드러내지 않지만 상대를 배려하는 표현을 자연스럽게 사용해요.",

    desc3: "차분하고 정돈된 말투 덕분에 신뢰를 주는 사람이 많습니다.",

    features: [
      "상황을 차분하게 정리함",
      "예의를 중요하게 생각함",
      "대화를 안정적으로 이끄는 편",
    ],

    jobs: ["기획자", "행정직", "프로젝트 매니저", "비서", "마케터", "아나운서"],
  },

  aircap: {
    title: "에어캡",

    short: `부드럽고 따뜻한<br />배려형 어조`,

    image: "images/bubble.png",

    main: "당신은 상대의 감정을 세심하게 살피는 에어캡 유형입니다.",

    desc1: "상대가 상처받지 않도록 말을 부드럽게 포장하는 능력이 뛰어납니다.",

    desc2: "분위기를 편안하게 만들며 사람들의 고민을 잘 들어주는 편이에요.",

    desc3: "다정한 말투 덕분에 주변 사람들이 안정감을 느낍니다.",

    features: [
      "배려 있는 표현을 자주 사용함",
      "상대 기분을 세심하게 살핌",
      "따뜻한 분위기를 만듦",
    ],

    jobs: ["상담사", "교사", "간호사", "복지사", "서비스직", "HR 담당자"],
  },

  vacuum: {
    title: "압축팩",

    short: `핵심만 빠르게 전달하는<br />직설형 어조`,

    image: "images/vacuum.png",

    main: "당신은 핵심을 빠르게 전달하는 압축팩 유형입니다.",

    desc1: "불필요한 표현 없이 요점을 정확하게 전달하는 스타일입니다.",

    desc2: "효율적인 대화를 선호하며 솔직한 표현을 중요하게 생각해요.",

    desc3:
      "가끔 차갑게 보일 수 있지만 오히려 명확해서 편하다는 사람도 많습니다.",

    features: [
      "핵심 위주로 말함",
      "직설적인 표현을 선호함",
      "효율적인 대화를 좋아함",
    ],

    jobs: ["개발자", "PD", "전략기획", "분석가", "엔지니어", "컨설턴트"],
  },

  gold: {
    title: "금박지",

    short: `리액션이 화려한<br />분위기 메이커형`,

    image: "images/gold.png",

    main: "당신은 분위기를 반짝이게 만드는 금박지 유형입니다.",

    desc1: "리액션과 표현이 풍부해서 주변 분위기를 밝게 만드는 편입니다.",

    desc2: "사람들과 감정을 활발하게 공유하며 에너지를 주고받는 걸 좋아해요.",

    desc3: "유쾌한 말투 덕분에 대화가 지루할 틈이 없습니다.",

    features: ["리액션이 풍부함", "분위기를 잘 띄움", "감정 표현이 솔직함"],

    jobs: [
      "방송인",
      "유튜버",
      "마케터",
      "홍보 담당자",
      "MC",
      "콘텐츠 크리에이터",
    ],
  },

  holo: {
    title: "홀로그램",

    short: `감정 표현이 풍부한<br />감성형 어조`,

    image: "images/holo.png",

    main: "당신은 감정을 솔직하고 풍부하게 표현하는 홀로그램 유형입니다.",

    desc1: "기분과 분위기를 중요하게 여기며 감정 전달에 능숙한 편입니다.",

    desc2: "공감 능력이 뛰어나며 사람들과 깊은 대화를 나누는 걸 좋아해요.",

    desc3: "감성적인 표현 덕분에 따뜻한 인상을 주는 경우가 많습니다.",

    features: [
      "감정 표현이 풍부함",
      "공감 능력이 뛰어남",
      "분위기에 민감한 편",
    ],

    jobs: ["작가", "디자이너", "예술가", "상담사", "에디터", "콘텐츠 기획자"],
  },

  kraft: {
    title: "크라프트지",

    short: `투박하지만 솔직한<br />현실형 어조`,

    image: "images/kraft.png",

    main: "당신은 꾸밈없이 솔직하게 말하는 크라프트지 유형입니다.",

    desc1: "감정보다 현실적인 해결과 진심 어린 표현을 중요하게 생각합니다.",

    desc2: "말투는 담백하지만 오히려 진정성이 느껴지는 경우가 많아요.",

    desc3: "겉은 무뚝뚝해 보여도 속은 따뜻한 사람이 많습니다.",

    features: [
      "솔직하게 표현함",
      "현실적인 해결을 선호함",
      "꾸밈없는 말투를 사용함",
    ],

    jobs: ["현장 관리자", "운영직", "요리사", "운동선수", "기술직", "사진작가"],
  },
};

/* =========================================
   가장 높은 점수 유형 찾기
========================================= */

let maxType = "aircap";

for (let type in resultData) {
  if (resultData[type] > resultData[maxType]) {
    maxType = type;
  }
}

/* =========================================
   최종 결과
========================================= */

const result = types[maxType];

/* 제목 */

resultTypeEl.innerHTML = result.title;

/* 짧은 설명 */

resultShortEl.innerHTML = result.short;

/* 이미지 */

resultImageEl.src = result.image;

resultImageEl.alt = result.title;

/* 설명 */

resultMainEl.textContent = result.main;

resultDesc1El.textContent = result.desc1;

resultDesc2El.textContent = result.desc2;

resultDesc3El.textContent = result.desc3;

/* 특징 */

result.features.forEach((feature) => {
  const li = document.createElement("li");

  li.textContent = feature;

  featureListEl.appendChild(li);
});

/* 직업 */

result.jobs.forEach((job) => {
  const li = document.createElement("li");

  li.textContent = job;

  jobListEl.appendChild(li);
});
const typeCard = document.getElementById("typeCard");

typeCard.classList.add(maxType);
