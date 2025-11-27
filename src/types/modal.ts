import { Folder, LearningHistoryItem } from '@/api'

export type ModalType =
  | 'editFolder'
  | 'deleteFolder'
  | 'createFolder'
  | 'streakChart'

export type ModalProps = {
  editFolder: { folder: Folder }
  deleteFolder: { folderId: number }
  createFolder: {
    questionId?: number
    csQuestionId?: number
    onBookmarkDone?: (fileName?: string) => void
  }
  streakChart: {
    streakCount: number
    learningData?: LearningHistoryItem[]
  }
}
