# CoMentor Frontend

CS 면접 준비를 위해 **본인 프로젝트에 적용된 CS 개념을 추출하고, 질문·답변·피드백을 반복하며 학습**할 수 있는 웹 서비스입니다. GitHub 커밋을 분석해 프로젝트 맥락 기반 질문을 생성하고, 기록·북마크·알림·통계를 통해 학습 루프를 완성합니다.

## Problem & Solution
- 문제: 기능 구현에 집중하다 보면 프로젝트에 녹아든 CS 개념을 체계적으로 정리하기 어렵고, 면접에서 사례 중심으로 설명하기가 힘듭니다.
- 해결: GitHub 커밋을 분석해 적용된 CS 개념을 추출 → 질문 3개 자동 생성 → 답변에 즉각 피드백 → 기록·북마크·리마인드 알림·인사이트 대시보드로 학습 정착을 돕습니다.

## Core Features
- GitHub 연동 프로젝트 관리: 대시보드에서 프로젝트 추가/수정, 진행 상태 필터링, 최신순 정렬.
- 프로젝트 코드 기반 CS 연습: 커밋 기간 지정 후 코드 선택 → CS 질문 3개 생성 → 답변과 피드백 자동 저장 및 재풀이.
- 스택 기반 데일리 CS 연습: 매일 10시 스택별 4문제 추천, 즉시 피드백, 날짜·카테고리별 필터/재풀이.
- 기록·북마크·폴더: 질문/답변/피드백 기록 보존, 폴더별 북마크 관리와 재학습 링크.
- 알림(PWA + Push): 질문 생성 알림, 미학습 리마인드, 공지 이메일 발송, 읽음 처리 및 이동 동작 제공.
- 학습 인사이트: Day Streak, 카테고리별 분포 Pie 차트, 오답률 100% 누적 막대그래프, 카테고리 이동 액션.
- 마이페이지: GitHub 계정 관리, 스택/이메일/알림 설정 변경.

## Tech Stack
- Frontend: Next.js 15 (App Router), React 18, TypeScript, Tailwind CSS 4, Shadcn UI, Framer Motion, Lottie, Recharts.
- State/Data: React Query v5, Zustand, React Hook Form, Zod.
- Testing/QA: Jest, MSW.
- PWA/Infra: next-pwa, FCM, 

## Getting Started
### Prerequisites
- Node.js 18+ (LTS 권장)
- npm (또는 yarn/pnpm/bun) — 아래 예시는 npm 기준

### Installation
```bash
# 1) Install deps
npm install

# 2) Run dev server
npm run dev

# 3) Production build & start
npm run build
npm start
```

## Key User Flows
- 회원가입/로그인: GitHub 연동, 이메일·스택·알림 여부 설정 후 대시보드 이동.
- 프로젝트 추가: 대시보드 + 버튼 → 레포 이름 기반 제목 자동, 설명/역할/진행 상태 입력, 최신순·필터 제공.
- 코드 선택 & CS 질문: 기간(startDate/endDate)으로 커밋 조회 → 코드 선택 → 질문 3개 생성 → 답변/피드백 기록, 재풀이/카테고리 필터/북마크.
- 데일리 CS 연습: 매일 10시 스택별 4문제 자동 생성 → 풀기/피드백 → 기록·북마크·재풀이.
- 알림: 질문 생성, 48시간 미학습 리마인드, 공지 이메일; 읽지 않은 알림 표시/모두 읽음/페이지 이동.
- 인사이트: Day Streak 배너, 최근 10일 그래프, 카테고리 분포 Pie, 오답률 누적 막대, 카테고리 연습 이동.
- 폴더 관리: 폴더 생성/이름 변경/삭제, 폴더 내 북마크 해제, 질문 상세 이동.

## Project Structure
```
src/
  api/             # API 클라이언트, 서비스, MSW 핸들러
  app/             # Next.js App Router (after/before, layout, page, error 등)
  components/      # UI/도메인 컴포넌트 (Dashboard, CS, Bookmark, Modal 등)
  hooks/           # 커스텀 훅 (useBookmarkHandler, useDelayedLoading 등)
  lib/             # 유틸, enum/경로/스켈레톤 생성기, firebase 설정
  providers/       # React Query 등 프로바이더
  store/           # Zustand 스토어 (auth, fcm, modal, notification)
  types/           # 타입 정의
  utils/           # 공용 유틸
public/            # PWA 서비스워커, 아이콘, 애니메이션, 폰트, 이미지
```

## Deployment & PWA
- next build 후 next start로 서버 실행.
- next-pwa와 서비스워커(FCM 포함)로 푸시 알림 및 오프라인 대응.
- GitHub Actions 기반 CI/CD, Docker/K8s/AWS 환경에 배포 가능.

## Roadmap Snapshot
- 스프린트 1~2: GitHub 연동 가입, 프로젝트 추가/수정, 코드 선택 질문 생성, CS 연습, 마이페이지, 폴더/북마크.
- 스프린트 3: PWA 푸시 알림 (질문 생성, 미학습 리마인드, 공지 메일).
- 스프린트 4: 학습 리포트/인사이트 (Day Streak, 카테고리 분포, 오답률 그래프, 카테고리 연습 이동).

