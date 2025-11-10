import type { PostRoomParams } from "@/types/params";
import axios from "axios";
import api from "./axios";

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
export const createRoom = async ({ festivalId, title, token }: PostRoomParams) => {
  console.log('방 생성 요청:', { festivalId, title });
  console.log('URL:', `/api/v1/festivals/${festivalId}/chat-rooms`);

  try {
    const { data } = await api.post(
      `/v1/festivals/${festivalId}/chat-rooms`,
      { title },
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
    console.error('에러 상세:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
    });
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

  const res = await api.get('/v1/chat-rooms/my-rooms',
    {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      params: queryParams
    });
  return res.data.data;
};