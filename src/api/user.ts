import axios from "axios";
import api from "./axios";
import apiClient from "./apiClient";

//카카오 로그인
// export const kakaoLogin = async (code: string) => {
//   const { data } = await api.post("/api/auth/kakao/callback", { code }, {
//     // withCredentials: true,
//   }); //쿠키 저장
//   return data.data;
// };

// export const kakaoLogin = async (code: string) => {
//   const { data } = await api.get("/api/auth/kakao/callback", { params: { code }, });
//   return data.data;
// };

export const kakaoLogin = async (code: string) => {
  try {
    const response = await axios.get(
      "https://api.zony.kro.kr/api/auth/kakao/callback",
      {
        params: { code },
      }
    );
    return response.data.data;
  } catch (error: any) {
    console.error("Kakao login error:", error.response?.data || error.message);
    throw error;
  }
};


export const getUserInfo = async (accessToken: string) => {

  const { data } = await apiClient.get("/api/v1/user/me", {
    withCredentials: true, //쿠키 g같이 보내기
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return data.data;
};
