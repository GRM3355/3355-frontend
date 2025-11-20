import type { PostRoomParams } from "@/types/params";
import axios from "axios";
import api from "./axios";
import apiClient from "./apiClient";

// 방 아이디로 방 정보 조회
export const getRoomByRoomId = async (id: string) => {
  const res = await api.get(`http://localhost:3000/api/room/${id}`);
  return res.data.data;
};

// 유저 아이디, 축제 아이디, 방제목으로 새 방 생성
// export const createRoom = async (roomData: {
//   userId: string;
//   festivalId: string;
//   title: string;
// }) => {
//   const res = await axios.post("http://localhost:3000/api/room", roomData);
//   return res.data.data;
// };
// export const createRoom = async ({ festivalId, title, token }: PostRoomParams) => {
//   const { data } = await axios.post(`/api/v1/festivals/${festivalId}/chat-rooms`,
//     { title },
//     {
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`,
//         // 'Authorization': 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiO',
//       }
//     });
//   return data.data;
// }
export const createRoom = async ({ festivalId, token, title, lat, lon }: PostRoomParams) => {
  console.log('방 생성 요청:', { festivalId, title, token });
  console.log('URL:', `/api/v1/festivals/${festivalId}/chat-rooms`);

  try {
    const { data } = await apiClient.post(
      `/api/v1/festivals/${festivalId}/chat-rooms`,
      { title, lat, lon },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    console.log('응답:', data);
    return data.data;
  } catch (error: any) {

    throw error;
  }
};

// 입장
export const joinRoom = async ({ roomId, token, }: { roomId: string; token: string; }) => {
  console.log('방 join 요청:', { roomId });
  console.log('URL:', `/api/v1/chat-rooms/${roomId}/join`);

  try {
    const { data } = await apiClient.post(
      `/api/v1/chat-rooms/${roomId}/join`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    console.log('응답:', data);
    return data.data;
  } catch (error: any) {
    throw error;
  }
};

// 유저 아이디로 참여 중인 방 목록 조회
// export const getRoomsByUserId = async (userId: string) => {
//   const res = await axios.get(`http://localhost:3000/api/room/user/${userId}`);
//   return res.data.data;
// };
export const getRoomsByUserId = async ({ queryKey }: any) => {
  const [, params] = queryKey;
  const { token, ...queryParams } = params;

  const res = await apiClient.get('/api/v1/chat-rooms/my-rooms',
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      params: queryParams
    });
  return res.data.data;
};


type getMessagesParams = {
  roomId: string;
  before?: string | null;
}
//채팅방 과거 메세지 조회
export const getMessages = async ({ roomId, before }: getMessagesParams) => {
  console.log("getMessages 호출 - roomId:", roomId, "before:", before);
  const { data } = await apiClient.get(`/api/v1/chat-rooms/${roomId}/messages`, {
    params: { before },
  });
  console.log("getMessages 응답:", data);
  return data.data;
};

//좋아요
export const likeMessage = async ({ messageId }: { messageId: string }) => {
  try {
    const { data } = await apiClient.post(`/api/v1/messages/${messageId}/like`,);
    console.log('응답:', data);
    return data.data;
  } catch (error: any) {
    throw error;
  }
};