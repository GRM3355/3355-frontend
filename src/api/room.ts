import axios from "axios";

// 방 아이디로 방 정보 조회
export const getRoomByRoomId = async (id: string) => {
  const res = await axios.get(`http://localhost:3000/api/room/${id}`);
  return res.data.data;
};

// 유저 아이디, 축제 아이디, 방제목으로 새 방 생성
export const createRoom = async (roomData: {
  userId: string;
  festivalId: string;
  title: string;
}) => {
  const res = await axios.post("http://localhost:3000/api/room", roomData);
  return res.data.data;
};

// 유저 아이디로 참여 중인 방 목록 조회
export const getRoomsByUserId = async (userId: string) => {
  const res = await axios.get(`http://localhost:3000/api/room/user/${userId}`);
  return res.data.data;
};
