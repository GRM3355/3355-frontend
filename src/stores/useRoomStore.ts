import type { User } from '@/types/api';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type RoomActivity = {
  roomId: string;
  lastViewedAt: Date;
  hasNewChat: boolean;
}

type RoomStore = {
  roomActivities: RoomActivity[];
  updateRoomActivity: (activity: RoomActivity) => void;
  getRoomActivity: (roomId: string) => RoomActivity | undefined;
}

const useRoomStore = create<RoomStore>()(
  persist(
    (set, get) => ({
      roomActivities: [],
      updateRoomActivity: (activity) => {
        const exists = get().roomActivities.find(r => r.roomId === activity.roomId);
        set({
          roomActivities: exists
            ? get().roomActivities.map(r => r.roomId === activity.roomId ? activity : r)
            : [...get().roomActivities, activity]
        });
      },
      getRoomActivity: (roomId: string) => {
        return get().roomActivities.find(r => r.roomId === roomId);
      },
    }),
    {
      name: 'room-storage',
    }
  )
);

export default useRoomStore;