'use client'

import { useState, useEffect } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import {
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
} from '@/components/ui/form'
import { ControllerRenderProps } from 'react-hook-form'

/**
 * 프로젝트 폼 필드 값 인터페이스
 */
export interface ProjectFormValues {
  title: string
  description: string
  role: string
  status: 'in_progress' | 'completed'
}

/**
 * 프로젝트 저장소 타입 정의
 */
export interface Repository {
  value: string
  label: string
}

interface TitleSelectProps {
  field: ControllerRenderProps<ProjectFormValues, 'title'>
  repositories: Repository[]
  isLoading?: boolean
}

/**
 * 프로젝트 제목 선택을 위한 드롭다운 컴포넌트
 */
export const TitleSelect = ({
  field,
  repositories,
  isLoading = false,
}: TitleSelectProps) => {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<string>('')
  const titleInputId = 'project-title-input'
  const { error } = useFormField()

  /**
   * 프로젝트 선택 핸들러
   */
  const handleSelect = (currentValue: string) => {
    // value는 문자열로 된 ID이므로 해당 ID로 저장소 찾기
    const selectedRepo = repositories.find(
      (repo) => repo.value === currentValue,
    )
    if (selectedRepo) {
      // 레이블(저장소 이름)을 필드에 설정
      field.onChange(selectedRepo.label)
      setSelectedId(selectedRepo.value)
    }
    setOpen(false)
  }

  /**
   * 마우스 클릭 핸들러
   */
  const handleItemClick = (e: React.MouseEvent, value: string) => {
    e.preventDefault()
    e.stopPropagation()
    handleSelect(value)
  }

  // 컴포넌트 초기 마운트 시 field.value에 해당하는 저장소 ID 설정
  useEffect(() => {
    if (field.value && repositories.length > 0) {
      const repo = repositories.find((repo) => repo.label === field.value)
      if (repo) {
        setSelectedId(repo.value)
      }
    }
  }, [field.value, repositories])

  /**
   * 선택된 프로젝트 라벨 찾기
   */
  const selectedLabel = field.value
    ? field.value
    : isLoading
      ? '저장소 목록 로딩 중...'
      : 'Repository 불러오기'

  return (
    <FormItem className="flex flex-col gap-1 self-stretch">
      <FormLabel
        htmlFor={titleInputId}
        className="text-[15px] leading-tight font-medium text-slate-900"
      >
        프로젝트 제목 {error && <span className="text-red-500">*</span>}
      </FormLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={titleInputId}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              'inline-flex h-10 w-full min-w-[180px] cursor-pointer items-center justify-between rounded-md border px-3 py-2 text-left hover:bg-slate-50 focus:outline-2 focus:outline-slate-400',
              error && !field.value
                ? 'border-red-500 focus-visible:ring-red-500'
                : 'border-slate-300 bg-white',
            )}
          >
            <span className="truncate text-sm font-normal text-zinc-950">
              {selectedLabel}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[414px] p-0" align="start" sideOffset={4}>
          <Command
            shouldFilter={false}
            filter={(value, search) => {
              if (!search) return 1
              const itemValue = value.toLowerCase()
              const searchValue = search.toLowerCase()
              return itemValue.includes(searchValue) ? 1 : 0
            }}
            loop={true}
          >
            <CommandInput
              placeholder="프로젝트 검색..."
              value={search}
              onValueChange={setSearch}
            />
            <CommandList>
              <CommandEmpty>
                {isLoading ? '저장소 목록 로딩 중...' : '프로젝트가 없습니다.'}
              </CommandEmpty>
              <CommandGroup>
                {repositories
                  .filter((repo) => {
                    if (!search) return true
                    return (
                      repo.label.toLowerCase().includes(search.toLowerCase()) ||
                      repo.value.toLowerCase().includes(search.toLowerCase())
                    )
                  })
                  .map((repository) => (
                    <div
                      key={repository.value}
                      onClick={(e) => handleItemClick(e, repository.value)}
                      className="cursor-pointer"
                    >
                      <CommandItem
                        value={repository.value}
                        onSelect={() => handleSelect(repository.value)}
                        className={cn(
                          'w-full !bg-white px-3 py-2 text-left text-sm',
                          selectedId === repository.value &&
                            '!bg-slate-100 font-medium',
                        )}
                        data-selected={selectedId === repository.value}
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            selectedId === repository.value
                              ? 'opacity-100'
                              : 'opacity-0',
                          )}
                        />
                        {repository.label}
                      </CommandItem>
                    </div>
                  ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <FormMessage className="mt-1 text-xs" />
    </FormItem>
  )
}
