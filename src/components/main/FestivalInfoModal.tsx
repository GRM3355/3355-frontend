import type { Festival } from '@/types';
import Modal from '../common/Modal'
import type { FestivalAPI } from '@/types/api';
import { X } from '@mynaui/icons-react';

type FestivalInfoModalProps = {
  festivalData?: FestivalAPI;
  isOpen: boolean;
  onClose: () => void;
}

export default function FestivalInfoModal({
  festivalData, isOpen, onClose }: FestivalInfoModalProps) {

  if (!festivalData) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}
      className='w-full h-max p-5 m-10 rounded-2xl bg-surface-bg-modal-sheet'>
      <div className='flex justify-between'>
        <p className='title2-sb text-text-primary'>{festivalData.title}</p>
        <X size={24} className='text-icon-border-primary'
          onClick={() => onClose()} />
      </div>
      {/* <img src='/testImg.png' alt='Festival Image'></img> */}
      <img src={festivalData.firstImage} alt='Festival Image'
        className='w-full h-max py-2'></img>
      <p className='body1-r text-text-secondary'>날짜: {festivalData.eventStartDate} - {festivalData.eventEndDate}</p>
      <p className='body1-r text-text-secondary'>주소: {festivalData.addr1}</p>
    </Modal>
  )
}
