import Header from '@/components/layout/Header'
import React, { useEffect, useState } from "react";
import axios from "axios";
import apiClient from "@/api/apiClient";
import useLoginStore from '@/stores/useLoginStore';
import useAuthStore from '@/stores/useAuthStore';
import { useGetUserInfo } from '@/hooks/useUser';
import { useNavigate } from 'react-router-dom';
import { useConfirmStore } from '@/stores/useConfirmStore';
import { ChevronRight } from '@mynaui/icons-react';

const Terms = ['서비스 이용약관', '위치기반 서비스 이용약관', '개인정보 처리방침', '운영 정책'];

const MyPage = () => {
  const navigate = useNavigate();
  const { accessToken, logout } = useAuthStore();
  const { openConfirm, closeConfirm } = useConfirmStore();
  const { data, isError } = useGetUserInfo(accessToken);

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
      <div className='flex-1 w-full h-full relative overflow-hidden'>
        <div className='flex flex-col p-4 h-full pb-20'>
          <div className='flex-1'>
            <p className='title4-sb text-text-brand'>나의 정보</p>
            <p className='pt-3 title3-sb text-text-primary'>{data.accountEmail}</p>
            <p className='pb-4 caption2-r text-text-quaternary'>가입일: {data.createdAt.split('T')[0]}</p>
            <hr className='text-line-border-primary h-px pt-4' />
            <p className='title4-sb text-text-brand'>약관 및 정책</p>

            {/* 약관 */}
            <div>
              <div className='flex py-2'
                onClick={() => window.open('https://www.notion.so/goormkdx/2abc0ff4ce31803aafc4f96fbf7a346d?source=copy_link', '_blank')}>
                <span className='flex items-center flex-1 title3-sb text-text-primary'>서비스 이용약관</span>
                <ChevronRight size={40} className='p-2' />
              </div>
              <div className='flex py-2'
                onClick={() => window.open('https://www.notion.so/goormkdx/2a9c0ff4ce318059a59adbadb12899f5', '_blank')}>
                <span className='flex items-center flex-1 title3-sb text-text-primary'>위치기반 서비스 이용약관</span>
                <ChevronRight size={40} className='p-2' />
              </div>
              <div className='flex py-2'
                onClick={() => window.open('https://www.notion.so/goormkdx/2aec0ff4ce318015a81bec2158eec86d', '_blank')}>
                <span className='flex items-center flex-1 title3-sb text-text-primary'>개인정보 처리방침</span>
                <ChevronRight size={40} className='p-2' />
              </div>
              <div className='flex py-2'
                onClick={() => window.open('https://www.notion.so/goormkdx/Zony-2aac0ff4ce31803297c5c1ea7a9f6986?source=copy_link', '_blank')}>
                <span className='flex items-center flex-1 title3-sb text-text-primary'>운영 정책</span>
                <ChevronRight size={40} className='p-2' />
              </div>
            </div>
          </div>
          <div className='flex justify-center gap-4 text-text-quaternary'>
            <span onClick={() => openConfirm('탈퇴하시겠어요?',
              `탈퇴하기 버튼을 누르면
            탈퇴 처리됩니다.`,
              handleDeleteAccount, undefined, '탈퇴하기', '취소')}>탈퇴하기</span>
            <span onClick={() => openConfirm('로그아웃 안내',
              '로그아웃 하시겠어요?', handleLogout, undefined, '로그아웃', '취소')}>로그아웃</span>
          </div>
        </div>
      </div>
    </>

  );
};

export default MyPage;
