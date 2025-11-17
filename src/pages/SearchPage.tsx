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
            <div className='w-full h-full overflow-y-scroll p-4 scrollbar-hide'>
              {activeTab === "ALL" && (
                <div className='flex gap-1 pb-4 items-center'>
                  <span className='title3-sb text-text-primary'>검색 결과</span>
                  <span className='label5-r text-text-quaternary'>
                    {(data?.festivals.totalCount ?? 0) + (data?.chatRooms.totalCount ?? 0)}</span>
                </div>
              )}
              {/* 페스티벌 섹션 */}
              {(activeTab === "ALL" || activeTab === "FESTIVAL") && (
                <>
                  <div className='flex gap-2 pb-3 items-center'>
                    <span className='title1-sb text-text-primary'>{activeTab === "ALL" ? "페스티벌" : "검색 결과"}</span>
                    <span className='label2-r text-text-quaternary'>{data?.festivals.data.length}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {(activeTab === "ALL"
                      ? data?.festivals?.data?.slice(0, 4)
                      : data?.festivals?.data
                    )?.map((festival: FestivalAPI) => (
                      <FestivalItem key={festival.festivalId} festivalData={festival} />
                    ))}
                  </div>

                  {activeTab === "ALL" && (
                    <div className='flex w-full items-center justify-center gap-1 label1-sb text-text-primary pt-3 pb-8'
                      onClick={() => setActiveTab("FESTIVAL")}>
                      <span>더보기</span>
                      <ChevronRight size={20} />
                    </div>
                  )}
                </>
              )}

              {/* 채팅방 섹션 */}
              {(activeTab === "ALL" || activeTab === "CHATROOM") && (
                <>
                  <div className='flex gap-2 pb-3 items-center'>
                    <span className='title1-sb text-text-primary'>{activeTab === "ALL" ? "채팅방" : "검색 결과"}</span>
                    <span className='label2-r text-text-quaternary'>{data?.chatRooms.data.length}</span>
                  </div>
                  <div className='flex flex-col gap-2'>
                    {(activeTab === "ALL"
                      ? data?.chatRooms?.data?.slice(0, 3)
                      : data?.chatRooms?.data
                    )?.map((room: RoomAPI) => (
                      <RoomItem key={room.chatRoomId} room={room} showDetail={true} />
                    ))}
                  </div>

                  {activeTab === "ALL" && (
                    <div className='flex w-full items-center justify-center gap-1 label1-sb text-text-primary pt-3'
                      onClick={() => setActiveTab("CHATROOM")}>
                      <span>더보기</span>
                      <ChevronRight size={20} />
                    </div>
                  )}
                </>
              )}
            </div>
          </>
        )
        }
      </div>
    </>

  )
}
