// export type GetFestivalsParams = {
//   page: number;
//   pageSize: number;
//   order?: 'DATE_ASC' | 'DATE_DESC';
//   region?: string;
//   status?: ''
//   keyword?: string;
//   ps: boolean;
//   lat?: number;
//   lon?: number;
//   radius?: number;
// };

export type GetFestivalsParams = {
  page?: number;
  pageSize?: number;
  order?: 'DATE_ASC' | 'DATE_DESC';
  region?: string;
  status?: '' | 'UPCOMING';
  keyword?: string;
  ps?: boolean;
  lat?: number;
  lon?: number;
  radius?: number;
};


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