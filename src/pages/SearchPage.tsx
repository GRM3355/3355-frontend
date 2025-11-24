import Input from '@/components/common/Input';
import { useGetSearch, useGetSearchFestivals, useGetSearchRooms } from '@/hooks/useSearch';
import type { FestivalAPI, RoomAPI } from '@/types/api';
import React, { useEffect, useState } from 'react'
import { useDebounce } from 'use-debounce';
import { ArrowLeft, ChevronLeft, ChevronRight, Search } from "@mynaui/icons-react";
import Tab from '@/components/common/Tab';
import { useNavigate } from 'react-router-dom';
import FestivalItem from '@/components/festival/FestivalItem';
import RoomItem from '@/components/room/RoomItem';
import AD from '@/components/common/AD';

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

  //const { data, isLoading, isError, refetch, isFetching } = useGetSearch({ keyword: debouncedKeyword });

  const { data: festivals, refetch: refetchFestivals } = useGetSearchFestivals({ keyword: debouncedKeyword });
  const { data: rooms, refetch: refetchRooms } = useGetSearchRooms({ keyword: debouncedKeyword });


  useEffect(() => {
    if (debouncedKeyword.trim()) {
      refetchFestivals();
      refetchRooms();
      console.log("검색 결과", { festivals, rooms })
    }
  }, [debouncedKeyword, refetchFestivals, refetchRooms]);

  const handleClickBack = () => {
    navigate(-1);
  }

  // const festivals = data?.festivals;
  // const rooms = data?.chatRooms;

  const searchResultCount = (festivals?.length ?? 0) + (rooms?.length ?? 0);
  return (
    <>
      <div className='flex flex-col h-full'>
        {/* 검색 */}
        <div className='flex py-[7px] pl-2 pr-4 gap-1 items-center'>
          <ChevronLeft size={40} className='p-1'
            onClick={() => handleClickBack()} />
          <Input
            type="text"
            placeholder="검색어를 입력해주세요."
            value={keyword}
            onChange={(e: any) => setKeyword(e.target.value)}
            icon={<Search size={20} stroke={1.25} />}
            defaultStyle="input-search-default"
            focusStyle="input-search-focus"
            completeStyle="input-search-complete"
            showClear={true}
            onClear={() => setKeyword('')}
          />
        </div>
        {(keyword == "" || searchResultCount == 0) && <AD />}

        {/* 검색 결과 */}
        {(debouncedKeyword === "" || (!festivals && !rooms)) ? (
          <div className="flex flex-col w-full h-full items-center justify-center gap-4">
            <img src="/empty/search-guide.svg" alt="" />
            <p className="text-text-primary body1-r">검색어를 입력해주세요.</p>
          </div>
        ) : searchResultCount === 0 ? (
          <div className="flex flex-col w-full h-full items-center justify-center gap-4">
            <img src="/empty/search.svg" alt="" />
            <p className="text-text-primary body1-r">검색결과가 없어요!</p>
          </div>
        ) : (
          <>
            <Tab
              items={FILTER}
              selected={activeTab}
              onSelect={setActiveTab}
            />
            <div className='w-full h-full overflow-y-scroll p-4 py-[26px] scrollbar-hide'>
              {activeTab === "ALL" && (
                <div className='flex gap-2 pb-5 items-center'>
                  <span className='title3-sb text-text-primary'>검색 결과</span>
                  <span className='label5-r text-text-tertiary'>
                    {(festivals?.length ?? 0) + (rooms?.length ?? 0)}</span>
                </div>
              )}
              {/* 페스티벌 섹션 */}
              {(activeTab === "ALL" || activeTab === "FESTIVAL") && (
                <>
                  <div className='flex gap-2 pb-4 items-center'>
                    <span className='title1-sb text-text-primary'>{activeTab === "ALL" ? "페스티벌" : "검색 결과"}</span>
                    <span className='label2-r text-text-tertiary'>{festivals?.length}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-2.5 gap-y-5">
                    {(activeTab === "ALL"
                      ? festivals?.slice(0, 4)
                      : festivals
                    )?.map((festival: FestivalAPI) => (
                      <FestivalItem key={festival.festivalId} festivalData={festival} />
                    ))}
                  </div>

                  {(activeTab === "ALL" && festivals && festivals.length > 4) && (
                    <div className='flex w-full items-center justify-center gap-1 label1-sb text-text-primary pt-3'
                      onClick={() => setActiveTab("FESTIVAL")}>
                      <span>더보기</span>
                      <ChevronRight size={20} />
                    </div>
                  )}
                </>
              )}
              {activeTab === "ALL" && <div className=' pb-8'></div>}
              {/* 채팅방 섹션 */}
              {(activeTab === "ALL" || activeTab === "CHATROOM") && (
                <>
                  <div className='flex gap-2 pb-4 items-center'>
                    <span className='title1-sb text-text-primary'>{activeTab === "ALL" ? "채팅방" : "검색 결과"}</span>
                    <span className='label2-r text-text-tertiary'>{rooms?.length}</span>
                  </div>
                  <div className='flex flex-col gap-2'>
                    {(activeTab === "ALL"
                      ? rooms?.slice(0, 3)
                      : rooms
                    )?.map((room: RoomAPI) => (
                      <RoomItem key={room.chatRoomId} room={room} showDetail={true} isJoined={false} />
                    ))}
                  </div>
                  {(activeTab === "ALL" && rooms && rooms?.length > 4) && (
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
