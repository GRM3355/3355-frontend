import { getUserInfo, kakaoLogin } from "@/api/user";
import useLoginStore from "@/stores/useLoginStore";
import type { User } from "@/types/api";
import { useMutation, useQuery } from "@tanstack/react-query";

//카카오 로그인
export const useKakaoLogin = () => {
  const { closeLoginModal } = useLoginStore();
  // const { refetch } = useGetUserInfo();

  return useMutation({
    mutationFn: kakaoLogin,
    onSuccess: () => {
      closeLoginModal();
      // refetch();
    },
  });
};

//카카오 유저 정보 가져오기
export const useGetUserInfo = (accessToken: string) => {
  return useQuery<User>({
    queryKey: ['user', accessToken],
    queryFn: () => getUserInfo(accessToken),
    staleTime: Infinity,
    enabled: !!accessToken, // token 없으면 자동 호출 금지
  });
};