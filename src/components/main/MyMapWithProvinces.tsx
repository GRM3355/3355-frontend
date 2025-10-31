import { useEffect, useRef } from 'react';
import Map, { type MapRef } from 'react-map-gl/mapbox';
import MapboxLanguage from '@mapbox/mapbox-gl-language';

export default function MyMapWithProvinces() {
  const mapRef = useRef<MapRef>(null);

  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    const handleLoad = () => {
      // 1. GeoJSON 소스 추가
      if (!map.getSource('korea-provinces')) {
        map.addSource('korea-provinces', {
          type: 'geojson',
          data: '/geojson/korea_provinces.json', // public 폴더에 저장
        });
      }

      // 2. 경계선 레이어
      if (!map.getLayer('province-borders')) {
        map.addLayer({
          id: 'province-borders',
          type: 'line',
          source: 'korea-provinces',
          paint: {
            'line-color': '#1e3a8a',
            'line-width': 2,
          },
        });
      }

      // 3. 채우기 색상 레이어
      if (!map.getLayer('province-fill')) {
        map.addLayer({
          id: 'province-fill',
          type: 'fill',
          source: 'korea-provinces',
          paint: {
            'fill-color': [
              'match',
              ['get', 'CTP_KOR_NM'],
              '서울특별시', '#f87171',
              '경기도', '#60a5fa',
              '강원도', '#34d399',
              /* default */ '#e5e7eb',
            ],
            'fill-opacity': 0.3,
          },
        });
      }

      // 4. 시·도 라벨
      if (!map.getLayer('province-label')) {
        map.addLayer({
          id: 'province-label',
          type: 'symbol',
          source: 'korea-provinces',
          layout: {
            'text-field': ['get', 'CTP_KOR_NM'],
            'text-size': 14,
            'text-anchor': 'center', // Mapbox에서 유효한 값
          },
          paint: {
            'text-color': '#000',
          },
        });
      }

      // 5. MapboxLanguage 한글 적용
      map.addControl(new MapboxLanguage({ defaultLanguage: 'ko' }));
    };

    // load 이벤트 등록
    map.on('load', handleLoad);

    // cleanup
    return () => {
      map.off('load', handleLoad);
    };
  }, []); // 빈 배열: 마운트 시 한 번만 실행

  return (
    <Map
      ref={mapRef}
      initialViewState={{ latitude: 36.5, longitude: 127.8, zoom: 6 }}
      style={{ width: '100%', height: '100%' }}
      mapStyle='mapbox://styles/mapbox/streets-v11'
      mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
    />
  );
}
