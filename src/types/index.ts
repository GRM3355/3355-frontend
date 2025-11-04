export type Festival = {
  id: string;
  name: string;
  longitude: number;
  latitude: number;
  mainImage: string;
  date: string;
  address: string;
  category: string;
  region?: string;
};

export type ChatRoom = {
  id: string;
  festivalId: string;
  name: string;
  creatorId: string;
  participantsCount: number;
};
