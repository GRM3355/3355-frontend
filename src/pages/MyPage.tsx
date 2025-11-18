import Header from '@/components/layout/Header'
import React, { useEffect, useState } from "react";
import axios from "axios";
import apiClient from "@/api/apiClient";

type UserInfo = {
  userId: number;
  profileNickName: string;
  accountEmail: string;
  profileImage: string;
  createdAt: string;
};

const MyPage = () => {

  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchUser = async () => {

    try {
      setLoading(true);

      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
         alert("로그인이 필요한 페이지입니다.");
         window.location.href = "/login";
         return;
      }

      const response = await apiClient.get("/api/v1/user/me", {
         withCredentials: true, // refreshToken 쿠키 사용 시 필수
         headers: {
           Authorization: `Bearer ${accessToken}`, // 토큰 필요하면 포함
         }
       });

       setUser(response.data.data); // 타입이 이미 UserInfo | null 로 설정됨

    } catch (err) {
      console.error("내 정보 불러오기 오류", err);
    } finally {
      setLoading(false);
    }

  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>내 정보 보기</h1>

      {loading && <p>로딩중...</p>}

      {user ? (
        <div>
          <p>아이디: {user.userId}</p>
          <p>닉네임: {user.profileNickName}</p>
          <p>이메일: {user.accountEmail}</p>
          <p>프로필 이미지: {user.profileImage}</p>
          <p>등록일: {user.createdAt}</p>
        </div>
      ) : (
        <p>로그인이 필요합니다.</p>
      )}
    </div>
  );
};

export default MyPage;
