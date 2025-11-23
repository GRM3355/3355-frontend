import { useGetFestivalCount, useGetFestivalsInfinite } from '@/hooks/useFestival';
import React from 'react'
import FestivalItem from './FestivalItem';
import type { FestivalAPI } from '@/types/api';
import ErrorPage from '@/pages/ErrorPage';

type FestivalListSectionProps = {
  region: string;
}
export default function FestivalListSection({ region }: FestivalListSectionProps) {

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
  const { data: festivalCount, isError: isCountError } = useGetFestivalCount({ region });

  if (!data) return <></>

  return (
    <>
      {/* 정렬 */}
      <div className='flex gap-1 items-center justify-between pt-[13px] pb-2.5 px-4'>
        <span className='title1-sb text-text-primary '>진행/예정 페스티벌</span>
        <span className='flex-1 label2-r text-text-tertiary'>{festivalCount?.count ?? 0}</span>
      </div>
      {/* 진행중인 페스티벌 */}
      <div className='grid grid-cols-2 w-full h-full gap-x-[7px] gap-y-[11px]
      overflow-y-auto px-4 scrollbar-hide pb-16'
        onScroll={handleScroll}>
        {/* > */}
        {(festivals && festivals.length > 0) ? (festivals.map((festival: FestivalAPI, i) => (
          <FestivalItem key={`${i}-${festival.festivalId}`} festivalData={festival} />))
        ) : (
          <div className='col-span-2 flex flex-col w-full h-full items-center justify-center pb-16'>
            <p>현재 개최중인</p>
            <p>페스티벌이 없습니다.</p>
          </div>
        )}
      </div>
    </>
  )
}
