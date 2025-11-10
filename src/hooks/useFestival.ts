import { useQuery } from '@tanstack/react-query';
import { getFestivals, getRoomsByFestivalId, getFestivalByFestivalId } from '@/api/festival';
import type { FestivalAPI, RoomAPI } from '@/types/api';

// 모든 축제 리스트
// export const useGetFestivals = () => {
//   return useQuery({
//     queryKey: ['festivals'],
//     queryFn: getFestivals,
//     staleTime: 10 * 60 * 1000, // 10분 동안 캐시 유지
//   });
// };
export const useGetFestivals = (params: any = {}) => {
  const defaultParams = { page: 1, pageSize: 10, order: '', region: '', status: '', keyword: '' };

  return useQuery<{ content: FestivalAPI[] }>({
    queryKey: ['festivals', { ...defaultParams, ...params }],
    queryFn: getFestivals,
    staleTime: 10 * 60 * 1000, // 10분 캐시 유지
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