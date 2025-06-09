'use client'

import React from 'react'
import { CSAnswer } from '@/api'

interface AnswerListProps {
  answers: CSAnswer[]
}

const AnswerList = ({ answers }: AnswerListProps) => {
  if (!answers.length) {
    return <p className="text-slate-500">아직 제출된 답변이 없습니다.</p>
  }

  return (
    <div className="flex flex-col gap-2">
      {answers.map((a, idx) => (
        <p key={idx} className="font-medium">
          {a.content}
        </p>
      ))}
    </div>
  )
}

export default AnswerList