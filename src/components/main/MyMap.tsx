import { useRef, useState } from 'react';
import Map, { Source, Layer } from 'react-map-gl/mapbox';
import type { MapRef } from 'react-map-gl/mapbox';
import type { FeatureCollection, Point } from 'geojson';
import 'mapbox-gl/dist/mapbox-gl.css';
import { metersToPixels } from '@/\butils/map';
import type { Festival } from '@/types';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useDebounce } from 'use-debounce';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const testPoints = [
  { id: 1, lat: 37.5666, lon: 126.9781, name: '맛집 A' },
  { id: 2, lat: 37.5664, lon: 126.9782, name: '카페 B' },
  { id: 3, lat: 37.5667, lon: 126.9779, name: '분식 C' },
  { id: 4, lat: 37.5663, lon: 126.9778, name: '피자 D' },
  { id: 5, lat: 37.5665, lon: 126.9783, name: '치킨 E' },
  { id: 6, lat: 37.5666, lon: 126.9777, name: '떡볶이 F' },
  { id: 7, lat: 37.5664, lon: 126.9780, name: '샐러드 G' },
  { id: 8, lat: 37.5667, lon: 126.9782, name: '카페 H' },
  { id: 9, lat: 37.5663, lon: 126.9779, name: '초밥 I' },
  { id: 10, lat: 37.5665, lon: 126.9778, name: '버거 J' },
  { id: 11, lat: 37.5701, lon: 126.9790, name: '커피 K' },
  { id: 12, lat: 37.5649, lon: 126.9765, name: '국수 L' },
  { id: 13, lat: 37.5680, lon: 126.9772, name: '김밥 M' },
  { id: 14, lat: 37.5655, lon: 126.9795, name: '양식 N' },
  { id: 15, lat: 37.5672, lon: 126.9788, name: '분식 O' },
  { id: 16, lat: 37.5660, lon: 126.9770, name: '카페 P' },
  { id: 17, lat: 37.5675, lon: 126.9767, name: '치킨 Q' },
  { id: 18, lat: 37.5650, lon: 126.9783, name: '피자 R' },
  { id: 19, lat: 37.5668, lon: 126.9775, name: '커피 S' },
  { id: 20, lat: 37.5678, lon: 126.9785, name: '샌드위치 T' },
  { id: 21, lat: 37.5652, lon: 126.9778, name: '김밥 U' },
  { id: 22, lat: 37.5669, lon: 126.9789, name: '분식 V' },
  { id: 23, lat: 37.5671, lon: 126.9769, name: '국수 W' },
  { id: 24, lat: 37.5658, lon: 126.9772, name: '버거 X' },
  { id: 25, lat: 37.5663, lon: 126.9786, name: '초밥 Y' },
  { id: 26, lat: 37.5676, lon: 126.9779, name: '커피 Z' },
  { id: 27, lat: 37.5661, lon: 126.9784, name: '피자 AA' },
  { id: 28, lat: 37.5670, lon: 126.9773, name: '샐러드 BB' },
  { id: 29, lat: 37.5656, lon: 126.9781, name: '치킨 CC' },
  { id: 30, lat: 37.5662, lon: 126.9776, name: '분식 DD' },
];

type MyMapProps = {
  onSelectFestival: (data: Festival) => void;
  onShowBottomSheet: () => void;
}

export default function MyMap({ onSelectFestival, onShowBottomSheet }: MyMapProps) {

  //TODO: 유저 현재 위치로 변경
  const [viewport, setViewport] = useState({
    latitude: 37.5665,
    longitude: 126.9780,
    zoom: 16,
  });

  const [debouncedViewport] = useDebounce(viewport, 1000);
  //navigator.geolocation.getCurrentPositio

  const mapRef = useRef<MapRef>(null);

  // const { data, isLoading, isError, error } = useQuery({
  //   queryKey: ['festivals-by-location', debouncedViewport.latitude, debouncedViewport.longitude, debouncedViewport.zoom],
  //   queryFn: async () => {
  //     const API_KEY = import.meta.env.VITE_PUBLIC_API_KEY;
  //     const res = await axios.get('/api/festival/locationBasedList2', {
  //       params: {
  //         serviceKey: API_KEY,
  //         _type: 'json',
  //         pageNo: 1,
  //         numOfRows: 20,
  //         MobileApp: 'AppTest',
  //         MobileOS: 'ETC',
  //         contentTypeId: 15,
  //         mapX: debouncedViewport.longitude,
  //         mapY: debouncedViewport.latitude,
  //         radius: 10000 / debouncedViewport.zoom,
  //       },
  //     });

  //     const items = res.data?.response?.body?.items?.item ?? [];

  //     return items.map((item: any): Festival => ({
  //       id: String(item.contentid),
  //       name: item.title ?? '',
  //       longitude: parseFloat(item.mapx ?? 0),
  //       latitude: parseFloat(item.mapy ?? 0),
  //       mainImage: item.firstimage ?? '',
  //       date: item.eventstartdate
  //         ? `${item.eventstartdate} ~ ${item.eventenddate}`
  //         : '',
  //       address: item.addr1 ?? '',
  //       category: item.cat3 ?? '',
  //       region: item.areacode ?? '',
  //     }));
  //   },
  //   refetchOnWindowFocus: false, // 창 포커스 시 재호출 방지
  //   staleTime: 1000 * 60 * 2, // 2분간 캐시 유지
  //   gcTime: 1000 * 60 * 10, // 10분 후 가비지 컬렉션
  //   placeholderData: (prevData) => prevData, //이전 데이터 유지
  // });

  // GeoJSON 변환
  // const geoJsonPoints: FeatureCollection<Point, { id: number; name: string }> = {
  //   type: 'FeatureCollection',
  //   features:
  //     data?.map((festival: Festival) => ({
  //       type: 'Feature', //MapBox용
  //       properties: { id: festival.id, name: festival.name }, //Point 외의 정보 저장용
  //       geometry: {
  //         type: 'Point',
  //         coordinates: [festival.longitude, festival.latitude],
  //       },
  //     })) ?? [],
  // };

  const geoJsonPoints: FeatureCollection<Point, { id: number; name: string }> = {
    type: 'FeatureCollection',
    features: testPoints.map(({ id, lat, lon, name }) => ({
      type: 'Feature', //MapBox용
      properties: { id, name }, //Point 외의 정보 저장용
      geometry: { type: 'Point', coordinates: [lon, lat] },
    })),
  };
  // if (isLoading) return <p>로딩중...</p>
  // if (isError) {
  //   console.error(error);
  //   return <p>에러 발생!!</p>
  // }

  return (
    <div className='relative w-full h-full'>
      {/* {data && data.map((d: Festival) => (
        <p>{d.name}</p>
      ))} */}
      <Map
        ref={mapRef} //flyTo용 설정
        initialViewState={viewport} //시작 위치
        mapStyle='mapbox://styles/mapbox/streets-v12' //맵 스타일
        mapboxAccessToken={MAPBOX_TOKEN} //토큰
        onMoveEnd={(evt) => setViewport(evt.viewState)} //줌 레벨과 실제 거리 계산용
        style={{ width: '100%', height: '100%' }}
        interactiveLayerIds={['clusters', 'unclustered-point']}
        language='ko'
        onClick={(evt) => {

          const features = evt.features;
          if (!features) return;

          const cluster = features.find(f => f.layer?.id === 'clusters');

          const point = features.find(f => f.layer?.id === 'unclustered-point');

          if (cluster && cluster.geometry.type === 'Point') {
            const [longitude, latitude] = cluster.geometry.coordinates;

            mapRef.current?.flyTo({
              center: [longitude, latitude],
              zoom: 16, // 원하는 줌 레벨
            });
          }
          else if (point && point.geometry.type === 'Point') {
            const [longitude, latitude] = point.geometry.coordinates;

            // const selectedFestival = data?.find(
            //   (f: Festival) => f.id === point.properties?.id
            // );

            // if (selectedFestival) {
            //   onSelectFestival(selectedFestival);
            // }

            mapRef.current?.flyTo({
              center: [longitude, latitude],
              zoom: 20,
              offset: [0, -window.innerHeight * 0.18],
            });

            onShowBottomSheet();
          }

        }}

      >
        <Source
          id='points'
          type='geojson'
          data={geoJsonPoints}
          cluster={true} //집합 시킬건지
          clusterMaxZoom={14} //해당 줌 레벨 이하에서 클러스터링
          clusterRadius={30} //클러스터 반경
        >
          {/* Cluster 원 */}
          <Layer
            id='clusters' //클릭 이벤트 판별용으로 추가한 id
            type='circle' //레이어 타입. circle, symbol, line, fill 등이 있음
            source='points' //데이터를 가져올 소스 id
            filter={['has', 'point_count']}
            paint={{
              'circle-color': '#3b82f6',
              'circle-radius': ['step', ['get', 'point_count'], 20, 5, 30, 10, 40],
              'circle-stroke-width': 2,
              'circle-stroke-color': '#fff',
            }}

          />
          {/* Cluster 숫자 */}
          <Layer
            id='cluster-count'
            type='symbol'
            source='points'
            filter={['has', 'point_count']}
            layout={{
              'text-field': '{point_count_abbreviated}', //기본제공. 클러스터 내 포인트 카운팅
              //TODO: 폰트 지정 가능
              'text-size': 12,
            }}
          />
          {/* 개별 포인트 */}
          <Layer
            id='unclustered-point'
            type='circle'
            source='points'
            filter={['!', ['has', 'point_count']]}
            paint={{
              'circle-color': '#f87171',
              'circle-radius': metersToPixels(10, viewport.latitude, viewport.zoom), // 10m 기준
              'circle-stroke-width': 2,
              'circle-stroke-color': '#fff',
              'circle-opacity': 0.2,
            }}
          />
          <Layer
            id='unclustered-point-label'
            type='symbol'
            filter={['!', ['has', 'point_count']]}
            layout={{
              'text-field': ['get', 'name'], // GeoJSON properties.name 사용
              'text-size': 12,
              'text-offset': [0, 1.5], // 원 아래로 위치
              'text-anchor': 'top',
            }}
            paint={{
              'text-color': '#000',
            }}
          />
        </Source>
      </Map>

    </div >
  );
}
