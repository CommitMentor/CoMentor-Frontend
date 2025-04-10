import { setupWorker } from 'msw/browser'
import { http, HttpResponse } from 'msw'
import { handlers } from '../handlers'

// MSW 워커 세팅
export const worker = setupWorker(...handlers)

// MSW 초기화 함수
export const setupMSW = async () => {
  // 개발 환경에서만 MSW 활성화
  if (process.env.NEXT_PUBLIC_MSW === 'enable') {
    // 모든 API 경로에 대한 기본 핸들러 추가
    worker.use(
      // 인증이 필요한 모든 API 요청을 인터셉트
      http.all('*', ({ request }) => {
        const authHeader = request.headers.get('Authorization')

        // 인증 헤더가 있으면 정상 처리 (실제 핸들러로 전달)
        if (authHeader) {
          return
        }

        // 인증 헤더가 없는 요청은 기존 핸들러에서 처리되도록 함
        return
      }),
    )

    // 서비스 워커 시작
    await worker.start({
      onUnhandledRequest: 'bypass',
    })

    console.log('MSW가 성공적으로 초기화되었습니다.')
  }
}
