import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRoomByRoomId, createRoom, getRoomsByUserId } from "@/api/room";
import { useNavigate } from "react-router-dom";
import type { ChatRoomAPI } from "@/types/api";

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
export const useCreateRoom = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: createRoom,
    onSuccess: (newRoom) => {
      console.log("방 생성 성공:", newRoom);
      // 방이 생성되면 기존 방 목록을 자동으로 갱신
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      navigate(`/chat/${newRoom._id}`);
    },
    onError: (error) => {
      console.error("방 생성 실패:", error);
    },
  });
};

// 유저의 방 목록 가져오기
export const useGetRoomsByUserId = (userId: string) => {
  return useQuery<ChatRoomAPI[]>({
    queryKey: ["rooms", "user", userId],
    queryFn: () => getRoomsByUserId(userId),
    enabled: !!userId, // userId 있을 때만 실행
    staleTime: 10 * 60 * 1000, // 10분 캐시 유지
  });
};