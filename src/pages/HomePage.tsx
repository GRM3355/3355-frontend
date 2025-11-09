import Header from '@/components/layout/Header';
import FestivalInfoModal from '@/components/main/FestivalInfoModal';
import FestivalListBottomSheet from '@/components/main/FestivalListBottomSheet';
import MyMap from '@/components/main/MyMap'
import type { Festival } from '@/types';
import type { FestivalAPI } from '@/types/api';
import { useState } from 'react';

export default function HomePage() {
  const [isShowBottomSheet, setShowBottomSheet] = useState<boolean>(false);
  const [isShowFestivalModal, setShowFestivalModal] = useState<boolean>(false);
  const [festivalData, setFestivalData] = useState<FestivalAPI>();

  const handleSelectFestival = (data: FestivalAPI) => {
    setFestivalData(data);
  }

  return (
    <>
      <Header showLogo={true} showSearch={true} />
      <MyMap onShowBottomSheet={() => setShowBottomSheet(true)}
        onSelectFestival={(data: FestivalAPI) => handleSelectFestival(data)} />
      {/* <MyMapWithProvinces /> */}
      <FestivalListBottomSheet
        festivalData={festivalData}
        isShowBottomSheet={isShowBottomSheet}
        onHideBottomSheet={() => setShowBottomSheet(false)}
        onShowFestivalModal={() => setShowFestivalModal(true)} />
      <FestivalInfoModal
        festivalData={festivalData}
        isOpen={isShowFestivalModal}
        onClose={() => setShowFestivalModal(false)} />
    </>
  )
}
