import React from 'react'
import ProjectDetailPage from '@/components/DetailProject'

interface PageProps {
  params: {
    projectId: string
  }
}

export default function ProjectDetailRoute({ params }: PageProps) {
  return <ProjectDetailPage params={Promise.resolve(params)} />
}
