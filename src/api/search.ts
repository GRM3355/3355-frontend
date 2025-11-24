import axios from "axios";
import api from "./axios";

export const getSearch = async (params: any) => {
  const res = await api.get('/api/v1/search', { params });
  return res.data.data;
};

export const getSearchFestivals = async (params: any) => {
  const res = await api.get('/api/v1/search/festivals', { params });
  return res.data.data.content;
};

export const getSearchRooms = async (params: any) => {
  const res = await api.get('/api/v1/search/chat-rooms', { params });
  return res.data.data.content;
};