import Header from '@/components/layout/Header'
import React, { useEffect, useState } from "react";
import axios from "axios";
import apiClient from "@/api/apiClient";
import useLoginStore from '@/stores/useLoginStore';
import useAuthStore from '@/stores/useAuthStore';
import { useGetUserInfo } from '@/hooks/useUser';

type UserInfo = {
  userId: number;
  profileNickName: string;
  accountEmail: string;
  profileImage: string;
  createdAt: string;
};

const MyPage = () => {
  // const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { accessToken } = useAuthStore();
  const { openLoginModal } = useLoginStore();

  const { data } = useGetUserInfo(accessToken);

  if (data)

    return (
      <div style={{ padding: "20px" }}>
        <h1>내 정보 보기</h1>

        {loading && <p>로딩중...</p>}

        {data ? (
          <div>
            <p>아이디: {data.userId}</p>
            <p>닉네임: {data.profileNickName}</p>
            <p>이메일: {data.accountEmail}</p>
            {/* <p>프로필 이미지: {data.profileImage}</p> */}
            <p>등록일: {data.createdAt}</p>
          </div>
        ) : (
          <p>로그인이 필요합니다.</p>
        )}
      </div>
    );
};

export default MyPage;
