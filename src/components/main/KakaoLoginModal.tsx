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

type KakaoLoginModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const KAKAO_API_KEY = import.meta.env.VITE_KAKAO_API_KEY;
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;
const RETURN_URI = "https://www.zony.kro.kr/kakao-redirect";

export default function KakaoLoginModal({ isOpen, onClose }: KakaoLoginModalProps) {

  const handleClickLogin = () => {
    console.log("REDIRECT_URI", REDIRECT_URI);
    console.log("RETURN_URI", RETURN_URI);


    const kakaoAuthUrl =
      `https://kauth.kakao.com/oauth/authorize` +
      `?client_id=${KAKAO_API_KEY}` +
      `&redirect_uri=${REDIRECT_URI}` +
      `&response_type=code` +
      `&state=${encodeURIComponent(RETURN_URI)}`;

    window.location.href = kakaoAuthUrl;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="w-full h-max p-5 m-10 rounded-2xl bg-surface-bg-modal-sheet"
    >
      <div className="flex flex-col items-center gap-4">
        <h2 className="text-xl font-bold">카카오 로그인</h2>
        <button
          onClick={handleClickLogin}
          className="px-6 py-3 bg-yellow-400 text-gray-800 rounded-lg hover:bg-yellow-500 transition-colors font-semibold"
        >
          카카오로 시작하기
        </button>
      </div>
    </Modal>
  );
}