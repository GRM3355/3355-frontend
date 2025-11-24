import { getSearch, getSearchFestivals, getSearchRooms } from "@/api/search";
import type { FestivalAPI, RoomAPI, SearchResponse } from "@/types/api";
import { useQuery } from "@tanstack/react-query";

export const useGetSearch = (params: any = {}) => {
  return useQuery<SearchResponse>({
    queryKey: ['search'],
    queryFn: () => getSearch(params),
    enabled: false, //자동호출 끔
    staleTime: 10 * 60 * 1000, // 10분 캐시 유지
  });
};

export const useGetSearchFestivals = (params: any = {}) => {
  return useQuery<FestivalAPI[]>({
    queryKey: ['searchFestivalss'],
    queryFn: () => getSearchFestivals(params),
    enabled: false, //자동호출 끔
    staleTime: 10 * 60 * 1000, // 10분 캐시 유지
  });
};

export const useGetSearchRooms = (params: any = {}) => {
  return useQuery<RoomAPI[]>({
    queryKey: ['searchRooms'],
    queryFn: () => getSearchRooms(params),
    enabled: false, //자동호출 끔
    staleTime: 10 * 60 * 1000, // 10분 캐시 유지
  });
};