import axios from "axios";

export const getSearch = async ({ queryKey }: any) => {
  const [, params] = queryKey;

  const res = await axios.get('/api/v1/search', { params });
  return res.data.data;
};

export const getSearchFestivals = async ({ queryKey }: any) => {
  const [, params] = queryKey;
  const { token, ...queryParams } = params;

  const res = await axios.get('/api/v1/chat-rooms/my-rooms',
    {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      params: queryParams
    });
  return res.data.data;
};

export const getSearchRooms = async ({ queryKey }: any) => {
  const [, params] = queryKey;
  const { token, ...queryParams } = params;

  const res = await axios.get('/api/v1/chat-rooms/my-rooms',
    {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      params: queryParams
    });
  return res.data.data;
};