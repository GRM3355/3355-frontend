import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useKakaoLogin } from "@/hooks/useUser";

export default function KakaoRedirectPage() {
  const [searchParams] = useSearchParams();
  // const code = new URLSearchParams(window.location.search).get("code");
  const accessToken = new URLSearchParams(window.location.search).get("accessToken");


  const navigate = useNavigate();
  // const { mutate } = useKakaoLogin();

  useEffect(() => {
    if (!accessToken) return;

    console.log("accessToken", accessToken)
    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
      window.location.href = "/";
    }
  }, [accessToken]);

  return <p>로그인 처리 중...</p>;
}
