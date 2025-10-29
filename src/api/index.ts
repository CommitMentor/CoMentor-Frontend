/**
 * API 인덱스 파일
 * API 클라이언트 서비스와 관련 타입을 내보냅니다.
 */

// =============== 사용자 (User) ===============
// 타입
export type { User, UserResponse } from '@/api/services/user/model'
export {
  useUserInfo,
  useUserJoin,
  useUserEdit,
  useUserActivity,
  useRefreshAccessToken,
} from '@/api/services/user/queries'

// =============== 사용자 학습 기록 (User Learning) ===============
// 타입
export type {
  LearningHistoryItem,
  LearningHistoryResponse,
  StreakCountResponse,
} from '@/api/services/userStudyLog/model'

// API 함수
export {
  useLearningHistory,
  useStreakCount,
} from '@/api/services/userStudyLog/service'

// =============== 프로젝트 (Project) ===============

// 타입
export type { Project, Commit, FileItem } from '@/api/services/project/model'

// API 함수
export {
  useProjectList,
  useProjectCreate,
  useProjectDetail,
  useProjectUpdate,
  useProjectDelete,
  mapToProject,
} from '@/api/services/project/index'

// =============== GitHub 연동 ===============

// 타입
export type {
  GithubRepo,
  GithubRepoResponse,
} from '@/api/services/github/githubRepo'

// API 함수
export {
  getProjectDetail,
  getCommitPeriods,
  getProjectFiles,
  getFileCode,
  generateCSQuestions,
} from '@/api/services/github/projectGithubService'

export {
  fetchGitHubContents,
  fetchGitHubFile,
} from '@/api/services/github/githubApi'

export { useGithubRepos } from '@/api/services/github/githubRepo'

// =============== CS 질문 (Question) ===============

// 타입 - question 모듈에서 내보내기
export type {
  CreateProjectCsQuestionRequest,
  FeedbackRequest,
  FeedbackResponse,
  CSQuestionResponse,
  CSQuestionListResponse,
  RecentCSQuestionsResponse,
  CSQuestion,
  HistoryByDate,
  QuestionHistoryItem,
} from '@/api/services/question/types'

// CS 질문 생성 API
export {
  useCreateProjectCsQuestion,
  generateCSQuestions as generateCodeCSQuestions,
  useGenerateCSQuestions,
} from '@/api/services/question/generate'

// 질문 이력 API
export {
  getQuestionHistory as getCSQuestionHistory,
  useQuestionHistory,
  saveQuestion as saveCSQuestion,
  bookmarkQuestion as bookmarkCSQuestion,
} from '@/api/services/question/history'

// 답변 및 피드백 API
export {
  submitAnswer as submitCSAnswer,
  useSubmitFeedback,
  useCreateFeedback,
} from '@/api/services/question/feedback'

// 질문 조회 API
export {
  getQuestionDetail,
  useQuestionDetail,
  useProjectCsQuestion,
  useRecentCSQuestions,
  useProjectCsQuestionList,
} from '@/api/services/question/query'

// =============== 폴더 (Folder) ===============

//folder
export type { Folder, Questions } from '@/api/services/folder/model'
export {
  useFolderInfo,
  useFolderUpdate,
  useFolderDelete,
  useFolderQuestions,
  useFolderBookmark,
  useFolderBookmarkCancel,
} from '@/api/services/folder/queries'

export type {
  CSQuestionList,
  CSQuestionDetail,
  CSAnswer,
} from '@/api/services/CS/model'
export {
  useGetCSQuestion,
  useGetCSQuestionDetail,
  useInfiniteQuestions,
  useCSFeedback,
  useCSRetryFeedback,
  useCSDontknowFeedback,
} from '@/api/services/CS/queries'

export {
  useRegisterFCMToken,
  useDeleteFCMToken,
} from '@/api/services/FCM/queries'

export type { Notification } from '@/api/services/notification/model'
export {
  useNotifications,
  useReadNotification,
} from '@/api/services/notification/queries'
