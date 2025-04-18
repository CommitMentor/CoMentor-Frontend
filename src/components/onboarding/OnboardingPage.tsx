'use client'

import Image from 'next/image'

const OnboardingPage = () => {
  const handleGithubLogin = () => {
    const env = process.env.VERCEL ? 'prod' : 'dev'

    const url = `${process.env.NEXT_PUBLIC_SOCIAL_LOGIN_GITHUB}?env=${env}`
    window.location.href = url
  }

  return (
    <div className="flex flex-col bg-white px-4 md:px-[60px]">
      {/* 그라데이션 배경 */}
      <div className="fixed bottom-0 left-0 z-0 h-[226px] w-full bg-gradient-to-b from-transparent to-slate-100" />

      {/* 메인 컨텐츠 */}
      <div className="relative z-10 flex w-full max-w-[1280px] flex-col items-center justify-center gap-[35px] py-8 md:py-12 lg:py-20">
        <div className="flex flex-col items-center gap-[17px] py-8 md:py-12 lg:py-20">
          <h1 className="w-full max-w-[928px] text-center text-4xl font-semibold tracking-wider text-slate-800 md:text-5xl md:leading-tight md:tracking-wider lg:text-[52px] lg:leading-[62.05px] lg:tracking-widest">
            GitHub 커밋 기반 맞춤 CS 면접 준비,
          </h1>

          <h2 className="w-full max-w-[928px] text-center text-4xl font-semibold tracking-wider text-slate-800 md:text-5xl md:leading-tight md:tracking-wider lg:text-[52px] lg:leading-[62.05px] lg:tracking-widest">
            CoMentor와 함께!
          </h2>
        </div>

        {/* 깃허브 연동 버튼 */}
        <button
          onClick={handleGithubLogin}
          className="flex h-[60px] w-full max-w-[420px] cursor-pointer items-center justify-center gap-[15px] rounded-[33px] bg-slate-800 px-[20px] py-[16px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] transition-colors hover:bg-slate-700 md:h-[65px] md:px-[25px] md:py-[18px] lg:h-[73px] lg:px-[31px] lg:py-[20px]"
        >
          <div className="relative h-5 w-5 md:h-[22px] md:w-[22px] lg:h-6 lg:w-6">
            <Image src="/images/Github.svg" alt="Github Icon" fill priority />
          </div>

          <span className="text-center text-lg font-medium text-slate-50 md:text-xl md:leading-[22px] lg:text-[24px] lg:leading-[24px]">
            Github 연동하기
          </span>
        </button>
      </div>
    </div>
  )
}

export default OnboardingPage
