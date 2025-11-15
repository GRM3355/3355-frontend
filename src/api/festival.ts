import axios from "axios";
import api from "./axios";

// 축제 리스트 조회
// export const getFestivals = async () => {
//   const res = await axios.get("http://localhost:3000/api/festival/list");
//   return res.data.data;
// };
export const getFestivals = async (params: any) => {
  const { data } = await api.get("/api/v1/festivals", { params });
  return data.data;
};

// 축제의 방 목록 조회
// export const getRoomsByFestivalId = async (id: string) => {
//   const res = await axios.get(`http://localhost:3000/api/festival/${id}/rooms`);
//   return res.data.data;
// };
export const getRoomsByFestivalId = async ({ queryKey }: any) => {
  const [, params] = queryKey;
  const { festivalId, ...queryParams } = params;

  const { data } = await api.get(`/api/v1/festivals/${params.festivalId}/chat-rooms`,
    { params: queryParams });
  return data.data;
};

// 단일 축제 조회
// export const getFestivalByFestivalId = async (id: string) => {
//   const res = await axios.get(`http://localhost:3000/api/festival/${id}`);
//   return res.data.data;
// };

export const getFestivalByFestivalId = async ({ queryKey }: any) => {
  const [, { festivalId }] = queryKey;
  const { data } = await api.get(`/api/v1/festivals/${festivalId}`);
  return data.data;
};

//지역별 축제 개수
export const getFestivalCountByRegion = async ({ queryKey }: any) => {
  const [, { region }] = queryKey;
  const { data } = await api.get(`/api/v1/festivals/count`, {
    params: { region },
  });
  return data.data;
};