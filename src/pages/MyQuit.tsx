import Header from '@/components/layout/Header'
import React, { useEffect, useState } from "react";
import axios from "axios";
import apiClient from "@/api/apiClient";

const API_ME_URL = "/api/v1/user/me";
const API_QUIT_URL = "/api/v1/user/me/quit";

type UserInfo = {
  userId: number;
  profileNickName: string;
  accountEmail: string;
  profileImage: string;
  createdAt: string;
};

const UserQuitPage = () => {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserInfo | null>(null);

  //----------------------------------------------
  // 1. 로그인 여부 체크
  //----------------------------------------------
  useEffect(() => {
    const checkLogin = async () => {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        alert("로그인이 필요한 페이지입니다.");
        window.location.href = "/";
        return;
      }

      try {
        const response = await apiClient.get(API_ME_URL, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        });

        setUser(response.data.data); // user 정보 저장
      } catch (error) {
        console.error("인증 실패:", error);
        alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
        localStorage.removeItem("accessToken");
        window.location.href = "/";
      } finally {
        setLoading(false);
      }
    };

    checkLogin();
  }, []);

  //----------------------------------------------
  // 2. 탈퇴 요청
  //----------------------------------------------
  const handleQuit = async () => {
    if (!reason.trim()) {
      alert("탈퇴 사유를 입력해주세요.");
      return;
    }

    if (!window.confirm("정말로 회원탈퇴 하시겠습니까?")) return;

    try {
      const accessToken = localStorage.getItem("accessToken");

      const response = await apiClient.post(
        API_QUIT_URL,
        { reason }, 
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true
        }
      );

      if (response.status === 204) {
        alert("회원탈퇴가 완료되었습니다.");

        // 클라이언트 토큰 제거
        localStorage.removeItem("accessToken");

        window.location.href = "/";
      }
    } catch (error) {
      console.error("회원탈퇴 실패:", error);
      alert("탈퇴 처리 중 오류가 발생했습니다.");
    }
  };

  //----------------------------------------------
  // 3. 로딩 중 화면
  //----------------------------------------------
  if (loading) return <div>로딩중...</div>;

  return (
    <div style={{ padding: "20px", maxWidth: "500px" }}>
      <h2>회원탈퇴</h2>
      <p>안녕하세요, {user?.profileNickName} 님</p>

      <label>탈퇴 사유</label>
      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="탈퇴 사유를 입력해주세요"/>

      <button
        onClick={handleQuit}>
        회원탈퇴
      </button>
    </div>
  );
};

export default UserQuitPage;