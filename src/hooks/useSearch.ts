import { getSearch } from "@/api/search";
import type { FestivalAPI, SearchResponse } from "@/types/api";
import { useQuery } from "@tanstack/react-query";

export const useGetSearch = (params: any = {}) => {
  return useQuery<SearchResponse>({
    queryKey: ['search'],
    queryFn: () => getSearch(params),
    enabled: false, //자동호출 끔
    staleTime: 10 * 60 * 1000, // 10분 캐시 유지
  });
};