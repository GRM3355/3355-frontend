import type { ViewState } from 'react-map-gl/mapbox';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type LocationStore = {
  isAllowed: boolean; // 위치 권한 있는지
  lat: number | null;
  lon: number | null;
  mapViewport: ViewState | null;

  setIsAllowed: () => void;
  setIsDenied: () => void;
  setLocation: (lat: number, lon: number) => void;
  setMapViewport: (viewport: ViewState) => void;
}

const useLocationStore = create<LocationStore>()(
  persist(
    (set) => ({
      isAllowed: false,
      lat: null,
      lon: null,
      mapViewport: null,

      setIsAllowed: () => set({ isAllowed: true }),
      setIsDenied: () => set({ isAllowed: false }),
      setLocation: (lat, lon) => set({ lat, lon }),
      setMapViewport: (v) => set({ mapViewport: v })
    }),
    {
      name: 'location-storage',
      partialize: (state) => ({ mapViewport: state.mapViewport }), // mapViewport만 저장
    }
  )
);

export default useLocationStore;
