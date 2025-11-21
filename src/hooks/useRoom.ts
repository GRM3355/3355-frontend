import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { createRoom, getMessages, getRoomByRoomId, getRoomsByUserId, joinRoom, leaveRoom, likeMessage } from "@/api/room";
import { useNavigate } from "react-router-dom";
import type { ChatRoomAPI, RoomAPI } from "@/types/api";
import useAuthStore from "@/stores/useAuthStore";
import { useConfirmStore } from "@/stores/useConfirmStore";

// 특정 방 정보 가져오기
export const useGetRoomById = (roomId: string) => {
  return useQuery({
    queryKey: ["room", roomId],
    queryFn: () => getRoomByRoomId(roomId),
    enabled: !!roomId, // roomId가 있을 때만 실행
    staleTime: 5 * 60 * 1000, // 5분 캐시
  });
}

// 방 생성하기
// export const useCreateRoom = () => {
//   const queryClient = useQueryClient();
//   const navigate = useNavigate();

//   return useMutation({
//     mutationFn: createRoom,
//     onSuccess: (newRoom) => {
//       console.log("방 생성 성공:", newRoom);
//       // 방이 생성되면 기존 방 목록을 자동으로 갱신
//       queryClient.invalidateQueries({ queryKey: ["rooms"] });
//       navigate(`/chat/${newRoom._id}`);
//     },
//     onError: (error) => {
//       console.error("방 생성 실패:", error);
//     },
//   });
// };
export const useCreateRoom = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { openConfirm, closeConfirm } = useConfirmStore();

  const handleConfirm = () => {
    closeConfirm();
    navigate(-1);
  }

  return useMutation({
    mutationFn: createRoom,
    onSuccess: (newRoom: RoomAPI) => {
      console.log('방 생성 성공:', newRoom);
      // setUserId(newRoom.userId);
      // 해당 축제 방 목록만 갱신
      queryClient.invalidateQueries({ queryKey: ['festivalRooms', { festivalId: newRoom.festivalId }] });

      // 생성된 방으로 이동
      navigate(`/chat/${newRoom.chatRoomId}`, {
        replace: true,
        state: {
          roomInfo: newRoom,
        }
      });
    },
    onError: (error: any) => {
      console.error('에러 상세:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
        message: error.response?.data?.error?.message
      });
      if (error.response?.data?.error?.message == '채팅방 개설 반경(1.0km)을 벗어났습니다.') {
        openConfirm('ERROR',
          '채팅방 개설 반경(1.0km)을 벗어났습니다.', handleConfirm, undefined, '확인');
      }
      console.error('방 생성 실패:', { error });
    },
  });
};

export const useJoinRoom = (roomInfo: RoomAPI) => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: joinRoom,
    onSuccess: (data: any) => {
      console.log('방 입장 성공:', data);
      navigate(`/chat/${roomInfo.chatRoomId}`, {
        state: { roomInfo },
      });
    },
    onError: (error: any) => {
      console.error('에러 상세:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
        message: error.response?.data?.error?.message
      });
      navigate(-1);
      console.error('방 생성 실패:', { error });
    },
  });
};


export const useLeaveRoom = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: leaveRoom,
    onSuccess: (data: any) => {
      console.log('방 떠나기 성공:', data);
      navigate("/my-chat", { replace: true });
    },
    onError: (error: any) => {
      console.error('에러 상세:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
        message: error.response?.data?.error?.message
      });
      navigate(-1);
      console.error('방 떠나기 실패:', { error });
    },
  });
};



// 유저의 방 목록 가져오기
export const useGetRoomsByToken = (token: string) => {
  console.log("방 목록 가져오기")
  return useQuery<{ content: RoomAPI[] }>({
    queryKey: ["myRooms", token], // 토큰만 키로
    queryFn: () => getRoomsByUserId(token),
    enabled: !!token, // 토큰 있을 때만 호출
  });
};

//메세지 무한 스크롤
interface Message {
  id: string;
  chatRoomId: string;
  userId: string;
  nickname: string;
  content: string;
  type: string;
  createdAt: string;
  likeCount: number;
  liked: boolean;
}

interface MessagesResponse {
  content: Message[];
  hasNext: boolean;
}

export const useMessagesInfinite = (roomId: string) => {

  return useInfiniteQuery<MessagesResponse>({
    queryKey: ["messages", roomId],

    queryFn: ({ pageParam }) => {
      console.log("📡 API 호출 - pageParam:", pageParam); // 로그 1
      return getMessages({
        roomId,
        before: pageParam as string,
      });
    },

    initialPageParam: null,

    getNextPageParam: (lastPage) => {
      const messages = lastPage?.content;

      if (!messages || messages.length === 0) return undefined;
      if (!lastPage.hasNext) return undefined;

      // 다음 요청용 before = 가장 오래된 메시지 id
      return messages[messages.length - 1].id;
    },

    staleTime: Infinity,
    gcTime: 5 * 60 * 1000,
  });
};

// 좋아요



export const useLikeMessage = () => {
  return useMutation({
    mutationFn: likeMessage,
    onSuccess: () => {
    },
    onError: (error: any) => {
      console.error('좋아요 실패:', { error });
    },
  });
};