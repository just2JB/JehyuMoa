# 제휴모아 · JehyuMoa

**한양대학교 ERICA 학생을 위한 학생회 제휴 정보 모아보기 서비스**

2026학년도 2학기 「모바일 앱 개발」 수업 팀 프로젝트입니다.
총학생회와 단과대학 학생회의 제휴 정보를 한곳에서 확인하고, 자신의 소속과 함께 방문하는 인원에 맞는 혜택을 찾아볼 수 있는 서비스를 기획하고 있습니다.

## 서비스 목표

흩어져 있는 학생회 제휴 정보를 모아, 내가 받을 수 있는 혜택과 이용 조건을 쉽게 확인하도록 돕습니다.

## 기획 배경

학생회 제휴 정보를 확인할 때는 다음과 같은 탐색 과정이 필요합니다.

- **인스타그램**에서 학교 또는 단과대학 학생회 계정을 찾고, 게시물을 스크롤한 뒤 여러 장의 안내 이미지를 넘겨 봅니다.
- **카카오톡 학과 공지방**에서 제휴 키워드를 검색하고 관련 공지를 확인합니다. 오래된 이미지의 경우 보관 상태에 따라 다시 열기 어려울 수 있습니다.
- 총학생회와 단과대학 학생회가 제공하는 제휴를 비교하려면 각 채널을 따로 확인해야 합니다.

제휴모아는 이 과정에서 분산되어 있는 매장, 혜택, 적용 대상, 이용 조건을 함께 보여주는 것을 목표로 합니다.

## 주요 기능

아래 항목은 기획 및 Figma 프로토타입 기준이며, 앱 구현 범위는 개발 과정에서 구체화합니다.

| 기능 | 내용 |
| --- | --- |
| 제휴 목록 | 여러 학생회의 제휴 매장과 혜택을 한곳에서 확인 |
| 카테고리 탐색 | 원하는 업종을 선택해 제휴 목록 탐색 |
| 검색 | 매장명이나 혜택 키워드로 필요한 정보 탐색 |
| 소속 설정 | 사용자의 단과대학을 선택해 적용 가능한 제휴 확인 |
| 동행 조건 설정 | 함께 방문하는 인원과 단과대학 구성을 설정 |
| 제휴 상세 | 매장별 혜택, 적용 대상, 이용 조건 확인 |
| 지도보기 | 실제 지도(OpenStreetMap)에서 제휴 가게 위치 확인, 카카오맵 길찾기 연결 |

## 기본 사용 흐름

1. 홈에서 제휴 매장과 혜택을 확인합니다.
2. 소속 단과대학을 선택합니다.
3. 필요하면 함께 방문하는 인원과 소속을 설정합니다.
4. 카테고리 또는 검색으로 원하는 제휴를 찾습니다.
5. 상세 화면에서 적용 대상과 이용 조건을 확인합니다.
6. 지도보기나 카카오맵 길찾기로 매장 위치를 확인합니다.

## 대상 사용자

- **주요 사용자** — 한양대학교 ERICA 학생 중 교내 학생회 제휴 혜택을 확인하고 이용하려는 학생
- **사용 상황** — 학교 주변 매장을 고르거나, 다른 단과대학 친구와 함께 방문하기 전에 받을 수 있는 혜택과 조건을 확인할 때

## 개발 방식

수업 예제와 동일하게 **React 18 + ReactDOM 18 + Babel Standalone**을 사용합니다.
HTML에서 CDN으로 라이브러리를 불러오고, `type="text/babel"`로 작성한 JSX를 브라우저에서 변환하여 실행합니다.

| 기술 | 용도 |
| --- | --- |
| HTML | React를 표시할 `root` 요소와 라이브러리 연결 |
| React 18 | 화면 컴포넌트와 상태 관리 |
| ReactDOM 18 | `ReactDOM.createRoot`를 통한 화면 렌더링 |
| Babel Standalone | 브라우저에서 JSX 변환 |
| CSS | 모바일 화면 레이아웃과 스타일 |
| Leaflet 1.9 | 지도보기 화면의 실제 지도 (OpenStreetMap 데이터, CARTO 타일 · API 키 불필요) |

### 기본 파일 구성

개발 시 아래 구성을 기준으로 파일을 추가합니다.

```text
JehyuMoa/
├── index.html    # React·ReactDOM·Babel 로딩 및 root 요소
├── app.js        # JSX 컴포넌트, 상태 관리, 화면 전환
├── style.css     # 화면 스타일
├── config.example.js  # 설정 템플릿 (복사해서 config.js로 · config.js는 깃 제외)
├── images/       # 이미지 리소스
├── docs/         # 설계 근거 문서 (애니메이션, 기능 검토, UI 제안 등)
└── README.md
```

`index.html`에서 라이브러리와 앱 코드를 다음과 같이 연결합니다.

```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div id="root"></div>
  <script type="text/babel" src="app.js"></script>
</body>
```

### 설정 파일 (환경변수)

빌드 없이 브라우저에서 실행하므로 `.env` 대신 `config.js`를 설정 파일로 씁니다.

```bash
cp config.example.js config.js   # 그다음 config.js에 값 입력
```

- `config.js`는 `.gitignore`에 있어 깃에 올라가지 않습니다. 템플릿은 `config.example.js`입니다.
- 브라우저에서 보이는 값이므로 **도메인 제한이 걸린 공개용 키만** 넣고, 비밀 키는 넣지 않습니다.
- 파일이 없어도 앱은 기본값(키가 필요 없는 OpenStreetMap 지도)으로 동작합니다.

화면은 React 컴포넌트로 나누고, 수업 예제처럼 `React.useState`와 props를 이용해 화면 전환과 사용자 선택을 관리합니다.
앱 파일 추가 후 VS Code의 Live Server 등 로컬 HTTP 서버에서 `index.html`을 실행합니다. CDN 라이브러리를 불러오려면 인터넷 연결이 필요합니다.

## 프로젝트 현황

- 서비스 기획 및 화면 흐름을 정리하고 Figma 프로토타입을 제작했습니다.
- 개발 방식은 React 18·ReactDOM 18·Babel Standalone의 CDN 로딩으로 정했습니다.
- Figma 11주차 완성본을 기준으로 목 데이터 프로토타입을 구현했습니다. (목록·정렬·거리 기준·조건 설정·즐겨찾기·매장 상세·마이 페이지)
- 목 데이터는 실제 제휴 정보가 아닌 화면 확인용 예시입니다.

## 관련 자료

- [서비스 기획서](https://docs.google.com/document/d/1_gLumrR-9czINZB1-0gLUAblNxnNLEYOU1g16LEgbr4/edit)
- [Figma 디자인](https://www.figma.com/design/Q8vCfsnFcPaF39fDQHCOnH?node-id=149-5527)
