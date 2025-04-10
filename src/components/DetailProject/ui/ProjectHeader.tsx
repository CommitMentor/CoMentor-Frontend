'use client'

import React from 'react'
import { Edit3, Trash2 } from 'lucide-react'
import { ProjectHeaderProps } from '../types'

/**
 * 프로젝트 헤더 컴포넌트
 * 프로젝트 제목, 설명, 역할, 기술 스택, 상태 등을 표시합니다.
 */
const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  project,
  onEdit,
  onDelete,
}) => {
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onEdit) onEdit()
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onDelete) onDelete()
  }

  const getStatusColor = (status: string) => {
    return status === 'Progress' ? 'bg-yellow-400' : 'bg-green-500'
  }

  return (
    <div className="flex w-full flex-col gap-5 rounded-lg border border-slate-300 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{project.title}</h1>
        <div className="flex gap-2">
          {onEdit && (
            <button
              className="rounded-full p-1.5 text-slate-700 hover:bg-slate-100"
              onClick={handleEdit}
              aria-label="프로젝트 편집"
            >
              <Edit3 size={18} />
            </button>
          )}
          {onDelete && (
            <button
              className="rounded-full p-1.5 text-red-500 hover:bg-red-50"
              onClick={handleDelete}
              aria-label="프로젝트 삭제"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </div>

      {project.updatedAt && (
        <div className="text-xs text-gray-600">
          최근 업데이트: {project.updatedAt}
        </div>
      )}

      <div className="flex gap-5">
        <div className="flex flex-1 flex-col gap-2">
          <span className="text-xs text-slate-500">프로젝트 설명</span>
          <p className="text-sm text-slate-700">{project.description}</p>
        </div>

        <div className="flex flex-1 flex-col gap-2">
          <span className="text-xs text-slate-500">맡은 역할</span>
          <p className="text-sm text-slate-700">{project.role}</p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs text-slate-500">기술 스택</span>
        <div className="flex flex-wrap gap-2">
          {project.techStack.map((tech, index) => (
            <span
              key={index}
              className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600 hover:bg-blue-100"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-500">상태:</span>
        <div className="flex items-center gap-1.5">
          <div
            className={`h-2 w-2 rounded-full ${getStatusColor(project.status)}`}
          ></div>
          <span className="text-xs font-medium">{project.status}</span>
        </div>
      </div>
    </div>
  )
}

export default ProjectHeader
