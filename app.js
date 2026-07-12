const game = document.querySelector("#game");
const backdrop = document.querySelector("#backdrop");
const characterSprite = document.querySelector("#characterSprite");
const speaker = document.querySelector("#speaker");
const phase = document.querySelector("#phase");
const storyText = document.querySelector("#storyText");
const feedback = document.querySelector("#feedback");
const choices = document.querySelector("#choices");
const safetyNote = document.querySelector("#safetyNote");
const restartButton = document.querySelector("#restartButton");
const safetyValue = document.querySelector("#safetyValue");
const affectionValue = document.querySelector("#affectionValue");
const calmValue = document.querySelector("#calmValue");

const SAVE_KEY = "sumin-earthquake-vn-v3-save";

const backgrounds = {
  classroom: "assets/generated/classroom-vn.png",
  hallway: "assets/generated/hallway-vn.png",
  stairs: "assets/generated/stairs-vn.png",
  playground: "assets/generated/playground-vn.png"
};

const characterSprites = {
  normal: "assets/generated/sumin-real-vn.png",
  worried: "assets/generated/sumin-real-vn.png",
  smile: "assets/generated/sumin-real-vn.png"
};

const initialState = {
  scene: "rumor",
  safety: 0,
  affection: 0,
  calm: 0,
  lastFeedback: "",
  gameOverMessage: ""
};

let state = { ...initialState };

const scenes = {
  rumor: {
    bg: "classroom",
    mood: "calm",
    sprite: "normal",
    phase: "전학생 아님",
    speaker: "우리 반",
    text:
      "교실 문이 드르륵 열린다.\n" +
      "담임 뒤로 낯선 남학생이 들어오자, 반 전체가 갑자기 와이파이 잡힌 단톡방처럼 술렁인다.\n\n" +
      "“야야... 쟤 6반 훈남 이수민 아냐?”\n" +
      "“헉, 그 아이돌 준비한다는 애?”\n" +
      "“왜 우리 반에 와? 몰래카메라야?”",
    note: "오늘은 지진 대피 훈련 날이다. 하지만 진짜 지진은 훈련 타이밍을 봐주지 않는다.",
    choices: [
      {
        label: "눈 마주치기",
        text: "수민과 눈이 마주친 순간 아무렇지 않은 척한다.",
        next: "romance",
        effects: { affection: 2, calm: 1 },
        tone: "romance",
        feedback: "수민이 네 쪽을 보고 아주 작게 웃는다. 뒤에서 누가 책상을 쾅 친다. 질투인지 지진 전조인지는 아직 모른다."
      },
      {
        label: "필통 정리",
        text: "관심 없는 척 필통만 똑바로 세운다.",
        next: "romance",
        effects: { calm: 2, affection: 1 },
        tone: "safe",
        feedback: "너무 태연해서 오히려 수상하다. 수민의 시선이 네 책상에서 멈춘다."
      },
      {
        label: "친구 찌르기",
        text: "옆 친구에게 “아이돌 준비생 맞아?”라고 속삭인다.",
        next: "romance",
        effects: { affection: 1 },
        tone: "romance",
        feedback: "속삭였다고 생각했는데 생각보다 컸다. 수민이 들은 것 같다. 망했다. 아니, 웃었다."
      }
    ]
  },
  romance: {
    bg: "classroom",
    mood: "calm",
    sprite: "normal",
    phase: "직진 이벤트",
    speaker: "이수민",
    text:
      "담임이 출석부를 덮기도 전에 수민이 네 자리로 걸어온다.\n" +
      "반 애들의 목이 한꺼번에 네 쪽으로 돌아간다. 칠판보다 네 책상이 더 중요한 수업 자료가 된 순간이다.\n\n" +
      "수민이 책상 모서리에 손을 얹고 낮게 말한다.\n" +
      "“오늘 대피훈련 파트너, 너로 정했어. 이상하지? 아까 문 열고 들어왔을 때부터... 네 자리만 보였거든.”",
    note: "로맨스 이벤트가 시작돼도 대피로와 책상 아래 공간은 봐 둬야 한다. 설렘은 안전을 대신하지 못한다.",
    choices: [
      {
        label: "심장 방어",
        text: "“그 멘트, 훈련보다 위험한데.”",
        next: "quakeStart",
        effects: { affection: 3 },
        tone: "romance",
        feedback: "수민의 귀 끝이 살짝 붉어진다. 주변에서 조용히 난리가 난다."
      },
      {
        label: "파트너 수락",
        text: "“좋아. 대신 진짜 상황이면 내 말 잘 들어.”",
        next: "quakeStart",
        effects: { safety: 1, calm: 2, affection: 2 },
        tone: "safe",
        feedback: "수민이 바로 고개를 끄덕인다. “응. 네가 말하면 들을게.” 이거 고백은 아닌데 아무튼 위험하다."
      },
      {
        label: "고장 난 대답",
        text: "“네? 저요? 네? 저요?”만 반복한다.",
        next: "quakeStart",
        effects: { affection: 1, calm: -1 },
        tone: "romance",
        feedback: "수민이 웃음을 참는다. 반 애들은 이미 오늘의 주인공을 너로 확정했다."
      }
    ]
  },
  quakeStart: {
    bg: "classroom",
    mood: "quake",
    sprite: "worried",
    phase: "진짜 지진",
    speaker: "교실",
    text:
      "그 순간, 바닥이 낮게 우르릉거린다.\n" +
      "처음엔 누가 책상을 민 줄 알았다. 그런데 창문이 덜컥거리고, 형광등이 좌우로 흔들린다.\n\n" +
      "“어... 이거 훈련 효과음 아니지?”\n" +
      "수민이 네 앞으로 한 걸음 다가온다. 표정이 진지해졌다.\n" +
      "“너라면 알 것 같아서. 지금, 어떻게 해야 해?”",
    note: "흔들림이 시작되면 먼저 낮아지고, 머리와 목을 보호하고, 튼튼한 책상이나 탁자를 붙잡는다.",
    choices: [
      {
        label: "정답 외치기",
        text: "“책상 아래! 머리랑 목 가리고 책상 다리 잡아!”",
        next: "underDesk",
        effects: { safety: 4, calm: 3, affection: 2 },
        tone: "safe",
        feedback: "네 목소리가 교실 소음을 뚫고 나간다. 수민은 0.1초도 안 망설이고 네 말대로 몸을 낮춘다."
      },
      {
        label: "복도런",
        text: "“일단 복도로 뛰어! 빠른 사람이 살아!”",
        gameOver:
          "GAME OVER\n\n6반 존잘남 이수민은 당신 때문에 사망했습니다...\n사유: 복도런 메타를 믿고 스피드런을 시도함.\n대피 훈련 게임에서 RTA 찍으면 안 됩니다.",
        tone: "danger"
      },
      {
        label: "창밖 확인",
        text: "“창문 쪽으로 가서 밖부터 보자!”",
        gameOver:
          "GAME OVER\n\n6반 존잘남 이수민은 당신 때문에 사망했습니다...\n사유: 유리창과 너무 가까운 사이가 됨.\n로맨스는 거리 좁히는 장르지만, 지진 때 창문과는 거리 둬야 합니다.",
        tone: "danger"
      }
    ]
  },
  underDesk: {
    bg: "classroom",
    mood: "quake",
    sprite: "worried",
    phase: "책상 아래",
    speaker: "이수민",
    text:
      "두 사람은 책상 아래로 들어간다. 위에서 분필통이 떨어지고, 교실 뒤 책장이 끼익 소리를 낸다.\n" +
      "수민이 책상 다리를 잡은 채 너를 본다. 가까워서 숨소리까지 들린다.\n\n" +
      "“방금 너... 좀 멋있었다.”\n" +
      "말은 설레는데 바닥은 계속 흔들린다. 아직 끝난 게 아니다.",
    note: "흔들림이 계속되는 동안에는 보호 자세를 유지한다. 휴대폰 확인이나 이동은 흔들림이 멈춘 뒤가 안전하다.",
    choices: [
      {
        label: "붙잡고 유지",
        text: "“아직 움직이지 마. 계속 머리 가리고 책상 잡고 있어.”",
        next: "afterShake",
        effects: { safety: 3, calm: 2, affection: 2 },
        tone: "safe",
        feedback: "수민이 네 말에 맞춰 자세를 더 낮춘다. “알겠어. 나 지금 네 말만 들을게.”"
      },
      {
        label: "폰부터 확인",
        text: "“진원지 검색해야 돼. 휴대폰 꺼내!”",
        gameOver:
          "GAME OVER\n\n6반 존잘남 이수민은 당신 때문에 사망했습니다...\n사유: 긴급 상황에서 검색왕이 되려다 실패.\n지식욕은 훌륭하지만, 흔들릴 땐 머리부터 보호하세요.",
        tone: "danger"
      },
      {
        label: "고백 타임",
        text: "“이 분위기면 지금 고백 각 아니야?”",
        gameOver:
          "GAME OVER\n\n6반 존잘남 이수민은 당신 때문에 사망했습니다...\n사유: 지진 중 고백 이벤트 강제 발생.\n이벤트 타이밍이 너무 레전드라 엔딩이 날아갔습니다.",
        tone: "romance"
      }
    ]
  },
  afterShake: {
    bg: "classroom",
    mood: "calm",
    sprite: "normal",
    phase: "흔들림 멈춤",
    speaker: "담임",
    text:
      "큰 흔들림이 잦아들자 교실에 짧은 정적이 내려앉는다.\n" +
      "담임이 출입문 쪽을 확인하며 외친다.\n\n" +
      "“다친 사람 확인하고, 줄 맞춰 운동장으로 이동한다. 뛰지 말고 선생님 지시 따라!”\n\n" +
      "수민이 네 옆에서 작게 묻는다. “이제 바로 나가면 돼?”",
    note: "흔들림이 멈춘 뒤에는 주변 위험과 부상자를 확인하고, 지시에 따라 질서 있게 대피한다.",
    choices: [
      {
        label: "질서 대피",
        text: "“주변 확인하고 선생님 지시에 맞춰 천천히. 뛰면 더 위험해.”",
        next: "hallway",
        effects: { safety: 4, calm: 2, affection: 2 },
        tone: "safe",
        feedback: "수민이 넘어진 의자를 치워 길을 만든다. 네가 말하자마자 움직이는 게 너무 자연스러워서 조금 설렌다."
      },
      {
        label: "엘리베이터",
        text: "“계단 붐비니까 엘리베이터 타자.”",
        gameOver:
          "GAME OVER\n\n6반 존잘남 이수민은 당신 때문에 사망했습니다...\n사유: 엘리베이터 엔딩 탑승.\n지진 대피에서 엘리베이터는 로맨틱 밀실이 아니라 위험 버튼입니다.",
        tone: "danger"
      },
      {
        label: "가방 찾기",
        text: "“잠깐, 내 가방 예쁜 거라 두고 못 가.”",
        gameOver:
          "GAME OVER\n\n6반 존잘남 이수민은 당신 때문에 사망했습니다...\n사유: 당신의 가방 집착을 기다림.\n명품보다 생존이 먼저입니다. 아니, 교복 가방이면 더더욱.",
        tone: "danger"
      }
    ]
  },
  hallway: {
    bg: "hallway",
    mood: "calm",
    sprite: "normal",
    phase: "복도",
    speaker: "이수민",
    text:
      "복도에는 다른 반 학생들이 이미 줄을 만들고 있다.\n" +
      "창가 쪽에는 작은 유리 조각이 반짝이고, 누군가 울먹이는 소리가 난다.\n\n" +
      "수민이 네 가방 끈을 살짝 잡아 정리해 준다.\n" +
      "“나 지금 좀 떨리는데... 네가 또 말해 줘. 어디로 가야 해?”",
    note: "복도에서는 창문에서 떨어지고, 머리를 보호하고, 뛰지 않으며 줄을 유지한다.",
    choices: [
      {
        label: "가방 방패",
        text: "“가방으로 머리 가리고 창문 반대편. 줄 유지하고 천천히.”",
        next: "stairs",
        effects: { safety: 4, calm: 2, affection: 2 },
        tone: "safe",
        feedback: "수민이 바로 가방을 들어 머리를 보호한다. “너 진짜 침착하다.” 그의 목소리가 조금 낮아진다."
      },
      {
        label: "브이로그",
        text: "“이거 찍으면 조회수 터진다. 카메라 켜.”",
        gameOver:
          "GAME OVER\n\n6반 존잘남 이수민은 당신 때문에 사망했습니다...\n사유: 재난 브이로그 데뷔 시도.\n조회수보다 생존수가 중요합니다.",
        tone: "danger"
      },
      {
        label: "손잡고 질주",
        text: "“로맨스는 속도야. 손잡고 뛰자!”",
        gameOver:
          "GAME OVER\n\n6반 존잘남 이수민은 당신 때문에 사망했습니다...\n사유: 로맨스 장르에서 액션 장르로 강제 전환.\n복도 질주는 설렘이 아니라 사고 플래그입니다.",
        tone: "romance"
      }
    ]
  },
  stairs: {
    bg: "stairs",
    mood: "aftershock",
    sprite: "worried",
    phase: "계단 여진",
    speaker: "교내 방송",
    text:
      "계단참에 도착한 순간, 바닥이 다시 짧게 흔들린다.\n" +
      "앞줄이 멈추고 난간이 덜컹거린다. 수민이 네 쪽으로 몸을 낮추며 묻는다.\n\n" +
      "“지금도 네 말 들을게. 어떻게 해?”",
    note: "여진도 지진이다. 흔들림을 느끼면 즉시 낮아지고 머리와 목을 보호한 뒤, 멈춘 다음 다시 이동한다.",
    choices: [
      {
        label: "여진 대처",
        text: "“멈춰! 내벽 쪽으로 낮추고 머리 보호. 흔들림 끝나면 천천히 내려가.”",
        next: "ending",
        effects: { safety: 5, calm: 3, affection: 3 },
        tone: "safe",
        feedback: "수민이 네 말대로 몸을 낮춘다. 흔들림이 지나간 뒤, 그는 네 손목을 조심스럽게 잡고 함께 내려간다."
      },
      {
        label: "계단 돌파",
        text: "“지금 뛰어 내려가면 더 빨라!”",
        gameOver:
          "GAME OVER\n\n6반 존잘남 이수민은 당신 때문에 사망했습니다...\n사유: 계단 돌파 작전 수행.\n하지만 지진 대피는 점프맵이 아닙니다.",
        tone: "danger"
      },
      {
        label: "난간 셀카",
        text: "“잠깐, 여기 조명 좋다. 마지막으로 한 장만.”",
        gameOver:
          "GAME OVER\n\n6반 존잘남 이수민은 당신 때문에 사망했습니다...\n사유: 인생샷 대신 인생 종료샷 시도.\n사진은 운동장 도착 후에 찍읍시다.",
        tone: "danger"
      }
    ]
  },
  ending: {
    bg: "playground",
    mood: "ending",
    sprite: "smile",
    phase: "운동장 엔딩",
    speaker: "이수민",
    text: () => makeEndingText(),
    note: "생존 루트 완료: 낮추기, 머리와 목 보호, 책상 붙잡기, 흔들림 후 질서 대피, 계단 여진 시 멈추기.",
    choices: [
      {
        label: "다시 설레기",
        text: "처음부터 다시 플레이한다.",
        restart: true,
        tone: "final"
      }
    ]
  },
  gameOver: {
    bg: "classroom",
    mood: "gameover",
    sprite: "worried",
    phase: "GAME OVER",
    speaker: "시스템",
    text: () => state.gameOverMessage || "GAME OVER",
    note: "농담처럼 보여도 안전 선택지는 진짜다. 다시 시작해서 수민을 살려 보자.",
    choices: [
      {
        label: "수민 살리기",
        text: "처음부터 다시 플레이한다.",
        restart: true,
        tone: "final"
      }
    ]
  }
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function applyEffects(effects = {}) {
  state.safety = clamp(state.safety + (effects.safety || 0), -10, 30);
  state.affection = clamp(state.affection + (effects.affection || 0), -10, 30);
  state.calm = clamp(state.calm + (effects.calm || 0), -10, 30);
}

function makeEndingText() {
  const endingLine =
    state.affection >= 12
      ? "“솔직히 아까 네가 ‘책상 아래!’라고 외친 순간... 심장이 지진보다 더 크게 흔들렸어.”"
      : "“네가 침착해서 나도 버텼어. 오늘 파트너가 너라서 진짜 다행이야.”";

  return (
    "운동장 대피 구역에 도착하자 담임이 인원을 확인한다.\n" +
    "건물에서 떨어진 넓은 곳에 서고 나서야, 수민이 참았던 숨을 길게 내쉰다.\n\n" +
    "그가 너를 보고 웃는다.\n" +
    `${endingLine}\n\n` +
    "뒤에서 누군가 속삭인다. “야... 저 둘 뭐냐?”\n" +
    "하지만 이번엔 네가 먼저 웃는다. 살아남았고, 조금 설렜고, 수민은 아직 네 옆에 있다."
  );
}

function resolve(value) {
  return typeof value === "function" ? value() : value;
}

function getSpriteForScene(scene) {
  return characterSprites[scene.sprite] || characterSprites.normal;
}

function saveGame() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch {
    // The game should still run when local storage is blocked.
  }
}

function resetGame() {
  state = { ...initialState };
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch {
    // Ignore storage failures; reset still applies in memory.
  }
  render();
}

function render() {
  const scene = scenes[state.scene] || scenes.rumor;

  backdrop.src = backgrounds[scene.bg];
  characterSprite.src = getSpriteForScene(scene);
  game.dataset.mood = scene.mood;

  speaker.textContent = scene.speaker;
  phase.textContent = scene.phase;
  storyText.textContent = resolve(scene.text);

  safetyValue.textContent = state.safety;
  affectionValue.textContent = state.affection;
  calmValue.textContent = state.calm;

  const note = resolve(scene.note);
  safetyNote.hidden = !note;
  safetyNote.textContent = note || "";

  feedback.hidden = !state.lastFeedback;
  feedback.textContent = state.lastFeedback;

  choices.replaceChildren();
  scene.choices.forEach((choice) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `choice-button ${choice.tone || ""}`;

    const label = document.createElement("strong");
    label.textContent = choice.label;
    button.append(label, document.createTextNode(choice.text));

    button.addEventListener("click", () => choose(choice));
    choices.append(button);
  });

  saveGame();
}

function choose(choice) {
  if (choice.restart) {
    resetGame();
    return;
  }

  if (choice.gameOver) {
    state.gameOverMessage = choice.gameOver;
    state.lastFeedback = "";
    state.scene = "gameOver";
    render();
    return;
  }

  applyEffects(choice.effects);
  state.lastFeedback = choice.feedback || "";
  state.scene = choice.next;
  render();
}

function restoreGame() {
  let saved = null;
  try {
    saved = localStorage.getItem(SAVE_KEY);
  } catch {
    saved = null;
  }

  if (!saved) {
    render();
    return;
  }

  try {
    const parsed = JSON.parse(saved);
    if (parsed && scenes[parsed.scene]) {
      state = { ...initialState, ...parsed };
    }
  } catch {
    try {
      localStorage.removeItem(SAVE_KEY);
    } catch {
      // Ignore storage failures; invalid saves are simply skipped.
    }
  }

  render();
}

restartButton.addEventListener("click", resetGame);
restoreGame();
