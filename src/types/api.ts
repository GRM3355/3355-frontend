export type ChatRoomAPI = {
  chatRoomId: string;
  festivalId: string;
  userId: string;
  title: string;
  // currentParticipants: number;
  // maxParticipants: number;
  // radius: number;
  // lat: number;
  // lon: number;
};

export interface FestivalAPI {
  festivalId: number;
  title: string;
  addr1: string;
  eventStartDate: string;
  eventEndDate: string;
  firstImage: string;
  lat: number;
  lon: number;
  region: 'SEOUL' | 'JEOLLA' | 'GYEONGGI' | 'BUSAN' | string;
  chatRoomCount: number;
}

export type RoomAPI = {
  chatRoomId: string;       // 채팅방 고유 ID
  festivalId: number;       // 축제 ID
  userId: string;           // 방 생성자/유저 ID
  title: string;            // 방 이름/제목
  lat: number;              // 위도
  lon: number;              // 경도
  festivalTitle: string;    // 축제 이름
  participantCount: number; // 현재 참여자 수
};

export type SearchResponse = {
  festivals: {
    totalCount: number;
    data: FestivalAPI[];
  };
  chatRooms: {
    totalCount: number;
    data: RoomAPI[];
  };
};
