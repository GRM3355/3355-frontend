import Lottie from 'lottie-react'
import { useEffect, useState } from 'react'

export default function LoadingSpinner() {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    fetch('/loading.json')
      .then(res => res.json())
      .then(data => setAnimationData(data));
  }, []);

  if (!animationData) return null;

  return (
    <>
      <div className="flex flex-col items-center justify-center w-full h-full gap-4">
        <Lottie
          animationData={animationData} // JSON 파일 경로
          loop={true} // 반복 재생
          autoplay={true} // 자동 재생
        />
        <p className='body1-r'>Loading...</p>
      </div>
    </>
  )
}
