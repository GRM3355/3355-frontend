import { useGetFestivalCount, useGetFestivals, useGetFestivalsInfinite } from '@/hooks/useFestival';
import FestivalItem from '@/components/festival/FestivalItem';
import type { Festival } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import type { FestivalAPI } from '@/types/api';
import Tab from '@/components/common/Tab';
import Select from '@/components/common/Select';

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
  const {
    data,
    isFetching,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useGetFestivalsInfinite({ region });

  const festivals = data?.pages.flatMap(page => page.content) ?? [];

  //무한 스크롤 감지
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 50 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  //현재 지역 페스티벌 개수
  const { data: festivalCount } = useGetFestivalCount({ region });

  // const {
  //   data: festivalCount,
  //   isLoading: isFestivalCountLoading,
  //   isError: isFestivalCountError,
  // } = useGetFestivalCount({ region });


  // if (isFestivalInfoLoading || isFestivalCountLoading) return <p>로딩 중...</p>;
  // if (isFestivalInfoError || isFestivalCountError) return <p>에러 발생!</p>;

  // console.log(festivalCount);

  if (!data) return <></>

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

        {/* 정렬 */}
        <div className='flex gap-1 items-center justify-between p-4'>
          <span className='title1-sb text-text-primary'>진행/예정 페스티벌</span>
          <span className='flex-1 label2-r text-text-tertiary'>{festivalCount.count ?? 0}</span>
          {/* <Select
            items={FILTER}
            selected={filter}
            onSelect={setFilter}
          /> */}
        </div>

        {/* 진행중인 페스티벌 */}
        <div className='flex flex-col h-full gap-2 overflow-y-auto p-4 scrollbar-hide pb-16'
          onScroll={handleScroll}>
          {/* > */}

          {festivals?.map((festival: FestivalAPI, i) => (
            <FestivalItem key={`${i}-${festival.festivalId}`} festivalData={festival} />
          ))}
        </div>
      </div>
    </>
  )
}
