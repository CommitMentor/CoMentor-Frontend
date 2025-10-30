'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Loader2 } from 'lucide-react'
import { ProjectData } from './types'

// 컴포넌트 및 UI
import ProjectHeader from './ui/ProjectHeader'
import CodeSelectionTab from './code-selection'
import CSQuestionsTab from './cs-questions'
import QuestionHistoryTab from './question-history'
import { DeleteConfirmDialog } from '../Dashboard/DashboardCard/DeleteConfirmDialog'

// API 서비스
import {
  getProjectDetail,
  getCSQuestionHistory,
  submitCSAnswer,
  saveCSQuestion,
  bookmarkCSQuestion,
  useProjectDelete,
} from '@/api'
import { ProjectEditModal } from '../Modal/ProjectEditModal'
import { useBookmarkHandler } from '@/hooks/useBookmarkHandler'

export const DetailProject = () => {
  const { projectId } = useParams<{ projectId: string }>()
  const searchParams = useSearchParams()
  const router = useRouter()

  const tabFromURL = searchParams.get('tab') || null

  const [selectedTab, setSelectedTab] = useState(tabFromURL ?? 'code-select')
  const [loading, setLoading] = useState(true)
  const [projectData, setProjectData] = useState<ProjectData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [questionHistory, setQuestionHistory] = useState<any | null>(null)
  const [selectedCodeSnippet, setSelectedCodeSnippet] = useState<string>('')
  const [selectedFolderName, setSelectedFolderName] = useState<string>('')
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [activeCSQuestionIds, setActiveCSQuestionIds] = useState<number[]>([])

  const { mutateAsync: deleteProject } = useProjectDelete(Number(projectId))
  const { handleBookmarkClick } = useBookmarkHandler()

  // 프로젝트 데이터 로드
  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        if (!projectId) throw new Error('프로젝트 ID가 없습니다.')

        setLoading(true)
        const project = await getProjectDetail(projectId)
        setProjectData(project)

        try {
          const history = await getCSQuestionHistory(projectId)
          setQuestionHistory(history)
        } catch (historyError) {
          console.error('질문 이력을 가져오는 중 오류 발생:', historyError)
        }

        setError(null)
      } catch (error) {
        console.error('프로젝트 데이터를 가져오는 중 오류 발생:', error)
        setError(error instanceof Error ? error.message : '데이터 로딩 실패')
      } finally {
        setLoading(false)
      }
    }

    fetchProjectData()
  }, [projectId])

  // 핸들러 함수들
  const handleGenerateQuestions = useCallback(
    (code: string, folderName: string) => {
      setSelectedCodeSnippet(code)
      setSelectedFolderName(folderName)
      setSelectedTab('cs-questions')
    },
    [],
  )

  const handleAnswerSubmit = useCallback(
    async (answer: string, questionId: number) => {
      try {
        return await submitCSAnswer(questionId, answer)
      } catch (error) {
        console.error('답변 제출 중 오류 발생:', error)
        return '답변 제출 중 오류가 발생했습니다. 다시 시도해주세요.'
      }
    },
    [],
  )

  const handleSaveQuestion = useCallback(
    async (questionId: number) => {
      try {
        const success = await new Promise<boolean>((resolve) => {
          handleBookmarkClick({
            questionId,
            isBookmarked: false,
            onLocalToggle: (newState) => {
              if (newState) resolve(true)
            },
          })
        })
        return success
      } catch (error) {
        console.error('질문 북마크 저장 중 오류 발생:', error)
        return false
      }
    },
    [handleBookmarkClick],
  )

  const handleBookmarkQuestion = useCallback(async (questionId: number) => {
    try {
      return await bookmarkCSQuestion(questionId)
    } catch (error) {
      console.error('북마크 중 오류 발생:', error)
      return false
    }
  }, [])

  const handleChooseAnotherCode = useCallback(() => {
    setSelectedTab('code-select')
  }, [])

  const handleEditProject = useCallback(() => {
    setIsEditModalOpen(true)
  }, [])

  const handleEditSuccess = useCallback(async () => {
    try {
      if (projectId) {
        const updatedProject = await getProjectDetail(projectId)
        setProjectData(updatedProject)
      }
    } catch (error) {
      console.error('업데이트된 프로젝트 정보를 불러오는 중 오류 발생:', error)
    }
  }, [projectId])

  const handleDeleteProject = useCallback(() => {
    setIsDeleteDialogOpen(true)
  }, [])

  const handleConfirmDelete = useCallback(async () => {
    setDeleteLoading(true)
    setDeleteError(null)

    try {
      await deleteProject()
      router.push(`/dashboard?refresh=${new Date().getTime()}`)
    } catch (error) {
      setDeleteError(
        error instanceof Error
          ? error.message
          : '프로젝트 삭제 중 오류가 발생했습니다.',
      )
    } finally {
      setDeleteLoading(false)
    }
  }, [deleteProject, router])

  const handleCSQuestionsLoaded = useCallback((questions: any[]) => {
    if (questions && questions.length > 0) {
      const questionIds = questions.map((q) => q.id || 0).filter((id) => id > 0)
      setActiveCSQuestionIds(questionIds)
    }
  }, [])

  // 로딩 중
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-slate-700" />
          <p className="mt-2 text-sm text-slate-600">프로젝트 로딩 중...</p>
        </div>
      </div>
    )
  }

  // 에러
  if (error || !projectData) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-red-600">
            {error || '프로젝트를 찾을 수 없습니다'}
          </p>
        </div>
      </div>
    )
  }

  // 정상 렌더링
  return (
    <div className="container mx-auto flex w-full max-w-[1368px] flex-col gap-8 px-4 py-6 md:px-6">
      <ProjectHeader
        project={projectData}
        onEdit={handleEditProject}
        onDelete={handleDeleteProject}
      />

      <Tabs
        value={selectedTab}
        onValueChange={setSelectedTab}
        className="w-full max-w-[1368px]"
      >
        <TabsList className="w-full rounded-lg bg-slate-100">
          <TabsTrigger value="code-select">코드 선택</TabsTrigger>
          <TabsTrigger value="cs-questions">CS 질문</TabsTrigger>
          <TabsTrigger value="question-history">질문 기록</TabsTrigger>
        </TabsList>

        <TabsContent value="code-select" className="mt-4">
          <CodeSelectionTab
            projectId={projectId}
            onSelectCodeSnippet={handleGenerateQuestions}
          />
        </TabsContent>

        <TabsContent value="cs-questions">
          <CSQuestionsTab
            projectId={projectId}
            codeSnippet={selectedCodeSnippet}
            folderName={selectedFolderName}
            onAnswerSubmit={handleAnswerSubmit}
            onSaveQuestion={handleSaveQuestion}
            onChooseAnotherCode={handleChooseAnotherCode}
            onGenerateMoreQuestions={() => console.log('더 많은 질문 생성')}
            onFinish={() => setSelectedTab('question-history')}
            onTabChange={(tabId) => setSelectedTab(tabId)}
            onQuestionsLoad={handleCSQuestionsLoaded}
          />
        </TabsContent>

        <TabsContent value="question-history">
          <QuestionHistoryTab
            projectId={projectId}
            initialHistory={questionHistory}
            onBookmarkQuestion={handleBookmarkQuestion}
            onAnswerSubmit={handleAnswerSubmit}
            onTabChange={setSelectedTab}
            activeTab={selectedTab}
            activeCSQuestionIds={activeCSQuestionIds}
          />
        </TabsContent>
      </Tabs>

      {isEditModalOpen && projectData && (
        <ProjectEditModal
          projectId={Number(projectId)}
          initialData={{
            description: projectData.description,
            role: projectData.role,
            status: projectData.status.toLowerCase().includes('progress')
              ? 'PROGRESS'
              : 'DONE',
          }}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleEditSuccess}
        />
      )}

      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        projectTitle={projectData.title}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        isLoading={deleteLoading}
        error={deleteError ? { message: deleteError } : undefined}
      />
    </div>
  )
}
