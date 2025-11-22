// import { useCreateRoom } from "@/hooks/useRoom";
import Button from "@/components/common/Button";
import { useNavigate, useParams } from "react-router-dom";
import useAuthStore from "@/stores/useAuthStore";
import { useEffect, useState } from "react";
import { useCreateRoom } from "@/hooks/useRoom";
import Header from "@/components/layout/Header";
import Input from "@/components/common/Input";
import useLocationStore from "@/stores/useLocationStore";
import Nav from "@/components/layout/Nav";
import ErrorPage from "./ErrorPage";
import useLoginStore from "@/stores/useLoginStore";
import { useCheckLogin } from "@/hooks/useCheckLogin";

export default function CreateRoomPage() {
  const { festivalId } = useParams();
  const { accessToken } = useAuthStore();
  const [roomTitle, setRoomTitle] = useState("");

  // const { mutate, isPending } = useCreateRoom();
  const { mutate, isPending, isError } = useCreateRoom();
  const { lat, lon } = useLocationStore();
  const { openLoginModal } = useLoginStore();
  const navigate = useNavigate();

  const checkLogin = useCheckLogin();
  useEffect(() => {
    checkLogin();
  }, []);

  const handleCreateRoom = () => {
    // if (!isLoggedIn) {
    //   openLoginModal();
    //   return;
    // }

    if (!accessToken || !festivalId || !lat || !lon) return;

    const id = parseInt(festivalId);
    console.log("채팅방 생성 시도:", { festivalId, token: accessToken, roomTitle, lat, lon });
    mutate({
      festivalId: id,
      token: accessToken,
      title: roomTitle,
      lat,
      lon
    });
  }

  // useEffect(() => {
  //   if (!isLoggedIn) {
  //     openLoginModal();
  //   }
  // }, [festivalId, accessToken, isLoggedIn])

  if (!festivalId) return <ErrorPage />;
  if (isError) return <ErrorPage />;

  return (
    <>
      <Header showBack={true} title='채팅방 만들기' />
      <div className='flex-1 w-full h-full relative overflow-hidden'>
        <div className="flex flex-col gap-9 p-4">
          <div>
            <p className="text-2xl font-normal">어떤 주제로</p>
            <p className="text-2xl font-normal">대화하고 싶으신가요?</p>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex gap-0.5">
              <span className="label3-sb text-text-primary">채팅방명</span>
              <span className="text-text-brand">*</span>
            </div>

            {/* <input type="text" className="border h-12 p-3 rounded-2
          text-text-placeholder"
            onChange={(e) => setRoomTitle(e.target.value)}
            placeholder="dgdsgg" /> */}
            <Input
              type="text"
              placeholder="디자인에 placehold라고 적혀있어요"
              value={roomTitle}
              onChange={(e) => setRoomTitle(e.target.value)}
              defaultStyle="border border-line-border-secondary h-12 p-3 rounded-2 text-text-placeholder"
              focusStyle="border h-12 p-3 rounded-2 text-text-secondary body1-r"
              completeStyle="border h-12 p-3 rounded-2 text-text-primary"
            />
          </div>

          <Button variant="brand"
            onClick={() => handleCreateRoom()} disabled={isPending || !roomTitle}>
            {isPending ? "생성 중..." : `채팅방 생성하기 (페스티벌 id: ${festivalId})`}
          </Button>
        </div>
      </div>
      <Nav />
    </>

  )
}
