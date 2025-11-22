import Lottie from 'lottie-react'
import React from 'react'
import loadingAnimation from "@/../public/loading.json";

export default function LoadingSpinner() {
  return (
    <>
      <div className="flex flex-col items-center justify-center w-full h-full gap-4">
        <Lottie
          animationData={loadingAnimation} // JSON 파일 경로
          loop={true} // 반복 재생
          autoplay={true} // 자동 재생
        />
        <p className='body1-r'>Loading...</p>
      </div>
    </>
  )
}
