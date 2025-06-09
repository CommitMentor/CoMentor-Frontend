'use client'

import { Github, LogOut } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { CheckboxGroup, InputField, RadioGroupField } from '../Form'
import { SignupSchema } from '@/hooks'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from '../ui/form'
import { useForm } from 'react-hook-form'
import { User, useUserEdit } from '@/api'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { useQueryClient } from '@tanstack/react-query'
import { Stack } from '@/api/types/common'
import { UserResponse } from '@/api'

interface EditFormProps {
  user: UserResponse['result']
}

const notificationOptions = [
  { value: true, label: '알림 허용' },
  { value: false, label: '알림 거부' },
]

const techStackOptions = Object.keys(Stack).map((key) => ({
  id: Stack[key as keyof typeof Stack],
  label: key,
}))

export const EditForm = ({ user }: EditFormProps) => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { clearAuth } = useAuthStore()
  const { mutate, isPending } = useUserEdit()

  const form = useForm<z.infer<typeof SignupSchema>>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      email: user.email,
      stackNames: user.stackNames,
      notification: user.notification,
    },
  })

  const handleLogout = () => {
    clearAuth()
    router.push('/')
  }

  const onSubmit = (data: z.infer<typeof SignupSchema>) => {
    const updatedUser: User = {
      ...data,
      notification: data.notification,
    }
    mutate(updatedUser, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['user'] })
        router.push('/dashboard')
      },
      onError: (error) => {
        console.error('회원정보 수정 실패:', error)
      },
    })
  }
  return (
    <section className="flex w-[550px] min-w-[450px] flex-col gap-10">
      <div className="flex flex-col gap-5 rounded-[15px] border border-slate-400 px-[30px] py-5 shadow">
        <h1 className="text-[25px] font-semibold text-slate-800">
          깃허브 계정
        </h1>
        <div className="flex items-center gap-5">
          <Image
            src={user.avatarUrl || '/images/glassdumpling.png'}
            alt="avatar"
            width={60}
            height={60}
            className="rounded-full border border-slate-100"
            priority
            sizes="60px"
          />
          <div className="flex flex-1 flex-col">
            <p className="flex items-center gap-2">
              <Github size={18} />
              <span>{user.userName}</span>
            </p>
            <p className="text-[14px] text-slate-500">
              깃허브 계정으로 로그인됨
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="cursor-pointer"
          >
            <LogOut size={14} />
            <span className="text-[13px]">로그아웃</span>
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-10"
        >
          <div className="flex flex-col gap-5 rounded-[15px] border border-slate-400 px-[30px] py-5 shadow">
            <InputField
              control={form.control}
              name="email"
              label="이메일"
              placeholder="example@test.com"
              description="이메일을 입력해주세요"
            />
            <RadioGroupField
              control={form.control}
              name="notification"
              label="이메일 수신 설정"
              description="매일 새로운 CS 질문이 생성되면 알림을 받습니다."
              options={notificationOptions}
            />
          </div>

          <div className="flex flex-col gap-5 rounded-[15px] border border-slate-400 px-[30px] py-5 shadow">
            <CheckboxGroup
              control={form.control}
              name="stackNames"
              label="기술 스택"
              description="받고 싶은 기술 스택을 선택하세요."
              options={techStackOptions}
            />
          </div>

          <div className="flex gap-[10px]">
            <Button
              className="flex-1 bg-slate-800"
              onClick={() => router.push('/dashboard')}
            >
              취소
            </Button>
            <Button className="flex-1 bg-slate-800" type="submit">
              {isPending ? '저장 중..' : '수정'}
            </Button>
          </div>
        </form>
      </Form>
    </section>
  )
}
