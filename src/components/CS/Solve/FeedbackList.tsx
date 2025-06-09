'use client'

import React from 'react'
import { CSAnswer } from '@/api'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'

interface FeedbackListProps {
  feedbacks: CSAnswer[]
}

const FeedbackList = ({ feedbacks }: FeedbackListProps) => {
  if (!feedbacks.length) {
    return <p className="text-slate-500">📝 답변을 하고 피드백을 받아보세요.</p>
  }

  return (
    <div className="flex flex-col gap-5">
      {feedbacks.map((f, idx) => (
        <ReactMarkdown
          key={idx}
          remarkPlugins={[remarkGfm]}
          components={{
            code({ className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '')
              return match ? (
                <SyntaxHighlighter
                  language={match[1]}
                  style={oneDark}
                  PreTag="div"
                  customStyle={{
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    padding: '1rem',
                  }}
                  {...(props as any)} // 안전한 타입 우회
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code
                  className="rounded bg-slate-100 px-1 py-0.5 font-mono text-sm"
                  {...props}
                >
                  {children}
                </code>
              )
            },
            h2: ({ children }) => (
              <h2 className="text-lg font-semibold text-slate-800">
                {children}
              </h2>
            ),
            p: ({ children }) => (
              <p className="leading-relaxed text-slate-700">{children}</p>
            ),
            ul: ({ children }) => (
              <ul className="list-inside list-disc space-y-1 text-slate-700">
                {children}
              </ul>
            ),
            li: ({ children }) => <li className="ml-4">{children}</li>,
          }}
        >
          {f.content}
        </ReactMarkdown>
      ))}
    </div>
  )
}

export default FeedbackList