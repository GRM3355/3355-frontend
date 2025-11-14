import AD from "@/components/common/AD";
import Header from "@/components/layout/Header";
import RoomItem from "@/components/room/RoomItem";
import { useGetRoomsByToken } from "@/hooks/useRoom";
import useAuthStore from "@/stores/useAuthStore";
import type { ChatRoomAPI, RoomAPI } from "@/types/api";
// import type { ChatRoom } from "@/types";
import { useParams } from "react-router-dom";


export default function MyChatPage() {
  const { tempToken } = useAuthStore();
  const { data, isLoading, isError } = useGetRoomsByToken({ token: tempToken });

  console.log("내 채팅방 목록:", data);

  // if (isLoading) return <div>로딩 중...</div>;
  // if (isError) return <div>에러 발생!</div>;

  // return (
  //   <>
  //     <Header showLogo={true} showUser={true} showSearch={true} />
  //     <div className="w-full h-full">
  //       {data?.content.length ? (
  //         <div>
  //           {data?.content.map((room: RoomAPI) => (
  //             <div key={room.chatRoomId}>
  //               <p>{room.title}</p>
  //             </div>
  //           ))}
  //         </div>
  //       ) : (
  //         <div className="flex w-full h-full items-center justify-center">
  //           <p>현재 참여중인 방이 없습니다.</p>
  //         </div>
  //       )}

  //     </div>
  //   </>

  // )

  // const testRooms: RoomAPI[] = [
  //   {
  //     chatRoomId: "room-1",
  //     festivalId: 1,
  //     userId: "user-1",
  //     title: "테스트 방 1",
  //     lat: 37.5665,
  //     lon: 126.9780,
  //     festivalTitle: "테스트 페스티벌 A",
  //     participantCount: 5,
  //   },
  //   {
  //     chatRoomId: "room-2",
  //     festivalId: 1,
  //     userId: "user-2",
  //     title: "테스트 방 2",
  //     lat: 37.5651,
  //     lon: 126.9895,
  //     festivalTitle: "테스트 페스티벌 B",
  //     participantCount: 3,
  //   },
  // ];

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
        <div className="flex flex-col gap-2">
          {data?.content.map(room => (
            <RoomItem room={room} showDetail={true} />
          ))}
        </div>
      </div>
    </>
  )
}
