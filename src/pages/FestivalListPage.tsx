import FestivalItem from "@/components/festival/FestivalItem";

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


export default function FestivalListPage() {
  return (
    <div className="flex flex-col gap-4">

      {/* 진행중인 페스티벌 */}
      {testFestivals.map(f => (

        <FestivalItem name={f} />

      ))}
    </div>
  )
}
