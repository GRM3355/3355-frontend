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

//2025년 11월 20일 목요일
export const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);

  // 요일 배열
  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];
  const dayOfWeek = weekDays[date.getDay()];

  // YYYY년 MM월 DD일 요일
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${dayOfWeek}요일`;
}