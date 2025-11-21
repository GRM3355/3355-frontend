import { useGetUserInfo } from "@/hooks/useUser";
import useAuthStore from "@/stores/useAuthStore";
import useLoginStore from "@/stores/useLoginStore";

export function useCheckLogin() {
  const { accessToken } = useAuthStore();
  const { openLoginModal } = useLoginStore();

  // 토큰 만료/에러 감지 (내부에서 자동 처리)
  useGetUserInfo(accessToken);

  const check = () => {
    if (!accessToken || accessToken == '') { //직접 로그아웃 햇을경우
      openLoginModal();
      return false;
    }
    return true;
  };

  return check;
}
