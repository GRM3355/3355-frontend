import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '@/stores/useAuthStore';


export default function KakaoRedirectPage() {
  const navigate = useNavigate();
  const [handled, setHandled] = useState(false);

  useEffect(() => {
    if (handled) return; // 이미 처리됨

    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('accessToken');

    if (accessToken) {
      // 토큰 저장
      localStorage.setItem('accessToken', accessToken);

      // Zustand store 업데이트
      //useAuthStore.getState().setToken(accessToken);

      console.log('로그인 성공!');

      // query 제거 후 이동
      //navigate('/');
      navigate('/', { replace: true }); // replace: true → 히스토리 스택에 남지 않음
      window.history.replaceState({}, document.title, '/');

    } else {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p>로그인 처리 중...</p>
    </div>
  );
}
