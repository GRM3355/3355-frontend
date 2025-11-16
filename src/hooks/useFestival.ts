import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { getFestivals, getRoomsByFestivalId, getFestivalByFestivalId, getFestivalCountByRegion } from '@/api/festival';
import type { FestivalAPI, RoomAPI } from '@/types/api';
import type { GetFestivalByLocationParams, GetFestivalsParams } from '@/types/params';

// 모든 축제 리스트
// export const useGetFestivals = () => {
//   return useQuery({
//     queryKey: ['festivals'],
//     queryFn: getFestivals,
//     staleTime: 10 * 60 * 1000, // 10분 동안 캐시 유지
//   });
// };
export const useGetFestivals = (params: any = {}) => {
  const defaultParams = { page: 1, pageSize: 10, order: 'DATE_ASC', region: '', status: '', keyword: '', ps: false };

  return useQuery<{ content: FestivalAPI[] }>({
    queryKey: ['festivals', params], //params변화 감지
    queryFn: () => getFestivals({ ...defaultParams, ...params }),
    staleTime: 10 * 60 * 1000, // 10분 캐시 유지
    retry: 2,
  });
};

//무한 스크롤용 모든 축제 리스트
interface FestivalResponse {
  content: FestivalAPI[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
  blockSize: number;
}

export const useGetFestivalsInfinite = (params: any = {}) => {
  const defaultParams = { page: 1, pageSize: 10, order: 'DATE_ASC', region: '', status: '', keyword: '', ps: false };


  return useInfiniteQuery<FestivalResponse>({
    queryKey: ['festivals-infinite', params],

    queryFn: ({ pageParam = 1 }) =>
      getFestivals({
        ...defaultParams,
        ...params,
        page: pageParam,
      }),

    initialPageParam: 1,

    getNextPageParam: (lastPage) => {
      if (!lastPage) return undefined;
      return lastPage.currentPage < lastPage.totalPages
        ? lastPage.currentPage + 1
        : undefined;
    },

    staleTime: 10 * 60 * 1000, // 10분
    retry: 2,
  });
};



// 해당 축제의 방 목록
// export const useGetRoomsByFestivalId = (id: string) => {
//   return useQuery({
//     queryKey: ['festival', id],
//     queryFn: () => getRoomsByFestivalId(id),
//     enabled: !!id,
//   });
// };
export const useGetRoomsByFestivalId = (params: any = {}) => {
  const defaultParams = { page: 1, pageSize: 10, order: 'DATE_DESC', keyword: '' };

  return useQuery<{ content: RoomAPI[] }>({
    queryKey: ['festivalRooms', { ...defaultParams, ...params }],
    queryFn: getRoomsByFestivalId,
    enabled: !!params.festivalId,
  });
};


// 단일 축제 조회
// export const useGetFestivalByFestivalId = (id: string) => {
//   return useQuery({
//     queryKey: ['festival', id, 'rooms'],
//     queryFn: () => getFestivalByFestivalId(id),
//     enabled: !!id,
//   });
// };
export const useGetFestivalByFestivalId = (params: any = {}) => {
  return useQuery<FestivalAPI>({
    queryKey: ['festival', params],
    queryFn: getFestivalByFestivalId,
    enabled: !!params.festivalId,
  });
};

//위치 기반 축제 조회
export const useGetFestivalByLocation = (params: GetFestivalByLocationParams) => {
  const defaultParams = { ps: true }
  console.log('useGetFestivalByLocation 호출!', params);

  return useQuery<{ content: FestivalAPI[] }>({
    queryKey: ['festivalsByLocation', params],
    queryFn: getFestivals,
    enabled: true,
    retry: false, // 재시도 막기
  });
}


//축제 개수 조회
export const useGetFestivalCount = (params: any = {}) => {
  const defaultParams = { region: "SEOUL" }

  return useQuery({
    queryKey: ['festivalCount', params],
    queryFn: () => getFestivalCountByRegion({ ...defaultParams, ...params }),
  });
}
