import RoomItem from "@/components/room/RoomItem";
import { useParams } from "react-router-dom";

const testRoom = [
  "채팅방 1",
  "채팅방 2",
  "채팅방 3",
  "채팅방 4",
  "채팅방 5",
];

export default function RoomListPage() {
  const { id } = useParams();

  return (
    <div>
      <p>{id}</p>
      {testRoom.map(room => (
        <RoomItem room={room} />
      ))}
    </div>
  )
}
