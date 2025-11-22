import Header from '@/components/layout/Header';
import Nav from '@/components/layout/Nav';
import FestivalInfoModal from '@/components/main/FestivalInfoModal';
import FestivalListBottomSheet from '@/components/main/FestivalListBottomSheet';
import MyMap from '@/components/main/MyMap'
import { useGetFestivalByLocation } from '@/hooks/useFestival';
import type { Festival } from '@/types';
import type { FestivalAPI } from '@/types/api';
import { useEffect, useState } from 'react';
import type { ViewState } from 'react-map-gl/mapbox';

export default function HomePage() {
  const [isShowBottomSheet, setShowBottomSheet] = useState<boolean>(false);
  const [isShowFestivalModal, setShowFestivalModal] = useState<boolean>(false);
  const [festivalData, setFestivalData] = useState<FestivalAPI>();

  //바텀시트 데이터 넘기는 용
  const handleSelectFestival = (data: FestivalAPI) => {
    setFestivalData(data);
  }

  //api 호출용 뷰포트 위치
  const [apiViewport, setApiViewport] = useState<ViewState>({
    latitude: 37.5666138,
    longitude: 126.9781934,
    zoom: 14,
  } as ViewState);

  const { data, isError, error, refetch } = useGetFestivalByLocation({
    pageSize: 50,
    lat: apiViewport.latitude,
    lon: apiViewport.longitude,
    radius: 100
  });

  useEffect(() => {
    if (!apiViewport) return; apiViewport
    console.log("apiViewport (현재 params):", {
      lat: apiViewport.latitude,
      lon: apiViewport.longitude
    });
  }, [apiViewport]);

  useEffect(() => {
    if (!data) return;
    console.log("API 응답 데이터:", data);
  }, [data]);

  if (isError) {
    console.error(error);
    return <p>에러 발생!!</p>
  }

  const handleShowBottomSheet = () => {

    setShowBottomSheet(!isShowBottomSheet);
  }
  const handleCloseBottomSheet = () => {
    if (isShowBottomSheet)
      setShowBottomSheet(false);
  }

  return (
    <>
      <Header showLogo={true} showUser={true} showSearch={true} />
      <div className='flex-1 w-full h-full relative overflow-hidden'>
        <MyMap data={data?.content}
          onShowBottomSheet={() => handleShowBottomSheet()}
          isShowBottomSheet={isShowBottomSheet}
          onCloseBottomSheet={() => handleCloseBottomSheet()}
          onSelectFestival={(data: FestivalAPI) => handleSelectFestival(data)}
          onSearchFestivalByLocation={(state: ViewState) => setApiViewport(state)} />
        {/* <MyMapWithProvinces /> */}

        <FestivalInfoModal
          festivalData={festivalData}
          isOpen={isShowFestivalModal}
          onClose={() => setShowFestivalModal(false)} />
      </div>
      <Nav />
      <FestivalListBottomSheet
        festivalData={festivalData}
        isShowBottomSheet={isShowBottomSheet}
        onHideBottomSheet={() => setShowBottomSheet(false)}
        onShowFestivalModal={() => setShowFestivalModal(true)} />
    </>
  )
}
