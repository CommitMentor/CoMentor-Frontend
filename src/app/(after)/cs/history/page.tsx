import { serverFetcher } from '@/api/lib/serverFetcher'
import HistoryPage from './HistoryPage'
import { CSQuestionResponse } from '@/api/services/CS/model'

export default async function Page() {
  const initialData = await serverFetcher<CSQuestionResponse>(
    `/question/list?page=0`,
  )

  return <HistoryPage initialData={initialData} />
}
