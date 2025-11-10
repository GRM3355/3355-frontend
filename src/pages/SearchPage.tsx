import Input from '@/components/common/Input';
import Header from '@/components/layout/Header';
import { useGetSearch } from '@/hooks/useSearch';
import type { Festival } from '@/types';
import type { FestivalAPI } from '@/types/api';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDebounce } from 'use-debounce';
import { Search } from "@mynaui/icons-react";

export default function SearchPage() {
  const [page, setPage] = useState<number>(1);
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [keyword, setKeyword] = useState<string>("");
  const [debouncedKeyword] = useDebounce(keyword, 1000);

  const [activeTab, setActiveTab] = useState<string>("전체");

  const tabs = ["전체", "페스티벌", "채팅방"];

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

  return (
    <>
      <div className='flex flex-col h-full'>
        {/* 검색 */}
        <div className='flex p-4 gap-2'>
          <span>&lt;</span>
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
        <div className="flex gap-4 py-2">
          {tabs.map((tab) => (
            <span
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`cursor-pointer text-lg transition-colors 
            ${activeTab === tab ? "text-blue-500 font-semibold" : "text-gray-700 hover:text-blue-400"}
          `}
            >
              {tab}
            </span>
          ))}
        </div>
        {/* 검색 결과 */}
        {keyword == "" ? (
          <div className='flex w-full h-full items-center justify-center'>
            <p>검색 결과가 없습니다</p>
          </div>
        ) : (
          <div className='w-full h-full overflow-y-scroll'>
            <p>페스티벌{data?.festivals.data.length}</p>
            {data?.festivals.data.map((festival: FestivalAPI) => (
              <div key={festival.festivalId} className='border p-2 my-2'>
                <h2>{festival.title}</h2>
              </div>
            ))}
            <p className='border'>더보기</p>
          </div>)
        }
      </div>
    </>

  )
}
