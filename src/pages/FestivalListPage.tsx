import { useGetFestivals } from '@/hooks/useFestival';
import { getFestivals } from '@/api/festival';
import FestivalItem from '@/components/festival/FestivalItem';
import type { Festival } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import type { FestivalAPI } from '@/types/api';

export const REGIONS = [
  { code: "SEOUL", name: "서울" },
  { code: "GYEONGGI", name: "경기/인천" },
  { code: "CHUNGCHEONG", name: "충청/대전/세종" },
  { code: "GANGWON", name: "강원" },
  { code: "GYEONGBUK", name: "경북/대구/울산" },
  { code: "GYEONGNAM", name: "경남/부산" },
  { code: "JEOLLA", name: "전라/광주" },
  { code: "JEJU", name: "제주" },
]


export default function FestivalListPage() {
  const { data, isLoading, isError } = useGetFestivals();
  const [selectedRegion, setSelectedRegion] = useState<string>('SEOUL');

  const handleSelectRegion = (region: string) => {
    setSelectedRegion(region);
  };

  const filteredFestivals = data?.content.filter(
    (f) => f.region == selectedRegion
  );

  if (isLoading) return <p>로딩 중...</p>;
  if (isError) return <p>에러 발생!</p>;



  return (
    <>
      <Header showLogo={true} showUser={true} showSearch={true} />
      <div className='flex flex-col h-full '>
        {/* 지역 필터링 */}
        {/* <div className='flex flex-wrap gap-4 p-4 border-b shrink-0'>
        {visibleRegions.map((region) => (
          <span key={region}>{region}</span>
        ))}
        <span onClick={() => setShowRegions(!showRegions)}>더보기</span>
      </div> */}
        <div className='flex gap-4 p-4 overflow-x-auto whitespace-nowrap scrollbar-hide'>
          {REGIONS.map((region) => (
            <span key={region.code}
              className={`p-2 cursor-pointer 
                ${selectedRegion === region.code ? "text-blue-500 border-b border-blue-500" : "text-black"}`}
              onClick={() => handleSelectRegion(region.code)}>
              {region.name}</span>
          ))}
        </div>

        {/* 정렬 */}
        <div className='flex gap-4 items-center justify-between p-4'>
          <p>진행/예정 페스티벌({data?.content.length ?? 0})</p>
          <select>
            <option value='someOption'>개최순</option>
            <option value='otherOption'>가나다순</option>
          </select>
        </div>

        {/* 진행중인 페스티벌 */}
        <div className='flex flex-col h-full gap-2 overflow-y-auto p-4'>
          {filteredFestivals?.map((festival: FestivalAPI) => (
            <FestivalItem key={festival.festivalId} festivalData={festival} />
          ))}
        </div>
      </div>
    </>
  )
}
