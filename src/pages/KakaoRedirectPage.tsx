// import { useEffect } from "react";
// import { useSearchParams } from "react-router-dom";

// export default function KakaoRedirectPage() {
//   const [searchParams] = useSearchParams();
//   const accessToken = searchParams.get("accessToken");

//   useEffect(() => {
//     if (!accessToken) {
//       console.error("accessToken 없음");
//       return;
//     }

//     console.log("카카오 로그인 완료, accessToken:", accessToken);

//     // 저장
//     localStorage.setItem("accessToken", accessToken);

//     // 메인 페이지로 이동 (히스토리 제거)
//     window.location.replace("/");
//   }, [accessToken]);

//   return <p>로그인 처리 중...</p>;
// }

import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function KakaoRedirectPage() {
  const [searchParams] = useSearchParams();
  const accessToken = searchParams.get("accessToken");

  useEffect(() => {
    const code = searchParams.get("code");
    console.log("code", code);
    if (!code) return;

    fetch("/api/auth/oauth2", {
      method: "POST",
      body: JSON.stringify({ provider: "KAKAO", code }),
      headers: { "Content-Type": "application/json" },
    })
      .then(res => res.json())
      .then(data => {
        localStorage.setItem("accessToken", data.data.accessToken);
        window.location.replace("/");
      })
  }, [searchParams]);

  return <p>로그인 처리 중...</p>;

}

