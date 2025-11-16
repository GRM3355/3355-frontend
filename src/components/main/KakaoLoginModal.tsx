import React from 'react'
import Modal from '../common/Modal'


type KakaoLoginModalProps = {
  isOpen: boolean;
  onClose: () => void;
}

const KAKAO_API_KEY = import.meta.env.VITE_KAKAO_API_KEY;
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;

export default function KakaoLoginModal({ isOpen, onClose }: KakaoLoginModalProps) {
  const kakaoLoginUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${KAKAO_API_KEY}&redirect_uri=${REDIRECT_URI}`;

  const handleClickLogin = () => {
    window.location.href = kakaoLoginUrl;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}
      className='w-full h-max p-5 m-10 rounded-2xl bg-surface-bg-modal-sheet'>
      <p onClick={() => handleClickLogin()}>로그인</p>
    </Modal>
  )

}
