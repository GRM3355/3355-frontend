import FestivalInfoModal from '@/components/main/FestivalInfoModal';
import FestivalListBottomSheet from '@/components/main/FestivalListBottomSheet';
import MyMap from '@/components/main/MyMap'

import { useState } from 'react';

export default function HomePage() {
  const [isShowBottomSheet, setShowBottomSheet] = useState<boolean>(false);
  const [isShowFestivalModal, setShowFestivalModal] = useState<boolean>(false);

  return (
    <>
      <MyMap onShowBottomSheet={() => setShowBottomSheet(true)} />
      {/* <MyMapWithProvinces /> */}
      <FestivalListBottomSheet
        isShowBottomSheet={isShowBottomSheet}
        onHideBottomSheet={() => setShowBottomSheet(false)}
        onShowFestivalModal={() => setShowFestivalModal(true)} />
      <FestivalInfoModal isOpen={isShowFestivalModal}
        onClose={() => setShowFestivalModal(false)} />
    </>
  )
}
