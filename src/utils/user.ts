import { jwtDecode } from "jwt-decode";

export const getUserId = (newToken: string) => {
  const payload: any = jwtDecode(newToken);
  console.log(payload.auth);
  return payload.auth;
}