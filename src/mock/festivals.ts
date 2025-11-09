import { type Festival } from "@/types";

export const festivals: Festival[] = [
  {
    id: "f1",
    name: "서울 불꽃축제",
    longitude: 126.941,
    latitude: 37.519,
    mainImage: "/images/fireworks.jpg",
    date: "2025-10-15",
    address: "서울특별시 여의도 한강공원",
    category: "불꽃",
    region: "서울",
  },
  {
    id: "f2",
    name: "부산 바다음악제",
    longitude: 129.115,
    latitude: 35.155,
    mainImage: "/images/beach-music.jpg",
    date: "2025-08-20",
    address: "부산 해운대 해수욕장",
    category: "음악",
    region: "부산",
  },
];
