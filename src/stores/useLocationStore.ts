import { create } from 'zustand';

type LocationStore = {
  isAllowed: boolean; //위치 권한 있는지
  lat: number | null;
  lon: number | null;

  setIsAllowed: () => void;
  setLocation: (lat: number, lon: number) => void;
}

const useLocationStore = create<LocationStore>()((set) => ({
  isAllowed: false,
  lat: null,
  lon: null,

  setIsAllowed: () => set({ isAllowed: true }),
  setLocation: (lat, lon) => set({ lat, lon }),
})
);

export default useLocationStore;
