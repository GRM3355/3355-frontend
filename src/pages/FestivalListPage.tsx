import { useGetFestivalCount, useGetFestivals, useGetFestivalsInfinite } from '@/hooks/useFestival';
import FestivalItem from '@/components/festival/FestivalItem';
import type { Festival } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import type { FestivalAPI } from '@/types/api';
import Tab from '@/components/common/Tab';
import Select from '@/components/common/Select';
import FestivalListSection from '@/components/festival/FestivalListSection';

export const REGIONS = [
  { key: "SEOUL", label: "서울" },
  { key: "GYEONGGI", label: "경기/인천" },
  { key: "CHUNGCHEONG", label: "충청/대전/세종" },
  { key: "GANGWON", label: "강원" },
  { key: "GYEONGBUK", label: "경북/대구/울산" },
  { key: "GYEONGNAM", label: "경남/부산" },
  { key: "JEOLLA", label: "전라/광주" },
  { key: "JEJU", label: "제주" },
]

const FILTER = [
  { key: "DATE", label: "개최순" },
  { key: "ABC", label: "가나다순" },
]

export default function FestivalListPage() {
  const [region, setRegion] = useState<string>('SEOUL');
  const [filter, setFilter] = useState<string>('DATE');

  // const { data: festivalInfo,
  //   isLoading: isFestivalInfoLoading,
  //   isError: isFestivalInfoError } = useGetFestivals({ region });

  // const filteredFestivals = festivalInfo?.content.filter(
  //   (info) => info.region == region
  // );


  //페스티벌

  // const {
  //   data: festivalCount,
  //   isLoading: isFestivalCountLoading,
  //   isError: isFestivalCountError,
  // } = useGetFestivalCount({ region });


  // if (isFestivalInfoLoading || isFestivalCountLoading) return <p>로딩 중...</p>;
  // if (isFestivalInfoError || isFestivalCountError) return <p>에러 발생!</p>;

  // console.log(festivalCount);


  return (
    <>
      <Header showLogo={true} showUser={true} showSearch={true} />
      <div className='flex flex-col h-full '>
        {/* 지역 필터링 */}
        <Tab
          items={REGIONS}
          selected={region}
          onSelect={setRegion}
        />
        <FestivalListSection region={region} />

      </div>
    </>
  )
}
