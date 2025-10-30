import { Suspense } from 'react'
import { Loader2 } from 'lucide-react'
import SettingsView from './components/SettingView'

function Loading() {
  return (
    <div
      className="flex h-screen w-full items-center justify-center"
      data-testid="loading" 
    >
      <Loader2 size={32} className="animate-spin text-slate-500" />
    </div>
  )
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <SettingsView />
    </Suspense>
  )
}
