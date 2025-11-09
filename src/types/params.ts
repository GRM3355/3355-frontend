export type GetRoomsByFestivalIdParams = {
  festivalId: number;
  page: number;
  pageSize: number;
  order?: string;
  region?: string;
  status?: string;
  keyword?: string;
};


export type PostRoomParams = {
  festivalId: string;
  title: string;
  token: string;
};