import { useQuery } from '@tanstack/react-query';
import { getFestivals, getRoomsByFestivalId, getFestivalByFestivalId } from '@/api/festival';

// 모든 축제 리스트
export const useGetFestivals = () => {
  return useQuery({
    queryKey: ['festivals'],
    queryFn: getFestivals,
    staleTime: 10 * 60 * 1000, // 10분 동안 캐시 유지
  });
};

// 단일 축제 조회
export const useGetRoomsByFestivalId = (id: string) => {
  return useQuery({
    queryKey: ['festival', id],
    queryFn: () => getRoomsByFestivalId(id),
    enabled: !!id,
  });
};

// 해당 축제의 방 목록
export const useGetFestivalByFestivalId = (id: string) => {
  return useQuery({
    queryKey: ['festival', id, 'rooms'],
    queryFn: () => getFestivalByFestivalId(id),
    enabled: !!id,
  });
};
