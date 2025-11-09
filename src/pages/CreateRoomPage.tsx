// import { useCreateRoom } from "@/hooks/useRoom";
import Button from "@/components/common/Button";
import { useParams } from "react-router-dom";
import useAuthStore from "@/stores/useAuthStore";
import { useState } from "react";
import { useCreateRoom } from "@/hooks/useRoom";

export default function CreateRoomPage() {
  const { festivalId } = useParams();
  const { tempToken } = useAuthStore();
  const [roomTitle, setRoomTitle] = useState("");

  // const { mutate, isPending } = useCreateRoom();
  const { mutate, isPending } = useCreateRoom();

  const handleCreateRoom = () => {
    if (!tempToken || !festivalId) return;

    console.log("채팅방 생성 시도:", { festivalId, roomTitle, token: tempToken });
    mutate({
      festivalId,
      title: roomTitle,
      token: tempToken,
    });

  }

  if (!festivalId) return <div>페스티벌 ID가 없습니다.</div>;

  return (
    <div>
      <p>채팅방명(필수)</p>
      <p>어떤 주제로 대화하고 싶으신가요?</p>
      <input type="text" className="border"
        onChange={(e) => setRoomTitle(e.target.value)} />
      <Button onClick={() => handleCreateRoom()} disabled={isPending}>
        {isPending ? "생성 중..." : `채팅방 생성하기 (페스티벌 id: ${festivalId})`}
      </Button>
    </div>
  )
}
