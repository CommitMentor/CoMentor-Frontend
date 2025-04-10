'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { TextareaField } from '../ProjectImportModal/TextareaField'
import {
  StatusRadioGroup,
  StatusOption,
} from '../ProjectImportModal/StatusRadioGroup'
import { ModalButtons } from '../ProjectImportModal/ModalButtons'
import { Form, FormField } from '@/components/ui/form'
import { z } from 'zod'
import { useState, useEffect } from 'react'
import {
  useProjectUpdate,
  ProjectUpdateRequest,
} from '@/api/services/project/index'

// 프로젝트 수정 폼 스키마
const ProjectEditSchema = z.object({
  title: z.string(), // title은 빈 문자열이지만 존재해야 함
  description: z.string().min(1, '프로젝트 내용을 입력해주세요'),
  role: z.string().min(1, '맡은 역할을 입력해주세요'),
  status: z.enum(['in_progress', 'completed']),
})

// 프로젝트 수정 폼 값 타입
export type ProjectEditFormValues = z.infer<typeof ProjectEditSchema>

//진행 상태 옵션 정의
const statusOptions: StatusOption[] = [
  { id: 'in_progress', value: 'in_progress', label: '개발 중' },
  { id: 'completed', value: 'completed', label: '완료' },
]

interface ProjectEditModalProps {
  projectId: number
  initialData: {
    description: string
    role: string
    status: 'PROGRESS' | 'DONE'
  }
  onClose: () => void
  onSubmit: () => void
}

/**
 * 프로젝트 정보 수정을 위한 모달 컴포넌트
 */
export const ProjectEditModal = ({
  projectId,
  initialData,
  onClose,
  onSubmit,
}: ProjectEditModalProps) => {
  const [submitStatus, setSubmitStatus] = useState<
    'idle' | 'loading' | 'error'
  >('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const { mutate: updateProject } = useProjectUpdate(projectId)

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

  // 폼 초기화
  const form = useForm<ProjectEditFormValues>({
    resolver: zodResolver(ProjectEditSchema),
    defaultValues: {
      title: '', // 폼 제출 시 필요하지만 실제로 사용하지 않음
      description: initialData.description || '',
      role: initialData.role || '',
      status: initialData.status === 'PROGRESS' ? 'in_progress' : 'completed',
    },
  })

  // 폼 제출 핸들러
  const handleSubmit = (data: ProjectEditFormValues) => {
    setSubmitStatus('loading')
    setErrorMessage('')

    const statusMap = {
      in_progress: 'PROGRESS',
      completed: 'DONE',
    }

    // 서버에 전송할 데이터 구조
    const serverData: ProjectUpdateRequest = {
      description: data.description,
      role: data.role,
      status: statusMap[data.status as keyof typeof statusMap] as
        | 'PROGRESS'
        | 'DONE',
    }

    // API 호출
    updateProject(serverData, {
      onSuccess: () => {
        onClose()
        onSubmit()
      },
      onError: (error) => {
        setSubmitStatus('error')
        setErrorMessage(
          error.message || '프로젝트 수정 중 오류가 발생했습니다.',
        )
      },
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      aria-modal="true"
      role="dialog"
    >
      <div className="animate-slideIn w-[462px] rounded-[10px] bg-white px-6 py-8 shadow-md outline-1 outline-offset-[-1px] outline-slate-300">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex w-full flex-col gap-7"
          >
            {/* 오류 메시지만 표시 (성공 메시지는 제거) */}
            {submitStatus === 'error' && (
              <div className="mb-2 rounded-md bg-red-50 p-3 text-center text-sm text-red-600 transition-all">
                {errorMessage}
              </div>
            )}

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
            <ModalButtons
              onClose={() => {
                form.reset()
                onClose()
              }}
              isSubmitting={submitStatus === 'loading'}
            />
          </form>
        </Form>
      </div>
    </div>
  )
}
