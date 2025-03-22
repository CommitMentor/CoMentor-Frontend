'use client'

import { Form } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  InputField,
  CheckboxGroup,
  RadioGroupField,
} from '@/components/Form/index'
import { SignupSchema } from '@/hooks'

const techStackOptions = [
  { id: 'front', label: '프론트엔드' },
  { id: 'backend', label: '백엔드' },
  { id: 'algorithm', label: '알고리즘' },
  { id: 'database', label: '데이터베이스' },
]

const notificationOptions = [
  { value: 'agree', label: '알림 허용' },
  { value: 'deny', label: '알림 거부' },
]

export default function SignupForm() {
  const form = useForm<z.infer<typeof SignupSchema>>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      email: '',
      stack: [],
      notification: 'agree',
    },
  })

  const onSubmit = (data: z.infer<typeof SignupSchema>) => {
    console.log(data)
  }

  return (
    <Form {...form}>
      <form
        className="flex h-full w-[400px] flex-col items-center gap-6"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <h1 className="text-3xl leading-[20px] font-semibold tracking-[1.08px] text-slate-800">
          회원가입
        </h1>

        <InputField
          control={form.control}
          name="email"
          label="이메일"
          placeholder="example@test.com"
          description="이메일을 입력해주세요"
        />

        <CheckboxGroup
          control={form.control}
          name="stack"
          label="기술 스택"
          description="선택한 기술을 기반으로 CS 질문을 생성해요"
          options={techStackOptions}
        />

        <RadioGroupField
          control={form.control}
          name="notification"
          label="알림 설정"
          description="알림을 받을지 거부할지 선택해주세요"
          options={notificationOptions}
        />

        <Button
          type="submit"
          className="w-full cursor-pointer bg-slate-800 text-[14px] leading-6"
          disabled={!form.formState.isValid}
        >
          회원 가입
        </Button>
      </form>
    </Form>
  )
}
