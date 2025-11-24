import RoomItem from "@/components/room/RoomItem";
import { useState, type MouseEvent } from "react";
import type { ChatRoomAPI, FestivalAPI, RoomAPI } from "@/types/api";
import Select from "../common/Select";
import { useGetRoomsByToken } from "@/hooks/useRoom";
import useAuthStore from "@/stores/useAuthStore";

type RoomListSectionProps = {
  festivalData: FestivalAPI;
  roomDatas: RoomAPI[];
}

const FILTER = [
  { key: "participant", label: "참여자순" },
  { key: "latest", label: "최신순" },
]

export default function RoomListSection({ roomDatas }: RoomListSectionProps) {
  const [filter, setFilter] = useState<string>('participant');

  const { accessToken } = useAuthStore();
  const { data, isLoading, isError, refetch } = useGetRoomsByToken(accessToken);

  //유저 방 목록에 없는 방
  const unjoinedRooms = !data
    ? roomDatas
    : roomDatas.filter(
      room => !data.content.some(r => r.chatRoomId === room.chatRoomId)
    );

  //유저 방 목록에 있는 방
  const joinedRooms = !data
    ? []
    : roomDatas.filter(room =>
      data.content.some(r => r.chatRoomId === room.chatRoomId)
    );

  //필터링
  const filteredRooms = filter === "participant"
    ? [...unjoinedRooms].sort((a, b) => b.participantCount - a.participantCount)
    : unjoinedRooms;

  return (
    <div className="flex flex-col h-full p-4 pt-5 pb-8">
      <div className="flex gap-1 pb-3 ">
        <span className="title3-sb text-text-primary">단체 채팅방</span>
        <span className="flex-1 label5-r text-text-tertiary">
          {(unjoinedRooms?.length ?? 0) + (joinedRooms?.length ?? 0)}
        </span>
        <Select
          items={FILTER}
          selected={filter}
          onSelect={setFilter}
        />
      </div>
      <div className='flex flex-col h-full gap-2 '>

        {/* <div className='flex flex-col h-full gap-2 overflow-y-auto scrollbar-hide'> */}
        {filteredRooms.map((room: RoomAPI) => (
          <RoomItem key={room.chatRoomId} room={room} isJoined={false} />
        ))}
        {joinedRooms.map((room: RoomAPI) => (
          <RoomItem key={room.chatRoomId} room={room} isJoined={true} />
        ))}
      </div>
    </div>
  )
}
