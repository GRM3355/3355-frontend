import BottomSheet from '@/components/common/BottomSheet';
import FestivalListBottomSheet from '@/components/main/FestivalListBottomSheet';
import MyMap from '@/components/main/MyMap'
import MyMapWithProvinces from '@/components/main/MyMapWithProvinces';
import RoomItem from '@/components/room/RoomItem';
import { useState } from 'react';

export default function HomePage() {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState<boolean>(false);

  const handleShowBottomSheet = () => {
    setIsBottomSheetOpen(true);
  }

  return (
    <>
      <MyMap onShowBottomSheet={handleShowBottomSheet} />
      {/* <MyMapWithProvinces /> */}
      <FestivalListBottomSheet
        isBottomSheetOpen={isBottomSheetOpen}
        setIsBottomSheetOpen={setIsBottomSheetOpen} />
    </>
  )
}
