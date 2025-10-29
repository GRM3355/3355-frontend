import BottomSheet from '@/components/common/BottomSheet';
import MyMap from '@/components/main/MyMap'
import { useState } from 'react';

export default function HomePage() {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState<boolean>(false);

  const handleShowBottomSheet = () => {
    setIsBottomSheetOpen(true);
  }

  return (
    <>
      <MyMap onShowBottomSheet={handleShowBottomSheet} />
      <BottomSheet
        isOpen={isBottomSheetOpen}
        onClose={() => setIsBottomSheetOpen(false)}
      >
        <p>ㄹㅇㄴㄹㄴㅇㄹ</p>
      </BottomSheet>
    </>
  )
}
