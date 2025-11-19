'use client'

import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { PlusIcon, XIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useQueryClient } from '@tanstack/react-query'
import { Folder, useFolderBookmark, useFolderInfo } from '@/api'

interface FolderModalProps {
  questionId?: number
  csQuestionId?: number
  onBookmarkDone?: (fileName?: string) => void
  onClose: () => void
}

export const CreateFolderModal = ({
  questionId,
  csQuestionId,
  onBookmarkDone,
  onClose,
}: FolderModalProps) => {
  const { data } = useFolderInfo()
  const { mutate: bookmark } = useFolderBookmark()
  const queryClient = useQueryClient()

  const {
    register,
    watch,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<{
    selected: number | null
    newFolder: string
    creating: boolean
  }>({
    defaultValues: {
      selected: null,
      newFolder: '',
      creating: false,
    },
  })

  const selected = watch('selected')
  const creating = watch('creating')

  const handleSelect = (folderId: number, fileName: string) => {
    if (folderId === selected) return

    setValue('selected', folderId)
    bookmark(
      {
        fileName,
        ...(questionId ? { questionId } : csQuestionId ? { csQuestionId } : {}),
      },
      {
        onSuccess: () => {
          onBookmarkDone?.(fileName)
        },
      },
    )
  }

  const onNewFolder = (formData: { newFolder: string }) => {
    const newName = formData.newFolder.trim()
    if (!newName) return

    bookmark(
      {
        fileName: newName,
        ...(questionId ? { questionId } : csQuestionId ? { csQuestionId } : {}),
      },
      {
        onSuccess: async () => {
          // 1. 폴더 목록 강제 갱신
          await queryClient.invalidateQueries({ queryKey: ['folders'] })

          // 2. 폴더 목록에서 새로 생긴 마지막 폴더 선택
          const latest = queryClient.getQueryData<{ result: Folder[] }>([
            'folders',
          ])
          const lastFolder = latest?.result[latest.result.length - 1]

          if (lastFolder) {
            setValue('selected', lastFolder.folderId)

            // 3. 북마크 동기화 콜백
            onBookmarkDone?.(lastFolder.fileName)
          }

          // 4. UI 상태 초기화
          setValue('creating', false)
          setValue('newFolder', '')
        },
      },
    )
  }

  const folders: Folder[] = data?.result || []

  return (
    <form
      className="flex min-w-48 flex-col gap-5 rounded-[10px] border border-slate-300 bg-white p-5 shadow-md"
      onSubmit={handleSubmit(onNewFolder)}
    >
      <div className="flex justify-between">
        <p className="text-[16px] font-medium">질문 저장</p>
        <button type="button" className="cursor-pointer p-1" onClick={onClose}>
          <XIcon size={16} />
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {folders.map((folder) => (
          <label
            key={folder.folderId}
            className="flex cursor-pointer items-center gap-2"
          >
            <input
              type="radio"
              checked={selected === folder.folderId}
              onChange={() => handleSelect(folder.folderId, folder.fileName)}
            />
            <p className="font-medium">{folder.fileName}</p>
          </label>
        ))}

        {creating ? (
          <div className="flex items-center gap-2">
            <input type="radio" checked readOnly className="cursor-default" />
            <Input
              {...register('newFolder')}
              placeholder="폴더 이름"
              maxLength={9}
              className="w-36"
            />
            <Button
              type="submit"
              variant="outline"
              disabled={!watch('newFolder') || isSubmitting}
            >
              저장
            </Button>
          </div>
        ) : (
          <Button
            type="button"
            variant="secondary"
            className="flex gap-2 rounded-3xl"
            onClick={() => setValue('creating', true)}
          >
            <PlusIcon size={13} />
            <p className="font-medium">새 폴더</p>
          </Button>
        )}
      </div>
    </form>
  )
}
