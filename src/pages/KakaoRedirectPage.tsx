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

// import { useEffect } from "react";
// import { useSearchParams } from "react-router-dom";

// export default function KakaoRedirectPage() {
//   const [searchParams] = useSearchParams();
//   const accessToken = searchParams.get("accessToken");

//   useEffect(() => {
//     const code = searchParams.get("code");
//     console.log("code", code);
//     if (!code) return;

//     fetch("/api/auth/oauth2", {
//       method: "POST",
//       body: JSON.stringify({ provider: "KAKAO", code }),
//       headers: { "Content-Type": "application/json" },
//     })
//       .then(res => res.json())
//       .then(data => {
//         localStorage.setItem("accessToken", data.data.accessToken);
//         window.location.replace("/");
//       })
//   }, [searchParams]);

//   return <p>로그인 처리 중...</p>;

// }

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '@/stores/useAuthStore';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import useLoginStore from '@/stores/useLoginStore';

export default function KakaoRedirectPage() {
  const navigate = useNavigate();
  const { setAccessToken } = useAuthStore();
  const { closeLoginModal } = useLoginStore();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('accessToken');

    if (accessToken) {
      console.log('로그인 성공!', accessToken);
      setAccessToken(accessToken); // store에 저장
      closeLoginModal();
    } else {
      console.log("로그인 실패! accessToken이 없습니다.");
      closeLoginModal();
    }

    navigate('/', { replace: true });
    // navigate(-3);
    // navigate('.', { replace: true });
  }, [navigate, setAccessToken]);

  return (
    <>
      <LoadingSpinner />
    </>
  );
}