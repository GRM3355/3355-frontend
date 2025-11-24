import Button from '@/components/common/Button'
import ConfirmModal from '@/components/common/ConfirmModal'
import Modal from '@/components/common/Modal'
import React from 'react'
import loadingAnimation from "@/../public/loading.json";
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function ComponentTestPage() {

  const handleModalClose = () => {

  }
  return (
    <>
      {/* <ConfirmModal
        isOpen={true}
        title='채팅방 개설 한도 초과'
        message='기존 채팅방으로 입장해 주세요.'
        cancelText='취소'
        confirmText='참여하기'
        onClose={() => handleModalClose()} /> */}
      {/* <div className='flex flex-col gap-2'>
        <Button variant='brand'>브랜드</Button>
        <Button className=''>기본</Button>
        <Button variant='error' className=''>에러</Button>
      </div > */}
      <LoadingSpinner />


    </>

  )
}
