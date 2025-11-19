import AD from "@/components/common/AD";
import Header from "@/components/layout/Header";
import RoomItem from "@/components/room/RoomItem";
import { useGetRoomsByToken } from "@/hooks/useRoom";
import useAuthStore from "@/stores/useAuthStore";
import type { ChatRoomAPI, RoomAPI } from "@/types/api";
import { useEffect } from "react";
// import type { ChatRoom } from "@/types";
import { useParams } from "react-router-dom";


export default function MyChatPage() {
  const { accessToken } = useAuthStore();
  const { data, isLoading, isError, refetch } = useGetRoomsByToken({ token: accessToken });

  useEffect(() => {
    refetch();
  }, []);

  return (
    <>
      <Header showLogo={true} showUser={true} showSearch={true} />
      <AD />
      {/* <div className="flex w-full h-full items-center justify-center pb-32">
        <p>현재 참여중인 방이 없습니다.</p>
      </div> */}
      <div className="p-4">
        <div className="flex gap-1 items-center pb-4">
          <span className="title3-sb text-text-primary">현재 참여중인 채팅방</span>
          <span className="label5-r text-text-tertiary">6</span>
        </div>
        {/* <div className="flex flex-col gap-2">
          {testRooms.map(room => (
            <RoomItem room={room} showDetail={true} />
          ))}
        </div> */}
        <div className="flex flex-col gap-2">
          {data?.content.map(room => (
            <RoomItem room={room} showDetail={true} />
          ))}
        </div>
      </div>
    </>
  )
}
