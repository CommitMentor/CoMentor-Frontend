'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { TitleSelect, ProjectFormValues, Repository } from './TitleSelect'
import { TextareaField } from './TextareaField'
import { StatusRadioGroup, StatusOption } from './StatusRadioGroup'
import { ModalButtons } from './ModalButtons'
import { Form, FormField } from '@/components/ui/form'
import { ProjectSchema } from '@/hooks'
import { useGithubRepos, GithubRepo } from '@/api/services/github'
import { useEffect, useState, useMemo } from 'react'
import {
  useProjectCreate,
  ProjectCreateRequest,
} from '@/api/services/project/index'

/**
 * 진행 상태 옵션 정의
 */
const statusOptions: StatusOption[] = [
  { id: 'in_progress', value: 'in_progress', label: '개발 중' },
  { id: 'completed', value: 'completed', label: '완료' },
]

interface ProjectImportModalProps {
  onClose: () => void
  onSubmit: (data?: ProjectFormValues, success?: boolean) => void
}

/**
 * 프로젝트 정보 입력을 위한 모달 컴포넌트
 */
export const ProjectImportModal = ({
  onClose,
  onSubmit,
}: ProjectImportModalProps) => {
  const [submitState, setSubmitState] = useState<{
    status: 'idle' | 'loading' | 'error'
    message?: string
  }>({ status: 'idle' })
  const { data: reposData, isLoading, refetch } = useGithubRepos()
  const { mutate: createProject } = useProjectCreate()

  // 모달이 열릴 때 body 스크롤 방지
  useEffect(() => {
    // 현재 스크롤 위치 저장
    const scrollY = window.scrollY

    // body에 overflow hidden 적용
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.width = '100%'

    // 컴포넌트 언마운트 시 원래 상태로 복원
    return () => {
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      window.scrollTo(0, scrollY)
    }
  }, [])

  // 컴포넌트 마운트 시 GitHub 레포지토리 목록 강제 새로고침
  useEffect(() => {
    refetch()
  }, [refetch])

  // GitHub 저장소 데이터를 가공하여 UI에 표시할 형태로 변환
  const repositories = useMemo(() => {
    return (
      reposData?.result?.map((repo: GithubRepo) => ({
        value: `${repo.id}`, // ID를 명시적으로 문자열로 변환
        label: repo.name,
        repoId: repo.id,
      })) ?? []
    )
  }, [reposData])

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(ProjectSchema),
    defaultValues: {
      title: '',
      description: '',
      role: '',
      status: 'in_progress',
    },
  })

  const handleSubmit = (data: ProjectFormValues) => {
    // 상태 초기화
    setSubmitState({ status: 'loading' })

    // 선택된 레포지토리 찾기 (이름으로 매칭)
    const selectedRepo = repositories.find((repo) => repo.label === data.title)

    // 레포지토리가 선택되지 않았다면 오류 상태 설정 후 함수 종료
    if (!selectedRepo) {
      setSubmitState({
        status: 'error',
        message: '유효한 GitHub 레포지토리를 선택해주세요.',
      })
      return
    }

    // 상태값 변환: 'in_progress' -> 'PROGRESS', 'completed' -> 'DONE'
    const statusMap = {
      in_progress: 'PROGRESS',
      completed: 'DONE',
    }

    // 서버에 전송할 데이터 구조로 변환
    const serverData: ProjectCreateRequest = {
      id: selectedRepo.repoId, // 저장된 실제 레포지토리 ID 사용
      description: data.description,
      role: data.role,
      status: statusMap[data.status as keyof typeof statusMap] as
        | 'PROGRESS'
        | 'DONE',
    }

    // API 직접 호출
    createProject(serverData, {
      onSuccess: () => {
        // 성공 시 즉시 모달 닫고 콜백 호출 (success 플래그 전달)
        form.reset()
        onClose()
        onSubmit(data, true)
      },
      onError: (error) => {
        setSubmitState({
          status: 'error',
          message: error.message || '프로젝트 생성 중 오류가 발생했습니다.',
        })
      },
    })
  }

  // 모달 하단 버튼
  const modalButtons = (
    <ModalButtons
      onClose={() => {
        form.reset()
        onClose()
      }}
      isSubmitting={submitState.status === 'loading'}
    />
  )

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      aria-modal="true"
      role="dialog"
    >
      <div className="w-[462px] rounded-[10px] bg-white px-6 py-8 shadow-md outline-1 outline-offset-[-1px] outline-slate-300">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex w-full flex-col gap-7"
          >
            {/* 오류 메시지만 표시 (성공 메시지는 제거) */}
            {submitState.status === 'error' && (
              <div className="mb-2 rounded-md bg-red-50 p-3 text-center text-sm text-red-600 transition-all">
                {submitState.message}
              </div>
            )}

            {/* 프로젝트 제목 필드 */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <TitleSelect
                  field={field}
                  repositories={repositories}
                  isLoading={isLoading}
                />
              )}
            />

            {/* 프로젝트 내용 필드 */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <TextareaField
                  field={field}
                  label="프로젝트 내용"
                  placeholder="프로젝트 내용을 입력하세요"
                />
              )}
            />

            {/* 맡은 역할 필드 */}
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <TextareaField
                  field={field}
                  label="맡은 역할"
                  placeholder="맡은 역할을 입력하세요"
                />
              )}
            />

            {/* 진행 여부 필드 */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <StatusRadioGroup field={field} options={statusOptions} />
              )}
            />

            {/* 취소/완료 버튼 */}
            {modalButtons}
          </form>
        </Form>
      </div>
    </div>
  )
}
