import Button from './Button';
import Modal from './Modal';

type ConfirmModalProps = {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  onClose: () => void;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  onClose
}: ConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}
      className='w-full h-max p-5 m-10 rounded-4 bg-surface-bg-modal-sheet'>
      <h2 className='h-7 title2-sb text-text-primary'>{title}</h2>
      <p className='body1-r mb-6 text-text-secondary whitespace-pre-line'>{message}</p>
      <div className='flex gap-2'>
        <Button onClick={() => onCancel ? onCancel() : onClose?.()}>{cancelText}</Button>
        <Button onClick={() => onConfirm?.()} variant='brand'>{confirmText}</Button>
      </div>
    </Modal>
  );
}
