import axios from "axios";

export const getFestivals = async () => {
  const res = await axios.get("http://localhost:3000/api/festival/list");
  return res.data.data;
};

export const getRooms = async (id: string) => {
  const res = await axios.get(`http://localhost:3000/api/festival/${id}/rooms`);
  return res.data.data;
};

export const getFestivalById = async (id: string) => {
  const res = await axios.get(`http://localhost:3000/api/festival/${id}`);
  return res.data.data;
};