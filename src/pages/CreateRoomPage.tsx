import Button from "@/components/common/Button";
import { useParams } from "react-router-dom";

export default function CreateRoomPage() {
  const { id } = useParams();

  return (
    <div>
      <p>채팅방명(필수)</p>
      <p>어떤 주제로 대화하고 싶으신가요?</p>
      <input type="text" className="border" />
      <Button>채팅방 생성하기 (페스티벌 id: {id})</Button>
    </div>
  )
}
