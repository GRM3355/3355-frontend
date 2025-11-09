import type { Festival } from '@/types';
import Modal from '../common/Modal'
import type { FestivalAPI } from '@/types/api';

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
      className='p-6 rounded-2xl'>
      <p>{festivalData.title}</p>
      {/* <img src='/testImg.png' alt='Festival Image'></img> */}
      <img src={festivalData.firstImage} alt='Festival Image'></img>
      <p>날짜: {festivalData.eventStartDate} - {festivalData.eventEndDate}</p>
      <p>주소: {festivalData.addr1}</p>
    </Modal>
  )
}
