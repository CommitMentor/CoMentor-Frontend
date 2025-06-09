'use client'

import { useUserInfo } from '@/api/services/user/queries'
import { EditForm } from '@/components/User/EditForm'

const Page = () => {
  const { data: user } = useUserInfo()

  if (!user) return <div>Loading...</div>

  return (
    <main className="flex flex-grow items-center justify-center px-6 py-5">
      <EditForm user={user?.result} />
    </main>
  )
}

export default Page
