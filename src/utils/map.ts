//실제 거리를 화면 픽셀로 변환 
export const metersToPixels = (meters: number, latitude: number, zoom: number) => {
  const metersPerPixel = 156543.03392 * Math.cos(latitude * Math.PI / 180) / Math.pow(2, zoom);
  return meters / metersPerPixel;
};

export const regions = [
  { key: "SEOUL", label: "서울", lat: 37.5666138, lon: 126.9781934 },
  { key: "GYEONGGI", label: "경기/인천", lat: 37.2895531, lon: 127.0535746 },
  { key: "CHUNGCHEONG", label: "충청/대전/세종", lat: 36.4800353, lon: 127.2890601 },
  { key: "GANGWON", label: "강원", lat: 37.8855818, lon: 127.7298976 },
  { key: "GYEONGBUK", label: "경북/대구/울산", lat: 36.2790520, lon: 128.7150995 },
  { key: "GYEONGNAM", label: "경남/부산", lat: 35.3384826, lon: 128.3974307 },
  { key: "JEOLLA", label: "전라/광주", lat: 35.3026514, lon: 126.9211958 },
  { key: "JEJU", label: "제주", lat: 33.3863939, lon: 126.5398799 },
];
