import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '@/stores/useAuthStore';
import axios from "axios"; 

const API_LOGOUT_URL = "/api/auth/logout"; // 백엔드 로그아웃 엔드포인트

const Logout = () => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      // 서버에 POST 요청
      // const response = await axios.post(
      //   API_LOGOUT_URL,
      //   {}, // POST 바디가 없어도 빈 객체
      //   {
      //     withCredentials: true, // 쿠키 전달을 위해 반드시 필요
      //   }
      // );

      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        alert("로그인이 필요한 페이지입니다.");
        window.location.href = "/";
        return;
      }

      const response = await axios.post(
        API_LOGOUT_URL,
        {}, // POST 바디가 없어도 빈 객체
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // 여기에 토큰 추가
          },
          withCredentials: true, // 쿠키 전달을 위해 필수
        }
      );

      if (response.status === 200) {
        localStorage.removeItem("accessToken");
        alert("로그아웃 되었습니다.");
      }

      // 메인 페이지로 이동
      navigate('/');

    } catch (error) {
      console.error("로그아웃 실패:", error);
      alert("로그아웃에 실패했습니다.");
    }
  };

  // ⬇️ 컴포넌트가 처음 렌더링될 때 자동 실행
  useEffect(() => {
    handleLogout();
  }, []); // 빈 배열 → 최초 1회 실행
  return null; // 화면에 안 보이게
};

export default Logout;