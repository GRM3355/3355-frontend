import axios from "axios";

export const getRooms = async () => {
  const res = await axios.get("http://localhost:3000/api/room/");
  return res.data.data;
};
