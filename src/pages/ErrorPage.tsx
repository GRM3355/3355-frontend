import Button from "@/components/common/Button";
import Header from "@/components/layout/Header";
import { useNavigate } from "react-router-dom";

export default function ErrorPage() {
  const navigate = useNavigate()

  return (
    <>
      <Header showLogo={true} showUser={true} showSearch={true} />
      <div className='flex-1 w-full h-full relative overflow-hidden'>
        <div className="w-full h-full flex flex-col items-center justify-center gap-4">
          <img src="/empty/error.svg" alt="" />
          <p>잠시 후 다시 시도해주세요</p>
          <Button className="w-22 h-12"
            onClick={() => navigate('/')}>메인으로</Button>
        </div>
      </div>
    </>
  )
}
