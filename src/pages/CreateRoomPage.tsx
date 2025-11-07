import { useCreateRoom } from "@/hooks/useRoom";
import Button from "@/components/common/Button";
import { useParams } from "react-router-dom";
import useAuthStore from "@/stores/useAuthStore";
import { useState } from "react";

export default function CreateRoomPage() {
  const { id } = useParams();
  const { tempToken } = useAuthStore();
  const [roomTitle, setRoomTitle] = useState("");

  const { mutate, isPending } = useCreateRoom();

  const handleCreateRoom = () => {
    if (!tempToken || !id) return;
    mutate({
      userId: tempToken,
      festivalId: id,
      title: roomTitle,
    });

  }

  if (!id) return <div>페스티벌 ID가 없습니다.</div>;

  return (
    <div>
      <p>채팅방명(필수)</p>
      <p>어떤 주제로 대화하고 싶으신가요?</p>
      <input type="text" className="border"
        onChange={(e) => setRoomTitle(e.target.value)} />
      <Button onClick={() => handleCreateRoom()} disabled={isPending}>
        {isPending ? "생성 중..." : `채팅방 생성하기 (페스티벌 id: ${id})`}
      </Button>
    </div>
  )
}
