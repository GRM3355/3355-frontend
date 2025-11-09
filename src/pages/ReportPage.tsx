import { useForm } from 'react-hook-form';
import type { ReportFormData } from '@/types/form';
import { useState } from 'react';
import PostcodeModal from '@/components/report/PostcodeModal';

export default function ReportPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<ReportFormData>();
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<string>('');

  const onSubmit = (data: ReportFormData) => {
    //TODO: 데이터 전송 api

  };

  return (
    <div className='max-w-md mx-auto mt-10 p-4'>
      <h1 className='text-xl font-bold mb-4'>제보하기</h1>
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>

        {/* 이름 입력 */}
        <div>
          <label className='block mb-1 font-semibold'>이름</label>
          <input
            {...register('name', { required: '이름을 입력해주세요' })}
            className='border p-2 w-full rounded'
            placeholder='축제 이름'
          />
          {errors.name && <p className='text-red-500 text-sm'>{errors.name.message}</p>}
        </div>


        {/* 주소 선택 */}
        <p>주소 선택</p>
        <input type='text' className='border p-2 w-full rounded'
          placeholder='주소'
          value={selectedAddress}
          readOnly
          onClick={() => setIsAddressModalOpen(true)} />
        <PostcodeModal
          isOpen={isAddressModalOpen}
          onClose={() => setIsAddressModalOpen(false)}
          onSelectAddress={setSelectedAddress} />
        {/* 기간 선택 */}

        {/* 제출 버튼 */}
        <button
          type='submit'
          className='bg-blue-500 text-white py-2 rounded hover:bg-blue-600'
        >
          제출하기
        </button>
      </form>
    </div>
  );
}
