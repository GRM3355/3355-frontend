import Modal from '../common/Modal'
import DaumPostcodeEmbed from 'react-daum-postcode'

type PostcodeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelectAddress: (address: string) => void;
}

export default function PostcodeModal({
  isOpen,
  onClose,
  onSelectAddress
}: PostcodeModalProps) {

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <DaumPostcodeEmbed
        onComplete={(data) => {
          onSelectAddress(data.address);
          onClose();
        }}
      />
    </Modal>
  );
}
