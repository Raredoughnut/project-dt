import type { MbtiAxisKey } from "@/src/domain/mbti";

/* ========================================================================
   샘플 콘텐츠: "나의 연애 MBTI" (axis 채점)
   개발/데모용 픽스처. seed(DB)와 mock(뷰) 양쪽이 재사용한다.
   - 8문항(축당 2문항), 각 2지선다(±1)
   - 결과 코드 = MBTI 4글자 (16종)
   ======================================================================== */

export interface SampleChoice {
  label: string;
  axis: MbtiAxisKey;
  score: number; // + = 앞글자(E/S/T/J), - = 뒷글자(I/N/F/P)
}

export interface SampleQuestion {
  text: string;
  choices: SampleChoice[];
}

export interface SampleResult {
  code: string; // MBTI 4글자
  title: string;
  subtitle: string;
  description: string;
  traits: string[];
}

const QUESTIONS: SampleQuestion[] = [
  {
    text: "주말에 에너지를 채우는 방법은?",
    choices: [
      { label: "친구들 만나서 신나게 수다", axis: "energy", score: 1 },
      { label: "혼자 집에서 조용히 충전", axis: "energy", score: -1 },
    ],
  },
  {
    text: "처음 간 모임에서 나는?",
    choices: [
      { label: "먼저 다가가 말을 건다", axis: "energy", score: 1 },
      { label: "누가 말 걸어주길 기다린다", axis: "energy", score: -1 },
    ],
  },
  {
    text: "여행 계획을 세울 때?",
    choices: [
      { label: "일정·맛집을 구체적으로 정리", axis: "information", score: 1 },
      { label: "느낌 가는 대로, 상상부터", axis: "information", score: -1 },
    ],
  },
  {
    text: "대화에서 더 끌리는 주제는?",
    choices: [
      { label: "실제 경험과 사실", axis: "information", score: 1 },
      { label: "아이디어와 가능성", axis: "information", score: -1 },
    ],
  },
  {
    text: "연인이 고민을 털어놓으면?",
    choices: [
      { label: "해결책을 차분히 제시", axis: "decisions", score: 1 },
      { label: "먼저 공감하고 위로", axis: "decisions", score: -1 },
    ],
  },
  {
    text: "중요한 결정을 내릴 때 기준은?",
    choices: [
      { label: "객관적 사실과 원칙", axis: "decisions", score: 1 },
      { label: "사람들의 감정과 관계", axis: "decisions", score: -1 },
    ],
  },
  {
    text: "데이트 약속이 잡히면?",
    choices: [
      { label: "미리 계획하고 준비한다", axis: "lifestyle", score: 1 },
      { label: "그때그때 유연하게 즐긴다", axis: "lifestyle", score: -1 },
    ],
  },
  {
    text: "내 방/책상 상태는?",
    choices: [
      { label: "정리정돈이 되어 있다", axis: "lifestyle", score: 1 },
      { label: "필요한 게 여기저기 널려 있다", axis: "lifestyle", score: -1 },
    ],
  },
];

const RESULTS: SampleResult[] = [
  {
    code: "ISTJ",
    title: "정석 글레이즈드 도넛",
    subtitle: "믿음직한 원칙주의 연애",
    description: "약속은 반드시 지키는 사람. 변함없는 신뢰로 관계를 든든하게 지킵니다.",
    traits: ["성실", "책임감", "신중"],
  },
  {
    code: "ISFJ",
    title: "따뜻한 커스터드 도넛",
    subtitle: "말없이 챙겨주는 헌신형",
    description: "티 내지 않고 곁을 지키는 다정함. 상대의 필요를 먼저 알아챕니다.",
    traits: ["배려", "헌신", "온화"],
  },
  {
    code: "INFJ",
    title: "은은한 말차 도넛",
    subtitle: "깊고 진지한 영혼의 연애",
    description: "한 사람에게 진심을 다하는 이상주의자. 마음의 결까지 읽어냅니다.",
    traits: ["통찰", "진심", "이상"],
  },
  {
    code: "INTJ",
    title: "다크초코 프레첼 도넛",
    subtitle: "전략적인 마스터플랜 연애",
    description: "멀리 보고 관계를 설계하는 사람. 조용하지만 확신이 분명합니다.",
    traits: ["독립", "계획", "통찰"],
  },
  {
    code: "ISTP",
    title: "심플 올드패션 도넛",
    subtitle: "쿨한 자유주의 연애",
    description: "말보다 행동으로 보여주는 담백함. 군더더기 없는 매력의 소유자.",
    traits: ["담백", "실용", "자유"],
  },
  {
    code: "ISFP",
    title: "부드러운 생크림 도넛",
    subtitle: "지금 이 순간의 감성파",
    description: "다정하고 온유한 예술가 기질. 함께하는 순간의 분위기를 소중히 합니다.",
    traits: ["감성", "온유", "자유"],
  },
  {
    code: "INFP",
    title: "몽글 딸기잼 도넛",
    subtitle: "이상을 꿈꾸는 로맨티스트",
    description: "마음속 세계가 넓은 사람. 진심 어린 공감으로 상대를 감싸 안습니다.",
    traits: ["이상", "진심", "공감"],
  },
  {
    code: "INTP",
    title: "호기심 카카오닙스 도넛",
    subtitle: "함께 탐구하는 사색가",
    description: "궁금한 걸 같이 파고드는 게 즐거운 사람. 담백하고 논리적인 매력.",
    traits: ["호기심", "논리", "독립"],
  },
  {
    code: "ESTP",
    title: "화끈 스프링클 도넛",
    subtitle: "즉흥 액티비티 연애",
    description: "일단 지르고 보는 대담함. 함께라면 심심할 틈이 없습니다.",
    traits: ["활동적", "대담", "현실"],
  },
  {
    code: "ESFP",
    title: "반짝 레인보우 도넛",
    subtitle: "언제나 축제인 분위기 메이커",
    description: "함께 있으면 늘 신나는 사람. 밝은 에너지로 주변을 물들입니다.",
    traits: ["활발", "사교", "긍정"],
  },
  {
    code: "ENFP",
    title: "톡톡 팝핑 도넛",
    subtitle: "설렘을 몰고 다니는 자유연애",
    description: "열정 가득한 분위기 메이커. 새로운 설렘으로 관계를 반짝이게 합니다.",
    traits: ["열정", "자유", "공감"],
  },
  {
    code: "ENTP",
    title: "새콤 시트러스 도넛",
    subtitle: "티키타카가 즐거운 아이디어뱅크",
    description: "재치 넘치는 대화의 달인. 함께 티격태격하며 케미가 살아납니다.",
    traits: ["기지", "도전", "호기심"],
  },
  {
    code: "ESTJ",
    title: "든든 프로스티드 도넛",
    subtitle: "확실하게 이끄는 리더형",
    description: "책임감 있게 관계를 주도하는 사람. 믿고 기댈 수 있는 든든함.",
    traits: ["주도", "책임", "현실"],
  },
  {
    code: "ESFJ",
    title: "포근 허니딥 도넛",
    subtitle: "모두를 챙기는 관계지향형",
    description: "다정하게 곁을 살피는 분위기 메이커. 함께의 온기를 가장 소중히 합니다.",
    traits: ["다정", "사교", "헌신"],
  },
  {
    code: "ENFJ",
    title: "빛나는 카라멜 도넛",
    subtitle: "함께 성장하는 멘토형",
    description: "상대를 이끌어주는 따뜻한 리더. 서로를 더 나은 사람으로 만듭니다.",
    traits: ["리더", "공감", "헌신"],
  },
  {
    code: "ENTJ",
    title: "강렬 에스프레소 도넛",
    subtitle: "카리스마 목표지향 연애",
    description: "함께 정상을 향해 달리는 추진력. 분명한 방향으로 관계를 이끕니다.",
    traits: ["추진", "결단", "리더"],
  },
];

export const LOVE_MBTI = {
  slug: "love-mbti",
  title: "나의 연애 MBTI",
  description: "8가지 질문으로 알아보는 나의 연애 유형. 30초면 충분해요!",
  category: "연애",
  questions: QUESTIONS,
  results: RESULTS,
};
