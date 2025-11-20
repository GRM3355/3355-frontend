import useLocationStore from "@/stores/useLocationStore";
import { useEffect, useState } from "react";

export default function useCurrentLocation() {
  // const { setIsAllowed, setLocation } = useLocationStore();
  // // const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  // const [error, setError] = useState<string | null>(null);

  // useEffect(() => {
  //   if (!navigator.geolocation) {
  //     setError("Geolocation is not supported by your browser");
  //     return;
  //   }

  //   const success = (pos: GeolocationPosition) => {
  //     setIsAllowed();
  //     const { latitude, longitude } = pos.coords;
  //     setLocation(latitude, longitude);
  //   };

  //   const fail = (err: GeolocationPositionError) => {
  //     setError(err.message);
  //   };

  //   navigator.geolocation.getCurrentPosition(success, fail);
  // }, []);

  return;
}
