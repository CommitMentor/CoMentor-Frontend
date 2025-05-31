import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/header/header'
import { MSWComponent } from '@/api/MSWComponent'
import ReactQueryProvider from '@/providers/ReactQueryClient'

import GlobalModal from '@/components/Modal/GlobalModal'
import {
  AutoRefreshToken,
  FCMInitializer,
  UserActivityTracker,
} from '@/components/Setting'

export const metadata: Metadata = {
  title: 'CoMentor',
  description: 'Github 커밋 기반 맞춤 CS 질문 추천 서비스',
}

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <html lang="en">
      <body className="flex h-dvh flex-col antialiased">
        {process.env.NEXT_PUBLIC_MSW === 'enable' ? (
          <MSWComponent>
            <ReactQueryProvider>
              <AutoRefreshToken />
              <FCMInitializer />
              <UserActivityTracker />

              <GlobalModal />
              <header className="mx-[60px]">
                <Header />
              </header>

              {children}
            </ReactQueryProvider>
          </MSWComponent>
        ) : (
          <ReactQueryProvider>
            <AutoRefreshToken />
            <FCMInitializer />
            <UserActivityTracker />

            <GlobalModal />
            <header className="mx-[60px]">
              <Header />
            </header>

            {children}
          </ReactQueryProvider>
        )}
      </body>
    </html>
  )
}

export default RootLayout
