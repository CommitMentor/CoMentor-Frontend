import { useFolderBookmarkCancel } from '@/api'
import {
  CSQuestionDetailResponse,
  CSQuestionResponse,
} from '@/api/services/CS/model'
import { useModalStore } from '@/store/modalStore'
import { InfiniteData, useQueryClient } from '@tanstack/react-query'

type HandleBookmarkParams = {
  questionId?: number
  csQuestionId?: number
  isBookmarked: boolean
  fileName?: string
  refetchKeys?: string[][]
  onLocalToggle?: (newState: boolean) => void
}

export const useBookmarkHandler = () => {
  const { openModal } = useModalStore()
  const queryClient = useQueryClient()
  const { mutate: cancelBookmark } = useFolderBookmarkCancel()

  const updateCache = (
    targetCsQuestionId: number,
    newFileName: string | null,
  ) => {
    // 1. Infinite Query Update
    queryClient.setQueriesData<InfiniteData<CSQuestionResponse>>(
      { queryKey: ['cs-question-infinite'] },
      (oldData) => {
        if (!oldData) return oldData
        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            result: {
              ...page.result,
              content: page.result.content.map((group) => ({
                ...group,
                questions: group.questions.map((q) =>
                  q.csQuestionId === targetCsQuestionId
                    ? { ...q, fileName: newFileName ?? undefined }
                    : q,
                ),
              })),
            },
          })),
        }
      },
    )

    // 2. Detail Query Update
    queryClient.setQueryData<CSQuestionDetailResponse>(
      ['cs-question', targetCsQuestionId.toString()],
      (oldData) => {
        if (!oldData) return oldData
        return {
          ...oldData,
          result: {
            ...oldData.result,
            fileName: newFileName ?? undefined,
          },
        }
      },
    )

    // 3. Dashboard Query Update
    queryClient.setQueriesData<CSQuestionResponse>(
      { queryKey: ['CS Dashboard'] },
      (oldData) => {
        if (!oldData) return oldData
        return {
          ...oldData,
          result: {
            ...oldData.result,
            content: oldData.result.content.map((group) => ({
              ...group,
              questions: group.questions.map((q) =>
                q.csQuestionId === targetCsQuestionId
                  ? { ...q, fileName: newFileName ?? undefined }
                  : q,
              ),
            })),
          },
        }
      },
    )
  }

  const handleBookmarkClick = ({
    questionId,
    csQuestionId,
    isBookmarked,
    fileName,
    refetchKeys,
    onLocalToggle,
  }: HandleBookmarkParams) => {
    if (isBookmarked) {
      // ✅ 안전한 null 체크
      if (!fileName) {
        console.warn('파일 이름이 없습니다.')
        return
      }

      cancelBookmark(
        {
          ...(questionId && { questionId }),
          ...(csQuestionId && { csQuestionId }),
          fileName,
        },
        {
          onSuccess: () => {
            onLocalToggle?.(false)
            // 기존에 전달된 refetchKeys는 우선 무효화
            refetchKeys?.forEach((key) =>
              queryClient.invalidateQueries({ queryKey: key }),
            )

            if (csQuestionId) {
              updateCache(csQuestionId, null)
            }
          },
        },
      )
    } else {
      openModal('createFolder', {
        ...(questionId && { questionId }),
        ...(csQuestionId && { csQuestionId }),
        onBookmarkDone: (newFileName) => {
          onLocalToggle?.(true)
          // 기존에 전달된 refetchKeys 무효화
          refetchKeys?.forEach((key) =>
            queryClient.invalidateQueries({ queryKey: key }),
          )

          if (csQuestionId && newFileName) {
            updateCache(csQuestionId, newFileName)
          } else if (csQuestionId) {
            // Fallback if filename is missing for some reason, though it shouldn't be
            queryClient.invalidateQueries({
              queryKey: ['cs-question-infinite'],
            })
            queryClient.invalidateQueries({ queryKey: ['CS Dashboard'] })
            queryClient.invalidateQueries({
              queryKey: ['cs-question', csQuestionId.toString()],
            })
          }
        },
      })
    }
  }

  return { handleBookmarkClick }
}
