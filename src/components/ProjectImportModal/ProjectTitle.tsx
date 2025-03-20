import { ChevronDown } from 'lucide-react'

export const ProjectTitle = () => (
  <div className="flex flex-col items-start justify-start gap-2.5 self-stretch">
    <div className="justify-start text-[15px] leading-[14px] font-medium text-black">
      프로젝트 제목
    </div>
    <div className="inline-flex h-10 max-h-10 min-h-10 w-[180px] max-w-[180px] min-w-[180px] cursor-pointer items-center justify-between rounded-md bg-white px-3 py-2 outline outline-1 outline-offset-[-1px] outline-slate-300 hover:bg-slate-50">
      <div className="flex items-center justify-start gap-2.5">
        <div className="justify-start text-sm font-normal text-zinc-950">
          Repository 불러오기
        </div>
      </div>
      <div className="flex flex-1 items-center justify-end gap-2.5">
        <ChevronDown className="h-4 w-4 opacity-50" />
      </div>
    </div>
  </div>
)
