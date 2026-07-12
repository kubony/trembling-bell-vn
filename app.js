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

const SAVE_KEY = "sumin-earthquake-vn-save";

const backgrounds = {
  classroom: "assets/generated/classroom-vn.png",
  hallway: "assets/generated/hallway-vn.png",
  stairs: "assets/generated/stairs-vn.png",
  playground: "assets/generated/playground-vn.png"
};

const characterSprites = {
  normal: "assets/generated/heroine-vn.png",
  worried: "assets/generated/heroine-worried-vn.png",
  smile: "assets/generated/heroine-smile-vn.png"
};

const initialState = {
  scene: "start",
  safety: 0,
  affection: 0,
  calm: 0,
  lastFeedback: ""
};

let state = { ...initialState };

const scenes = {
  start: {
    bg: "classroom",
    mood: "calm",
    phase: "종례 직전",
    speaker: "이수민",
    text:
      "금요일 마지막 교시, 지진 대피 훈련 안내 방송이 끝나자마자 교실이 웅성거린다.\n" +
      "학교에서 조용히 시선을 끄는 이수민이 네 책상 옆에 기대서 살짝 웃는다. “오늘 파트너, 나랑 할래? 장난 말고 제대로.”",
    note: "실제 지진은 예고 없이 온다. 훈련 전에는 책상 아래 공간, 창문 주변, 떨어질 물건을 확인해 두는 편이 좋다.",
    choices: [
      {
        label: "교실 점검",
        text: "수민과 책상 아래 공간과 창가 위험물을 확인한다.",
        next: "prepChecked",
        effects: { safety: 2, calm: 1, affection: 1 },
        tone: "safe",
        feedback: "책상 아래 가방을 치우고, 창가 화분과 느슨한 액자를 눈에 담아 둔다. 수민이 작게 고개를 끄덕인다."
      },
      {
        label: "가벼운 농담",
        text: "“수민이랑 파트너라니 대피보다 심장이 위험한데?”",
        next: "prepChat",
        effects: { affection: 2 },
        tone: "romance",
        feedback: "수민이 웃음을 참다가 네 팔꿈치를 톡 건드린다. 분위기는 좋아졌지만 교실 점검은 아직이다."
      },
      {
        label: "대충 넘기기",
        text: "빨리 끝내자며 가방만 챙긴다.",
        next: "prepLoose",
        effects: { calm: -1 },
        tone: "danger",
        feedback: "교실은 평소처럼 보여도 느슨한 물건이 많다. 수민이 네 표정을 살피며 “그래도 조심하자”라고 말한다."
      }
    ]
  },
  prepChecked: {
    bg: "classroom",
    mood: "calm",
    phase: "훈련 시작",
    speaker: "방송",
    text:
      "스피커에서 훈련 시작음이 울린다. 그런데 바닥이 아주 낮게 꿀렁이고, 형광등 줄이 실제로 흔들린다.\n" +
      "수민의 얼굴에서 장난기가 사라진다. “이거... 훈련 소리 맞아?”",
    note: "흔들림이 시작되면 먼저 낮아지고, 머리와 목을 보호하고, 튼튼한 책상이나 탁자를 붙잡는다.",
    choices: [
      {
        label: "낮추기",
        text: "바로 책상 아래로 들어가 머리와 목을 보호한다.",
        next: "underDesk",
        effects: { safety: 3, calm: 2, affection: 1 },
        tone: "safe",
        feedback: "너는 수민에게도 낮게 들어오라고 손짓한다. 책상 다리를 잡자 흔들림을 버틸 중심이 생긴다."
      },
      {
        label: "복도 질주",
        text: "출입문 쪽으로 먼저 뛰어 나간다.",
        next: "underDeskLate",
        effects: { safety: -3, calm: -1 },
        tone: "danger",
        feedback: "발밑이 크게 밀리며 몸이 휘청인다. 문 근처 유리가 흔들리고, 수민이 네 이름을 급히 부른다."
      },
      {
        label: "창가 확인",
        text: "창문 쪽으로 가서 밖 상황을 본다.",
        next: "underDeskLate",
        effects: { safety: -3, calm: -1 },
        tone: "danger",
        feedback: "창틀이 덜컹거리고 작은 유리 조각이 튄다. 수민이 네 손목을 잡아 낮은 자세로 끌어당긴다."
      }
    ]
  },
  prepChat: {
    bg: "classroom",
    mood: "calm",
    phase: "흔들림",
    speaker: "이수민",
    text:
      "수민이 웃으며 대답하려는 순간, 의자가 바닥을 긁는 소리가 교실 전체에 번진다.\n" +
      "이번에는 스피커 효과가 아니다. 책장 위 물건들이 한꺼번에 흔들린다.",
    note: "지진 중에는 밖으로 달려 나가기보다 현재 위치에서 즉시 몸을 보호하는 것이 우선이다.",
    choices: [
      {
        label: "낮추기",
        text: "수민과 함께 가장 가까운 책상 아래로 들어간다.",
        next: "underDesk",
        effects: { safety: 3, calm: 2, affection: 1 },
        tone: "safe",
        feedback: "수민이 네 어깨를 감싸 낮은 자세를 잡는다. 두 사람 모두 책상 다리를 단단히 붙잡는다."
      },
      {
        label: "문으로 이동",
        text: "문틀이 안전할 것 같아 출입문으로 간다.",
        next: "underDeskLate",
        effects: { safety: -2, calm: -1 },
        tone: "danger",
        feedback: "문 주변도 강하게 흔들리고 친구들이 몰린다. 수민이 “책상 아래!”라고 짧게 외친다."
      },
      {
        label: "가방 찾기",
        text: "두고 온 가방부터 가지러 간다.",
        next: "underDeskLate",
        effects: { safety: -2, affection: -1 },
        tone: "danger",
        feedback: "움직일수록 균형이 무너진다. 수민이 네 앞을 막고 몸을 낮추라고 말한다."
      }
    ]
  },
  prepLoose: {
    bg: "classroom",
    mood: "calm",
    phase: "첫 진동",
    speaker: "나",
    text:
      "“빨리 끝나겠지.” 그렇게 말한 직후 바닥이 옆으로 밀린다.\n" +
      "교실 뒤 책장 위 상자가 떨어질 듯 흔들리고, 수민이 네 쪽으로 몸을 돌린다.",
    note: "흔들릴 때 서 있으면 넘어지기 쉽다. 이동보다 자세를 낮추고 가까운 보호물을 쓰는 판단이 중요하다.",
    choices: [
      {
        label: "책상 아래",
        text: "바로 몸을 낮추고 책상 아래로 들어간다.",
        next: "underDesk",
        effects: { safety: 3, calm: 1 },
        tone: "safe",
        feedback: "늦었지만 정확했다. 수민이 네 옆으로 들어오며 책상 다리를 잡는다."
      },
      {
        label: "서서 버티기",
        text: "잠깐이면 끝날 것 같아 서서 버틴다.",
        next: "underDeskLate",
        effects: { safety: -3, calm: -1 },
        tone: "danger",
        feedback: "몸이 책상 모서리에 부딪힌다. 수민이 낮은 자세로 네 팔을 잡아당긴다."
      },
      {
        label: "창가 피하기",
        text: "창문에서 떨어져 낮은 자세로 책상 아래를 찾는다.",
        next: "underDesk",
        effects: { safety: 2, calm: 1, affection: 1 },
        tone: "safe",
        feedback: "창가를 피한 판단이 좋았다. 수민이 안도의 숨을 쉬며 너와 같은 책상 아래로 들어온다."
      }
    ]
  },
  underDesk: {
    bg: "classroom",
    mood: "quake",
    phase: "강한 흔들림",
    speaker: "이수민",
    text:
      "책상 아래가 좁다. 수민의 어깨가 네 어깨에 닿고, 위에서는 분필통이 바닥으로 떨어지는 소리가 난다.\n" +
      "수민이 휴대폰 알림을 보려 고개를 들려 한다. “진원 정보만 확인할게.”",
    note: "흔들림이 계속되는 동안에는 머리와 목을 보호하고, 책상이나 보호물을 잡은 채 기다린다.",
    choices: [
      {
        label: "붙잡기",
        text: "수민의 팔을 잡아 낮게 머물게 한다.",
        next: "shakingStops",
        effects: { safety: 2, calm: 1, affection: 2 },
        tone: "safe",
        feedback: "수민이 잠깐 놀라더니 네 말대로 고개를 낮춘다. “고마워. 지금은 네 말이 맞아.”"
      },
      {
        label: "가방 보호",
        text: "가방을 머리 위에 대고 둘 다 더 안쪽으로 붙는다.",
        next: "shakingStops",
        effects: { safety: 2, calm: 1, affection: 1 },
        tone: "safe",
        feedback: "가방이 작은 파편을 막아 준다. 수민은 네 손등 위로 자기 손을 겹쳐 책상 다리를 잡는다."
      },
      {
        label: "먼저 확인",
        text: "괜찮아 보이니 먼저 일어나 상황을 본다.",
        next: "shakingStops",
        effects: { safety: -2, calm: -1 },
        tone: "danger",
        feedback: "책상이 다시 크게 흔들려 무릎을 찧을 뻔한다. 수민이 다급히 너를 다시 끌어앉힌다."
      }
    ]
  },
  underDeskLate: {
    bg: "classroom",
    mood: "quake",
    phase: "강한 흔들림",
    speaker: "이수민",
    text:
      "수민이 너를 가까운 책상 아래로 밀어 넣는다. 교실은 짧은 비명과 책상 끌리는 소리로 가득하다.\n" +
      "늦게 몸을 낮춘 탓에 심장이 더 빠르게 뛴다.",
    note: "늦었다고 생각해도 즉시 몸을 낮추는 편이 낫다. 흔들림이 멈추기 전 무리한 이동은 위험하다.",
    choices: [
      {
        label: "호흡 맞추기",
        text: "수민과 함께 책상 다리를 잡고 천천히 숨을 맞춘다.",
        next: "shakingStops",
        effects: { safety: 2, calm: 2, affection: 1 },
        tone: "safe",
        feedback: "떨리는 손이 조금씩 안정된다. 수민이 “괜찮아, 여기서 버티자”라고 낮게 말한다."
      },
      {
        label: "다시 이동",
        text: "더 넓은 곳을 찾아 교실 뒤쪽으로 기어간다.",
        next: "shakingStops",
        effects: { safety: -2, calm: -1 },
        tone: "danger",
        feedback: "떨어진 물건 때문에 길이 막힌다. 이동할수록 위험이 커진다는 걸 몸으로 느낀다."
      },
      {
        label: "수민 챙기기",
        text: "수민의 머리 위쪽도 가방으로 함께 가린다.",
        next: "shakingStops",
        effects: { safety: 1, affection: 2 },
        tone: "romance",
        feedback: "수민이 짧게 웃는다. “이 와중에 나까지 챙기는 거야?” 그의 목소리도 조금 안정된다."
      }
    ]
  },
  shakingStops: {
    bg: "classroom",
    mood: "calm",
    phase: "대피 판단",
    speaker: "담임",
    text:
      "큰 흔들림이 잦아들자 잠깐의 정적이 내려앉는다. 담임 선생님이 출입문 쪽을 확인하며 말한다.\n" +
      "“아직 여진 가능성이 있어. 다친 사람 확인하고, 지시에 따라 운동장으로 이동한다.”",
    note: "흔들림이 멈춘 뒤에는 부상과 주변 위험을 확인하고, 학교나 담당자의 지시에 따라 안전한 장소로 이동한다.",
    choices: [
      {
        label: "확인 후 이동",
        text: "주변 파편과 친구들 상태를 확인하고 대피 행렬을 따른다.",
        next: "hallway",
        effects: { safety: 3, calm: 1, affection: 1 },
        tone: "safe",
        feedback: "넘어진 의자를 밀어 길을 만들고, 다친 친구를 선생님께 알린다. 수민이 네 옆에서 보폭을 맞춘다."
      },
      {
        label: "손잡고 질주",
        text: "수민 손을 잡고 복도로 먼저 뛰어나간다.",
        next: "hallway",
        effects: { safety: -2, affection: 1, calm: -1 },
        tone: "romance",
        feedback: "손은 잡았지만 복도 입구에서 다른 반 학생들과 부딪힐 뻔한다. 수민도 곧 속도를 늦춘다."
      },
      {
        label: "엘리베이터",
        text: "계단보다 빠를 것 같아 엘리베이터를 찾는다.",
        next: "hallway",
        effects: { safety: -4, calm: -1 },
        tone: "danger",
        feedback: "선생님이 즉시 제지한다. 정전과 고장 위험 때문에 엘리베이터는 선택지가 아니다."
      }
    ]
  },
  hallway: {
    bg: "hallway",
    mood: "calm",
    phase: "복도 대피",
    speaker: "이수민",
    text:
      "복도 비상등이 켜져 있고 창가 쪽에는 작은 유리 파편이 보인다. 학생들은 선생님 지시에 맞춰 줄을 만든다.\n" +
      "수민이 네 가방 끈을 살짝 정리해 준다. “넘어지지 않게 천천히 가자.”",
    note: "대피 중에는 뛰지 않고, 창문과 떨어진 쪽으로 이동하며, 머리를 보호하고 줄을 유지한다.",
    choices: [
      {
        label: "머리 보호",
        text: "가방으로 머리를 보호하고 창문 반대편으로 천천히 이동한다.",
        next: "stairs",
        effects: { safety: 3, calm: 1, affection: 1 },
        tone: "safe",
        feedback: "행렬이 안정된다. 수민은 네 옆에서 다른 학생에게도 창가를 피하라고 알려 준다."
      },
      {
        label: "거슬러 가기",
        text: "친구가 걱정돼 행렬을 거슬러 교실 쪽으로 돌아간다.",
        next: "stairs",
        effects: { safety: -2, calm: -1 },
        tone: "danger",
        feedback: "복도 흐름이 꼬이고 선생님이 멈춰 세운다. 친구 확인은 담당자에게 알리는 쪽이 더 안전하다."
      },
      {
        label: "영상 촬영",
        text: "상황을 찍어 단체 채팅방에 올린다.",
        next: "stairs",
        effects: { safety: -3, affection: -1, calm: -1 },
        tone: "danger",
        feedback: "손이 비어 있지 않아 균형 잡기가 어렵다. 수민이 휴대폰을 내려 달라고 단호하게 말한다."
      }
    ]
  },
  stairs: {
    bg: "stairs",
    mood: "aftershock",
    phase: "여진",
    speaker: "나",
    text:
      "계단참에 도착한 순간, 다시 짧고 날카로운 흔들림이 온다. 앞줄이 멈추고 난간이 떨린다.\n" +
      "수민이 네 쪽으로 한 발 다가오며 낮은 목소리로 묻는다. “지금 어떻게 해야 하지?”",
    note: "여진도 지진이다. 흔들림을 느끼면 즉시 낮아지고 머리와 목을 보호한 뒤, 멈춘 다음 다시 이동한다.",
    choices: [
      {
        label: "즉시 낮추기",
        text: "계단에서 뛰지 않고 내벽 쪽으로 낮아져 머리와 목을 보호한다.",
        next: "playground",
        effects: { safety: 3, calm: 1, affection: 1 },
        tone: "safe",
        feedback: "줄 전체가 잠시 멈추고, 흔들림이 가신 뒤 다시 천천히 움직인다. 수민이 안심한 듯 숨을 내쉰다."
      },
      {
        label: "계단 질주",
        text: "멈추면 더 위험할 것 같아 빠르게 뛰어 내려간다.",
        next: "playground",
        effects: { safety: -3, calm: -1 },
        tone: "danger",
        feedback: "앞사람과 간격이 급격히 좁아진다. 넘어질 뻔한 순간 수민이 난간 쪽으로 너를 붙잡는다."
      },
      {
        label: "혼자 먼저",
        text: "수민을 뒤로 두고 먼저 운동장으로 간다.",
        next: "playground",
        effects: { safety: -2, affection: -2 },
        tone: "danger",
        feedback: "운동장까지는 빨랐지만 뒤돌아본 수민의 표정이 굳어 있다. 함께 움직인다는 약속이 흔들렸다."
      }
    ]
  },
  playground: {
    bg: "playground",
    mood: "calm",
    phase: "운동장",
    speaker: "담임",
    text:
      "운동장은 이미 반별 대기 구역으로 나뉘어 있다. 건물 외벽과 전선에서 떨어진 곳에 학생들이 모인다.\n" +
      "수민이 네 손을 놓지 않은 걸 뒤늦게 깨닫고, 둘 다 동시에 시선을 피한다.",
    note: "야외 대피 장소에서는 건물, 담장, 전선에서 떨어지고 인원 확인과 부상 신고를 우선한다.",
    choices: [
      {
        label: "인원 확인",
        text: "담임에게 도착을 알리고, 다친 친구와 빠진 인원을 함께 확인한다.",
        next: "ending",
        effects: { safety: 3, calm: 1, affection: 1 },
        tone: "safe",
        feedback: "반 전체 상황이 빠르게 정리된다. 수민이 네 옆에 서서 빠진 친구 이름을 함께 확인한다."
      },
      {
        label: "응급가방",
        text: "수민이 괜찮은지 묻고 응급가방 위치를 함께 확인한다.",
        next: "ending",
        effects: { safety: 2, affection: 2, calm: 1 },
        tone: "romance",
        feedback: "수민이 살짝 웃는다. “네가 침착해서 나도 버틴 것 같아.” 응급가방 위치도 바로 확인한다."
      },
      {
        label: "건물 그늘",
        text: "햇빛을 피하려고 건물 가까운 그늘로 간다.",
        next: "ending",
        effects: { safety: -3, calm: -1 },
        tone: "danger",
        feedback: "선생님이 즉시 더 넓은 곳으로 이동시킨다. 대피 장소에서는 건물 주변 낙하물 위험을 피해야 한다."
      }
    ]
  },
  ending: {
    bg: "playground",
    mood: "ending",
    phase: "엔딩",
    speaker: "이수민",
    text: () => makeEnding().text,
    note: () => makeEnding().note,
    choices: [
      {
        label: "다시 훈련",
        text: "처음부터 다시 선택한다.",
        next: "start",
        restart: true,
        tone: "final",
        feedback: ""
      }
    ]
  }
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function applyEffects(effects = {}) {
  state.safety = clamp(state.safety + (effects.safety || 0), -10, 20);
  state.affection = clamp(state.affection + (effects.affection || 0), -10, 20);
  state.calm = clamp(state.calm + (effects.calm || 0), -10, 20);
}

function makeEnding() {
  const { safety, affection, calm } = state;

  if (safety >= 15 && calm >= 6 && affection >= 6) {
    return {
      text:
        "S 엔딩: 흔들림 속의 약속\n" +
        "반 전체가 무사히 인원 확인을 마친다. 수민은 사람들 시선이 잠깐 다른 곳으로 향한 틈에 네게만 들릴 만큼 작게 말한다.\n" +
        "“다음 훈련도, 진짜 위급한 날도... 네 옆이면 침착할 수 있을 것 같아.”",
      note: "핵심 행동: 낮추기, 머리와 목 보호, 책상 붙잡기, 멈춘 뒤 지시에 따라 대피, 야외에서는 건물과 전선에서 떨어지기."
    };
  }

  if (safety >= 11) {
    return {
      text:
        "A 엔딩: 무사 대피 루트\n" +
        "몇 번 아찔한 순간이 있었지만 너와 수민은 운동장 대기 구역까지 안전하게 도착했다. 수민은 흐트러진 앞머리를 넘기며 웃는다.\n" +
        "“너랑 같이해서 다행이야. 오늘 선택들, 진짜로 도움이 됐어.”",
      note: "좋은 판단이 많았다. 다음에는 대피 전 주변 위험 확인과 이동 중 줄 유지까지 더 안정적으로 이어 가면 된다."
    };
  }

  if (safety >= 5) {
    return {
      text:
        "B 엔딩: 아찔한 생존 루트\n" +
        "운동장에는 도착했지만 뛰거나 망설인 순간들이 머릿속에 남는다. 수민은 네 옆에 앉아 물병을 건넨다.\n" +
        "“괜찮아. 이번에 알았으니까 다음엔 더 잘할 수 있어.”",
      note: "보완점: 흔들림 중 이동하지 않기, 창문과 출입구 주변에 몰리지 않기, 엘리베이터 피하기."
    };
  }

  return {
    text:
      "C 엔딩: 재훈련 필요\n" +
      "대피는 끝났지만 위험한 선택이 너무 많았다. 수민은 진지한 얼굴로 네 손에 남은 먼지를 털어 준다.\n" +
      "“무서웠지. 그래도 다음엔 제일 먼저 몸을 낮추자. 나도 같이 기억할게.”",
    note: "가장 먼저 익힐 것: 흔들리면 낮추고, 머리와 목을 가리고, 튼튼한 책상이나 보호물을 붙잡고 기다린다."
  };
}

function resolve(value) {
  return typeof value === "function" ? value() : value;
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
  const scene = scenes[state.scene];
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

function getSpriteForScene(scene) {
  if (scene.mood === "ending") return characterSprites.smile;
  if (scene.mood === "quake" || scene.mood === "aftershock") {
    return characterSprites.worried;
  }
  return characterSprites.normal;
}

function choose(choice) {
  if (choice.restart) {
    resetGame();
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
