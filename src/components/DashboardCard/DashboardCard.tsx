import { Pen, Trash2, Loader2, Check } from 'lucide-react'
import { useState, useEffect } from 'react'
import { ProjectEditModal } from '../ProjectEditModal'
import { useProjectDelete } from '@/api/services/project/index'
import { DeleteConfirmDialog } from './DeleteConfirmDialog'
import { ProjectSuccessMessage } from './ProjectSuccessMessage'
import { CardContent } from './CardContent'

export type CardType = {
  id: number // 프로젝트 고유 ID (API 통신용)
  title: string
  personal_stack: string[]
  description: string
  status: string
  createdAt: string
  updatedAt: string
  role: string
}

interface DashboardCardProps {
  card: CardType
  onRefresh: () => void // 대시보드 갱신 함수
}

/**
 * 대시보드에 표시되는 프로젝트 카드 컴포넌트
 */
export const DashboardCard = ({ card, onRefresh }: DashboardCardProps) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deleteStatus, setDeleteStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle')
  const [updateStatus, setUpdateStatus] = useState<'idle' | 'success'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  // 성공 메시지 자동 숨김 타이머
  useEffect(() => {
    if (updateStatus === 'success') {
      const timer = setTimeout(() => {
        setUpdateStatus('idle')
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [updateStatus])

  const projectId = card.id
  const { mutate: deleteProject } = useProjectDelete(projectId)

  // 날짜에서 시간을 제외하고 YYYY. MM. DD 형식으로 변환
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return `${date.getFullYear()}. ${String(date.getMonth() + 1).padStart(2, '0')}. ${String(date.getDate()).padStart(2, '0')}`
  }

  // 상태값 표시 텍스트 변환
  const getStatusText = (status: string) => {
    return status === 'PROGRESS' ? 'Progress' : 'Done'
  }

  // 편집 버튼 클릭 핸들러
  const handleEditClick = () => {
    setIsEditModalOpen(true)
  }

  // 프로젝트 수정 완료 핸들러
  const handleEditSuccess = () => {
    setUpdateStatus('success')
    onRefresh() // 대시보드 갱신
  }

  // 삭제 버튼 클릭 핸들러
  const handleDeleteClick = () => {
    // ID가 없는 경우 처리
    if (!projectId) {
      setDeleteStatus('error')
      setErrorMessage('유효한 프로젝트 ID가 없습니다.')
      return
    }

    setIsDeleteDialogOpen(true)
  }

  // 삭제 확인 처리
  const handleConfirmDelete = () => {
    setDeleteStatus('loading')

    deleteProject(undefined, {
      onSuccess: () => {
        setDeleteStatus('success')
        setIsDeleteDialogOpen(false)
        setTimeout(() => {
          onRefresh() // 대시보드 갱신
        }, 1000)
      },
      onError: (error) => {
        setDeleteStatus('error')
        setErrorMessage(
          error.message || '프로젝트 삭제 중 오류가 발생했습니다.',
        )
      },
    })
  }

  // 오류 닫기 핸들러
  const handleCloseError = () => {
    setDeleteStatus('idle')
  }

  return (
    <>
      {/* 수정 성공 메시지 */}
      {updateStatus === 'success' && <ProjectSuccessMessage type="update" />}

      {/* 삭제 성공 또는 카드 내용 */}
      {deleteStatus === 'success' ? (
        <ProjectSuccessMessage type="delete" />
      ) : (
        <CardContent
          card={card}
          deleteStatus={deleteStatus}
          errorMessage={errorMessage}
          onEditClick={handleEditClick}
          onDeleteClick={handleDeleteClick}
          onCloseError={handleCloseError}
        />
      )}

      {/* 삭제 확인 대화상자 */}
      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        projectTitle={card.title}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        isLoading={deleteStatus === 'loading'}
        error={deleteStatus === 'error' ? { message: errorMessage } : undefined}
      />

      {/* 편집 모달 */}
      {isEditModalOpen && (
        <ProjectEditModal
          projectId={projectId}
          initialData={{
            description: card.description,
            role: card.role,
            status: card.status as 'PROGRESS' | 'DONE',
          }}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleEditSuccess}
        />
      )}
    </>
  )
}
