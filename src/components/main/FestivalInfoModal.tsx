import Modal from '../common/Modal'

type FestivalInfoModalProps = {
  isOpen: boolean;
  onClose: () => void;
}

export default function FestivalInfoModal({ isOpen, onClose }: FestivalInfoModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}
      className='p-6 rounded-2xl'>
      <p>코엑스 페스티벌</p>
      <img src='/testImg.png' alt='Festival Image'></img>
      <p>날짜: 00.00.00 ~ 00.00.00</p>
      <p>주소: OO도 OO시 OO구 도로명 건물번호 상세주소</p>
    </Modal>
  )
}
