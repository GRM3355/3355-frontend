import Input from '@/components/common/Input';
import Header from '@/components/layout/Header';
import { useGetSearch } from '@/hooks/useSearch';
import type { Festival } from '@/types';
import type { FestivalAPI, RoomAPI } from '@/types/api';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDebounce } from 'use-debounce';
import { ArrowLeft, ChevronLeft, ChevronRight, Search } from "@mynaui/icons-react";
import Tab from '@/components/common/Tab';
import { useNavigate } from 'react-router-dom';
import FestivalItem from '@/components/festival/FestivalItem';
import RoomItem from '@/components/room/RoomItem';

const FILTER = [
  { key: "ALL", label: "전체" },
  { key: "FESTIVAL", label: "페스티벌" },
  { key: "CHATROOM", label: "채팅방" },
]

export default function SearchPage() {
  const navigate = useNavigate();

  const [page, setPage] = useState<number>(1);
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [keyword, setKeyword] = useState<string>("");
  const [debouncedKeyword] = useDebounce(keyword, 1000);

  const [activeTab, setActiveTab] = useState<string>("ALL");

  const { data, isLoading, isError, refetch } = useGetSearch({ keyword: debouncedKeyword });

  useEffect(() => {
    if (debouncedKeyword.trim()) {
      console.log("검색");
      refetch();
    }
  }, [debouncedKeyword, refetch]);

  // const { data, isLoading, isError, error } = useQuery({
  //   queryKey: ['festivals', page],
  //   queryFn: async () => {
  //     const API_KEY = import.meta.env.VITE_PUBLIC_API_KEY;
  //     const res = await axios.get('/api/festival/searchFestival2', {
  //       params: {
  //         numOfRows: 6,
  //         pageNo: page,
  //         MobileOS: 'ETC',
  //         MobileApp: 'AppTest',
  //         serviceKey: API_KEY,
  //         eventStartDate: '20251101',
  //         _type: 'json',
  //       },
  //     });

  //     const items = res.data?.response?.body?.items?.item ?? [];

  //     console.log('Fetched festival data:', res.data.response.body.items);
  //     return items.map((item: any): Festival => ({
  //       id: String(item.contentid),
  //       name: item.title ?? '',
  //       longitude: parseFloat(item.mapx ?? 0),
  //       latitude: parseFloat(item.mapy ?? 0),
  //       mainImage: item.firstimage ?? '',
  //       date: item.eventstartdate
  //         ? `${item.eventstartdate} ~ ${item.eventenddate}`
  //         : '',
  //       address: item.addr1 ?? '',
  //       category: item.cat3 ?? '',
  //       region: item.areacode ?? '',
  //     }));
  //   },
  //   refetchOnWindowFocus: false, // 창 포커스 시 재호출 방지
  //   staleTime: 1000 * 60 * 2, // 2분간 캐시 유지
  //   gcTime: 1000 * 60 * 10, // 10분 후 가비지 컬렉션
  //   placeholderData: (prevData) => prevData, //이전 데이터 유지
  // });

  const handleClickBack = () => {
    navigate(-1);
  }

  const searchResultCount = (data?.festivals.totalCount ?? 0) + (data?.chatRooms.totalCount ?? 0);

  return (
    <>
      <div className='flex flex-col h-full'>
        {/* 검색 */}
        <div className='flex p-4 gap-2 items-center'>
          <ChevronLeft size={24}
            onClick={() => handleClickBack()} />
          {/* <InputSearch type="text" placeholder='검색어를 입력해주세요.'
            onChange={(e) => setKeyword(e.target.value)} /> */}
          <Input
            type="text"
            placeholder="검색어 입력"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            icon={<Search />}
            defaultStyle="input-search-default"
            focusStyle="input-search-focus"
            completeStyle="input-search-complete"
            showClear={true}
            onClear={() => setKeyword('')}
          />
        </div>
        {/* 검색 결과 */}
        {keyword == "" || searchResultCount == 0 ? (
          <div className='flex w-full h-full items-center justify-center'>
            <p className='text-text-primary'>검색결과가 없어요!</p>
          </div>
        ) : (
          <>
            <Tab
              items={FILTER}
              selected={activeTab}
              onSelect={setActiveTab}
            />
            <div className='w-full h-full overflow-y-scroll p-4'>
              <div className='flex gap-1 pb-4 items-center'>
                <span className='title3-sb text-text-primary'>검색결과</span>
                <span className='label5-r text-text-quaternary'>
                  {(data?.festivals.totalCount ?? 0) + (data?.chatRooms.totalCount ?? 0)}</span>
              </div>

              {/* 페스티벌 */}
              <div className='flex gap-2 pb-3 items-center'>
                <span className='title1-sb text-text-primary'>페스티벌</span>
                <span className='label2-r text-text-quaternary'>{data?.festivals.data.length}</span>
              </div>
              {data?.festivals?.data?.slice(0, 3).map((festival: FestivalAPI) => (
                <FestivalItem key={festival.festivalId} festivalData={festival} />
              ))}
              <div className='flex w-full items-center justify-center gap-1 label1-sb text-text-primary pt-3 pb-8'>
                <span>더보기</span>
                <ChevronRight size={20} />
              </div>

              {/*  채팅 */}
              <div className='flex gap-2 pb-3 items-center'>
                <span className='title1-sb text-text-primary'>채팅방</span>
                <span className='label2-r text-text-quaternary'>{data?.festivals.data.length}</span>
              </div>
              {data?.chatRooms?.data?.slice(0, 3).map((room: RoomAPI) => (
                <RoomItem key={room.chatRoomId} room={room} />
              ))}
              <div className='flex w-full items-center justify-center gap-1 label1-sb text-text-primary pt-3'>
                <span>더보기</span>
                <ChevronRight size={20} />
              </div>
            </div>
          </>
        )
        }
      </div>
    </>

  )
}
