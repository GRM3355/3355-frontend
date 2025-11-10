import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.PROD
    ? 'https://api.zony.kro.kr' // 배포용
    : '/', // 로컬 proxy용
});

export default api;
