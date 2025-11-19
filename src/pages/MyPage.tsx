import Header from '@/components/layout/Header'
import React, { useEffect, useState } from "react";
import axios from "axios";
import apiClient from "@/api/apiClient";
import useLoginStore from '@/stores/useLoginStore';
import useAuthStore from '@/stores/useAuthStore';
import { useGetUserInfo } from '@/hooks/useUser';
import { useNavigate } from 'react-router-dom';
import { useConfirmStore } from '@/stores/useConfirmStore';

type UserInfo = {
  userId: number;
  profileNickName: string;
  accountEmail: string;
  profileImage: string;
  createdAt: string;
};

const MyPage = () => {
  // const [user, setUser] = useState<UserInfo | null>(null);
  // const [loading, setLoading] = useState<boolean>(false);
  // const { openLoginModal } = useLoginStore();

  const navigate = useNavigate();
  const { accessToken, logout } = useAuthStore();
  const { openConfirm, closeConfirm } = useConfirmStore();
  const { data } = useGetUserInfo(accessToken);
  const { closeLoginModal } = useLoginStore();


  const handleDeleteAccount = async () => {
    const accessToken = localStorage.getItem("accessToken");

    const reason = "추후 추가할 수 있으면 추가. 탈퇴 사유";
    const response = await apiClient.post("/api/v1/user/me/quit",
      { reason },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true
      }
    );

    if (response.status === 204) {
      logout();
      closeConfirm();
      navigate('/', { replace: true });
    }
  }

  const handleLogout = async () => {

    if (!accessToken) return;

    const response = await apiClient.post("/api/auth/logout",
      {}, // POST 바디가 없어도 빈 객체
      {
        headers: {
          Authorization: `Bearer ${accessToken}`, // 여기에 토큰 추가
        },
        withCredentials: true, // 쿠키 전달을 위해 필수
      }
    );

    if (response.status === 204) {
      logout();
      closeConfirm();
      // alert("로그아웃 되었습니다.");
    }

    // 메인 페이지로 이동
    navigate('/', { replace: true });
  }

  //TODO 리턴 빈 페이지
  if (!accessToken || !data) return (
    <>
      <p>로그인이 필요한 서비스입니다</p>
    </>
  )

  return (
    <>
      <Header showBack={true} title="계정안내"></Header>
      <div className='flex flex-col p-4 h-full pb-20'>
        <div className='flex-1'>
          <p className='title4-sb text-text-brand'>나의 정보</p>
          <p>{data.accountEmail}</p>
          <p>가입일: {data.createdAt.split('T')[0]}</p>
          <hr />
          <p className='title4-sb text-text-brand'>약관 및 정책</p>
          <div className='flex'>
            <span className='flex-1'>서비스 이용약관</span>
            <span className='px-4'>&gt;</span>
          </div>
        </div>
        <div className='flex gap-4'>
          <span onClick={() => openConfirm('탈퇴하시겠어요?',
            `탈퇴하기 버튼을 누르면
            탈퇴 처리됩니다.`,
            handleDeleteAccount, undefined, '탈퇴하기', '취소')}>탈퇴하기</span>
          <span onClick={() => openConfirm('로그아웃 안내',
            '로그아웃 하시겠어요?', handleLogout, undefined, '로그아웃', '취소')}>로그아웃</span>
        </div>
      </div>

      {/* <div style={{ padding: "20px" }}>
        <h1>내 정보 보기</h1>

        {loading && <p>로딩중...</p>}

        {data ? (
          <div>
            <p>아이디: {data.userId}</p>
            <p>닉네임: {data.profileNickName}</p>
            <p>이메일: </p>
            <p>프로필 이미지: {data.profileImage}</p> 
            <p>등록일: {data.createdAt}</p>
          </div>
        ) : (
          <p>로그인이 필요합니다.</p>
        )}
      </div> */}
    </>

  );
};

export default MyPage;
