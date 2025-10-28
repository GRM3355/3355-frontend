//실제 거리를 화면 픽셀로 변환 
export const metersToPixels = (meters: number, latitude: number, zoom: number) => {
  const metersPerPixel = 156543.03392 * Math.cos(latitude * Math.PI / 180) / Math.pow(2, zoom);
  return meters / metersPerPixel;
};
