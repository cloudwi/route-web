# 인증 시스템 테스트 가이드

## 구현된 기능

### 1. JWT 토큰 기반 인증
- localStorage에 토큰 저장
- AuthContext를 통한 전역 인증 상태 관리
- 자동 로그인 (페이지 리로드 시 토큰 유지)

### 2. 주요 파일

```
src/
├── contexts/
│   └── AuthContext.tsx          # 전역 인증 상태 관리
├── app/
│   ├── layout.tsx               # AuthProvider 적용
│   └── auth/
│       └── callback/
│           └── page.tsx         # OAuth 콜백 처리
├── components/
│   └── features/
│       └── auth/
│           └── LoginModal.tsx   # 로그인 모달
└── lib/
    └── api.ts                   # 토큰 관리 함수
```

### 3. 인증 흐름

1. **로그인 시작**
   - 사용자가 "로그인" 버튼 클릭
   - LoginModal에서 카카오 로그인 URL로 리다이렉트
   - 콜백 URL: `http://localhost:3001/auth/callback`

2. **OAuth 콜백 처리**
   - 백엔드에서 `/auth/callback?token=xxx` 또는 `/auth/callback?code=xxx` 형태로 리다이렉트
   - CallbackPage에서 토큰 처리
   - AuthContext를 통해 로그인 상태 업데이트
   - 메인 페이지로 자동 리다이렉트

3. **로그인 상태 유지**
   - localStorage에 토큰 저장
   - 페이지 새로고침 시 자동으로 토큰 확인
   - 유효한 토큰이 있으면 자동 로그인

4. **로그아웃**
   - 헤더의 로그아웃 버튼 클릭
   - localStorage에서 토큰 삭제
   - AuthContext 상태 초기화

## 테스트 방법

### 방법 1: 브라우저 콘솔에서 테스트

```javascript
// 1. 임시 JWT 토큰 생성 (테스트용)
const testToken = btoa(JSON.stringify({
  sub: "user123",
  name: "테스트 사용자",
  email: "test@example.com",
  exp: Math.floor(Date.now() / 1000) + 3600 // 1시간 후 만료
}));

// 2. 콜백 URL로 직접 이동
window.location.href = `/auth/callback?token=${testToken}`;

// 3. 또는 localStorage에 직접 저장 후 새로고침
localStorage.setItem('authToken', testToken);
window.location.reload();
```

### 방법 2: URL 파라미터로 테스트

브라우저에서 직접 접속:
```
http://localhost:3001/auth/callback?token=YOUR_TEST_TOKEN
```

### 방법 3: 백엔드 연동 테스트

백엔드 서버가 다음 형태로 리다이렉트하도록 설정:
```
GET /auth/kakao
→ 카카오 OAuth 처리
→ Redirect to: http://localhost:3001/auth/callback?token=JWT_TOKEN
```

## AuthContext Hook 사용법

```typescript
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>Please login</div>;
  }

  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## API 응답 예시

### 1. 토큰이 URL 파라미터로 전달되는 경우
```
/auth/callback?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. 인증 코드가 전달되는 경우 (OAuth 2.0)
```
/auth/callback?code=abc123def456

→ 프론트엔드에서 /api/auth/token으로 POST 요청
→ 백엔드가 token 응답
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user123",
    "name": "홍길동",
    "email": "hong@example.com"
  }
}
```

## 로컬스토리지 키

- `authToken`: JWT 토큰이 저장되는 키

## 토큰 형식

JWT 토큰은 다음과 같은 페이로드를 포함해야 합니다:

```json
{
  "sub": "user123",          // 사용자 ID (필수)
  "name": "홍길동",           // 사용자 이름
  "email": "hong@example.com", // 이메일
  "picture": "https://...",   // 프로필 이미지 URL
  "exp": 1234567890          // 만료 시간 (Unix timestamp)
}
```

## 보안 고려사항

1. **현재 구현 (개발용)**
   - localStorage에 토큰 저장
   - 클라이언트에서 JWT 디코딩

2. **프로덕션 권장사항**
   - HttpOnly 쿠키 사용
   - 백엔드에서 토큰 검증
   - Refresh Token 구현
   - HTTPS 필수

## 다음 단계

1. 백엔드 API 연동
   - `/api/auth/me` - 현재 사용자 정보 조회
   - `/api/auth/refresh` - 토큰 갱신
   - `/api/auth/logout` - 로그아웃 처리

2. 추가 기능
   - 토큰 자동 갱신
   - 만료된 토큰 처리
   - 에러 핸들링 개선
