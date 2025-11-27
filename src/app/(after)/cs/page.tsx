import type { CSQuestionResponse } from '@/api/services/CS/model'
import { serverFetcher } from '@/api/lib/serverFetcher'
import ClientPage from './ClientPage'

export default async function Page() {
  const initialData = await serverFetcher<CSQuestionResponse>(
    `/question/list?page=0`,
  )

  return <ClientPage initialData={initialData} />
}
