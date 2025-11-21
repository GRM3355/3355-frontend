import AD from "@/components/common/AD";
import Header from "@/components/layout/Header";
import RoomItem from "@/components/room/RoomItem";
import { useCheckLogin } from "@/hooks/useCheckLogin";
import { useGetRoomsByToken } from "@/hooks/useRoom";
import { useGetUserInfo } from "@/hooks/useUser";
import useAuthStore from "@/stores/useAuthStore";
import useRoomStore from "@/stores/useRoomStore";
import type { ChatRoomAPI, RoomAPI } from "@/types/api";
import { useEffect } from "react";
// import type { ChatRoom } from "@/types";
import { useParams } from "react-router-dom";


export default function MyChatPage() {
  const { accessToken } = useAuthStore();
  const { data, isLoading, isError, refetch } = useGetRoomsByToken(accessToken);

  const { roomActivities, updateRoomActivity, getRoomActivity } = useRoomStore();
  const checkLogin = useCheckLogin();
  useEffect(() => {
    checkLogin();
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
          <span className="label5-r text-text-tertiary">{data?.content.length ?? 0}</span>
        </div>
        {/* <div className="flex flex-col gap-2">
          {testRooms.map(room => (
            <RoomItem room={room} showDetail={true} />
          ))}
        </div> */}
        <div className="flex flex-col gap-2">
          {data?.content.map(room => {
            const activity = getRoomActivity(room.chatRoomId);
            let hasNew = false;
            if (activity?.lastViewedAt) {
              const localDate = new Date(activity.lastViewedAt);
              const backDate = new Date(room.lastMessageAt);

              hasNew = backDate > localDate;
            }

            return (
              <RoomItem key={room.chatRoomId} room={room} showDetail={true} hasNew={hasNew} />
            )
          })}
        </div>
      </div>
    </>
  )
}
