import type { Festival } from '@/types';
import Modal from '../common/Modal'

type FestivalInfoModalProps = {
  festivalData?: Festival;
  isOpen: boolean;
  onClose: () => void;
}

export default function FestivalInfoModal({
  festivalData, isOpen, onClose }: FestivalInfoModalProps) {

  if (!festivalData) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}
      className='p-6 rounded-2xl'>
      <p>{festivalData.name}</p>
      {/* <img src='/testImg.png' alt='Festival Image'></img> */}
      <img src={festivalData.mainImage} alt='Festival Image'></img>
      <p>날짜: {festivalData.date}</p>
      <p>주소: {festivalData.address}</p>
    </Modal>
  )
}
