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
  region: string;
  chatRoomCount: number;
  totalParticipantCount: number;
}

export type RoomAPI = {
  chatRoomId: string;
  festivalId: number;
  userId: string;
  title: string;
  lat: number;
  lon: number;
  festivalTitle: string;
  participantCount: number;
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

export type ChatAPI = {
  id: string;
  chatRoomId: string;
  userId: string;
  nickname: string;
  content: string;
  type: "TEXT" | string;
  createdAt: string;
  likeCount: number;
  liked: boolean;
}

export type User = {
  userId: string;
  profileNickName: string;
  accountEmail: string;
  createdAt: string;
};