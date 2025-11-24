// import React from 'react'
// import Modal from '../common/Modal'


// type KakaoLoginModalProps = {
//   isOpen: boolean;
//   onClose: () => void;
// }

// const KAKAO_API_KEY = import.meta.env.VITE_KAKAO_API_KEY;
// const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;
// const RETURN_URI = encodeURIComponent(import.meta.env.VITE_RETURN_URI);
// export default function KakaoLoginModal({ isOpen, onClose }: KakaoLoginModalProps) {
//   const kakaoLoginUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${KAKAO_API_KEY}&redirect_uri=${REDIRECT_URI}`;

//   const handleClickLogin = () => {
//     window.location.href = kakaoLoginUrl;
//   }

//   return (
//     <Modal isOpen={isOpen} onClose={onClose}
//       className='w-full h-max p-5 m-10 rounded-2xl bg-surface-bg-modal-sheet'>
//       <p onClick={() => handleClickLogin()}>로그인</p>
//     </Modal>
//   )

// }

import React from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { useNavigate } from 'react-router-dom';

type KakaoLoginModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const KAKAO_API_KEY = import.meta.env.VITE_KAKAO_API_KEY; //카카오 api 키
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;  //api 로그인 처리 url
const RETURN_URI = import.meta.env.VITE_RETURN_URI;   //프론트페이지로 되돌아올 url

export default function KakaoLoginModal({ isOpen, onClose }: KakaoLoginModalProps) {
  const navigate = useNavigate();

  const handleClickLogin = () => {
    console.log("REDIRECT_URI", REDIRECT_URI);
    console.log("RETURN_URI", RETURN_URI);

    const kakaoAuthUrl =
      `https://kauth.kakao.com/oauth/authorize` +
      `?client_id=${KAKAO_API_KEY}` +
      `&redirect_uri=${REDIRECT_URI}` +
      `&response_type=code` +
      '&prompt=login consent' +
      '&scope=account_email' +
      `&state=${encodeURIComponent(RETURN_URI)}`;

    window.location.href = kakaoAuthUrl;
  };

  const handleClose = () => {
    onClose();
    navigate('/');
  }
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="w-full h-max p-5 m-10 rounded-2xl bg-surface-bg-modal-sheet"
    >
      <div className="flex flex-col gap-1">
        <p className="title2-sb text-text-primary ">로그인</p>
        <p className='body1-r text-text-secondary mb-6'>로그인이 필요한 서비스입니다.</p>
        <div className='flex flex-col gap-2'>
          <div className='flex h-[38px] px-3 py-2 justify-center gap-2 w-full bg-yellow-300 rounded-2 '
            onClick={handleClickLogin}>
            <div className='flex text-text-primary gap-2.5 items-center'>
              <img src="/Kakao.svg" alt="" className='w-5 h-5' />
              <span>카카오 로그인</span>
            </div>
          </div>
          <Button onClick={() => handleClose()} className='h-[38px]'>다음에 하기</Button>
        </div>

      </div>
    </Modal>
  );
}