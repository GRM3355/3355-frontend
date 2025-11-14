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
  festivalId: number;
  title: string;
  token: string;
  lat: number;
  lon: number;
};

export type GetFestivalByLocationParams = {
  page?: number;
  pageSize?: number;
  order?: string;
  region?: string;
  status?: string;
  keyword?: string;
  lat: number;
  lon: number;
  radius: number;
}