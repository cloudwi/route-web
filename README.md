# Route - 코스 생성 서비스

네이버 지도 API를 활용한 장소 검색 및 코스 생성 서비스입니다.

## 환경 설정

### 1. 패키지 설치

```bash
npm install
```

### 2. API 키 발급

1. [네이버 클라우드 플랫폼](https://www.ncloud.com/product/applicationService/maps)에서 Maps API 신청
2. Client ID와 Client Secret 발급

### 3. 환경 변수 설정

```bash
# 프로젝트 루트에 환경 파일 생성
cp .env.example .env.local        # 로컬 개발용
```

`.env.local` 파일에 발급받은 API 키를 입력하세요:

```env
NEXT_PUBLIC_NAVER_MAP_CLIENT_ID=your_client_id
NAVER_CLIENT_SECRET=your_client_secret
```

운영 환경에서는 `.env.production` 파일을 사용합니다.

## 실행 방법

```bash
# 개발 서버 실행 (.env.local 사용)
npm run dev

# 빌드 (.env.production 사용)
npm run build

# 운영 서버 실행
npm run start
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 주요 기능

- 네이버 지도 기반 장소 검색
- 검색한 장소를 코스로 추가
- 장소 순서 변경 (드래그 앤 드롭)
- 코스 저장 및 관리 (LocalStorage)
- 지도에서 코스 경로 시각화

## 기술 스택

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Naver Maps API

## 프로젝트 구조

```
route-web/
├── .env.local              # 로컬 환경 변수 (gitignore)
├── .env.production         # 운영 환경 변수 (gitignore)
├── .env.example            # 환경 변수 예시
├── src/
│   ├── app/
│   │   ├── api/search/     # 네이버 검색 API 라우트
│   │   ├── course/create/  # 코스 생성 페이지
│   │   └── page.tsx        # 홈 (코스 목록)
│   ├── components/
│   │   ├── CourseBuilder.tsx  # 코스 생성 메인 컴포넌트
│   │   ├── NaverMap.tsx       # 지도 컴포넌트
│   │   └── PlaceSearch.tsx    # 장소 검색 컴포넌트
│   ├── hooks/
│   │   └── useNaverMap.ts     # 네이버 지도 로더
│   └── types/
│       └── index.ts           # TypeScript 타입 정의
└── package.json
```
