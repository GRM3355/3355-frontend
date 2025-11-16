import { getUserInfo, kakaoLogin } from "@/api/user";
import useLoginStore from "@/stores/useLoginStore";
import { useMutation, useQuery } from "@tanstack/react-query";

//카카오 로그인
export const useKakaoLogin = () => {
  const { setIsLoggedIn, setUser, closeLoginModal } = useLoginStore();
  const { refetch } = useGetUserInfo();

  return useMutation({
    mutationFn: kakaoLogin,
    onSuccess: (res) => {
      setIsLoggedIn(true);
      setUser(res.data);
      closeLoginModal();
      refetch();
    },
  });
};

//카카오 유저 정보 가져오기
export const useGetUserInfo = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: () => getUserInfo(),
    staleTime: Infinity,
    enabled: false,
  });
};