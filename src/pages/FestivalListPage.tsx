import Button from "@/components/common/Button";
import FestivalItem from "@/components/festival/FestivalItem";
import { useState } from "react";

const testFestivals = [
  "한강불꽃축제",
  "부산국제영화제",
  "서울세계불꽃놀이",
  "춘천마임축제",
  "전주국제영화제",
  "대구치맥페스티벌",
  "제주불꽃놀이",
  "안동국제탈춤페스티벌",
  "광주비엔날레",
  "부산바다축제"
];

export const regions = [
  "서울",
  "경기",
  "인천",
  "강원",
  "충북",
  "충남",
  "전북",
  "전남",
  "경북",
  "경남",
  "제주",
  "세종",
  "대전",
  "대구",
  "광주",
  "부산",
  "울산",
];


export default function FestivalListPage() {
  const [showRegions, setShowRegions] = useState<boolean>(false);

  const visibleRegions = showRegions ? regions : regions.slice(0, 6);

  return (
    <div className="flex flex-col h-screen ">
      {/* 지역 필터링 */}
      <div className="flex flex-wrap gap-4 p-4 border-b shrink-0">
        {visibleRegions.map((region) => (
          <span key={region}>{region}</span>
        ))}
        <span onClick={() => setShowRegions(!showRegions)}>더보기</span>
      </div>

      {/* 정렬 */}
      <div className="flex gap-4 items-center justify-between p-4 border-b shrink-0">
        <p>진행/예정 페스티벌(28)</p>
        <select>
          <option value="someOption">가까운순</option>
          <option value="otherOption">가나다순</option>
        </select>
      </div>

      {/* 진행중인 페스티벌 */}
      <div className="flex flex-col gap-4 overflow-y-auto p-4 flex-grow">
        {testFestivals.map((f) => (
          <FestivalItem key={f} name={f} />
        ))}
      </div>
    </div>


  )
}
