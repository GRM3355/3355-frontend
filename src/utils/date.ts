//오늘이 축제 기간에 포함되는지
export const isFestivalActive = (startDate: string, endDate: string): boolean => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const today = new Date();

  // 시간 정보 제거 (날짜 단위 비교)
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);
  today.setHours(0, 0, 0, 0);

  return today >= start && today <= end;
};