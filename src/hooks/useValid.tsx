import { z } from 'zod'

//이메일
const emailField = z.string().email()

//기술 스택
const stacksField = z.array(z.string()).min(1)

//알림 설정
const notificationOptions = z.enum(['agree', 'deny'])

export const SignupSchema = z.object({
  email: emailField,
  stack: stacksField,
  notification: notificationOptions,
})
