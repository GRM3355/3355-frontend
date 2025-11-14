import { useEffect, useRef, useState } from 'react';
import Map, { Source, Layer, Marker } from 'react-map-gl/mapbox';
import type { MapRef } from 'react-map-gl/mapbox';
import type { FeatureCollection, Point } from 'geojson';
import 'mapbox-gl/dist/mapbox-gl.css';
import { metersToPixels } from '@/utils/map';
import type { Festival } from '@/types';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useDebounce } from 'use-debounce';
import type { FestivalAPI } from '@/types/api';
import { useGetFestivalByLocation, useGetFestivals } from '@/hooks/useFestival';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;


type MyMapProps = {
  onSelectFestival: (data: FestivalAPI) => void;
  onShowBottomSheet: () => void;
}

const LAT = 37.56813168;
const LON = 126.9696496;
export default function MyMap({ onSelectFestival, onShowBottomSheet }: MyMapProps) {
  const [isLayerVisible, setIsLayerVisible] = useState(true);

  const mapRef = useRef<MapRef>(null);
  const loadedRef = useRef(false);

  //TODO: 유저 현재 위치로 변경
  const [viewport, setViewport] = useState({
    latitude: LAT,
    longitude: LON,
    zoom: 14,
  });

  const [debouncedViewport] = useDebounce(viewport, 1000);
  //navigator.geolocation.getCurrentPositio

  // 줌레벨 16이상일때 비어있으면 한번만 호출
  const handleLoadFestivalCount = () => {

  }

  const { data, isError, error } = useGetFestivalByLocation({
    lat: debouncedViewport.latitude,
    lon: debouncedViewport.longitude,
    radius: 10
  });

  if (!data) return <></>
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

  //     console.log("지도 기반 축제 데이터:", res.data);
  //     return res.data?.response?.body?.items?.item ?? [];
  //   },
  //   refetchOnWindowFocus: false, // 창 포커스 시 재호출 방지
  //   staleTime: 1000 * 60 * 2, // 2분간 캐시 유지
  //   gcTime: 1000 * 60 * 10, // 10분 후 가비지 컬렉션
  //   placeholderData: (prevData) => prevData, //이전 데이터 유지
  // });

  //GeoJSON 변환
  const geoJsonPoints: FeatureCollection<Point, { id: number; name: string }> = {
    type: 'FeatureCollection',
    features:
      data?.content.map((festival: FestivalAPI) => ({
        type: 'Feature', //MapBox용
        properties: { id: festival.festivalId, name: festival.title }, //Point 외의 정보 저장용
        geometry: {
          type: 'Point',
          coordinates: [festival.lon, festival.lat],
        },
      })) ?? [],
  };

  // const geoJsonPoints: FeatureCollection<Point, { id: number; name: string }> = {
  //   type: 'FeatureCollection',
  //   features:
  //     data?.map((festival: any) => ({
  //       type: 'Feature', //MapBox용
  //       properties: { id: festival.contentid, name: festival.title, status: parseInt(festival.zipcode) }, //Point 외의 정보 저장용
  //       geometry: {
  //         type: 'Point',
  //         coordinates: [festival.mapx, festival.mapy],
  //       },
  //     })) ?? [],
  // };

  if (isError) {
    console.error(error);
    return <p>에러 발생!!</p>
  }


  return (
    <div className='relative w-full h-full'>
      {/* {data && data.map((d: Festival) => (
        <p>{d.name}</p>
      ))} */}
      <Map
        ref={mapRef} //flyTo용 설정
        initialViewState={viewport} //시작 위치
        mapStyle='mapbox://styles/mapbox/light-v11' //맵 스타일
        mapboxAccessToken={MAPBOX_TOKEN} //토큰
        style={{ width: '100%', height: '100%' }}
        interactiveLayerIds={['clusters', 'unclustered-point']}
        language='ko'
        onLoad={(evt) => {
          const map = evt.target;
          if (loadedRef.current) return;

          loadedRef.current = true; // 한 번만 실행

          if (map.hasImage("cluster-icon")) return;

          map.loadImage('/cluster.png', (error, image) => {
            if (error || !image) {
              console.error("이미지 로드 실패:", error);
              return;
            }

            map.addImage("cluster-icon", image);
            console.log("클러스터 아이콘 등록 완료");
          });
        }}
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

            const selectedFestival = data?.content.find(
              (f: FestivalAPI) => f.festivalId === point.properties?.id
            );

            if (selectedFestival) {
              onSelectFestival(selectedFestival);
            }

            mapRef.current?.flyTo({
              center: [longitude, latitude],
              zoom: 20,
              offset: [0, -window.innerHeight * 0.18],
            });

            onShowBottomSheet();
          }

        }}
        onZoomEnd={(evt) => {

        }}
        onMoveEnd={(evt) => setViewport(evt.viewState)} //줌 레벨과 실제 거리 계산용

      >
        <Source
          id='points'
          type='geojson'
          data={geoJsonPoints}
          cluster={true} //집합 시킬건지
          clusterMaxZoom={16} //해당 줌 레벨 이하에서 클러스터링
          clusterRadius={40} //클러스터 반경
        >
          <Layer
            id='clusters' //클릭 이벤트 판별용으로 추가한 id
            type='symbol' //레이어 타입. circle, symbol, line, fill 등이 있음
            source='points' //데이터를 가져올 소스 id
            filter={['has', 'point_count']}
            layout={{
              "icon-image": "cluster-icon", // 위에서 등록한 이름
              "icon-size": 0.8, // 아이콘 크기 조절
              "icon-allow-overlap": true, // 겹쳐도 표시
            }}
          />
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
          {isLayerVisible && viewport.zoom > 10 && (
            <Layer
              id="unclustered-point"
              type="circle"
              filter={['!', ['has', 'point_count']]}
              paint={{ 'circle-color': '#f87111', 'circle-radius': 12 }}
            />
          )}
        </Source>
        {isLayerVisible &&
          viewport.zoom > 10 &&
          data?.content.map((f: any) => (
            <p>ㅇ</p>
            // <Marker key={f.festivalId} longitude={f.mapx} latitude={f.mapy} anchor="bottom">
            //   {/* <div className="bg-white p-2 rounded shadow flex items-center gap-1">
            //     <span className="text-sm font-semibold">{f.title}</span>
            //     {f.isNew && (
            //       <span className="w-4 h-4 text-xs text-white bg-red-500 rounded-full flex items-center justify-center">
            //         N
            //       </span>
            //     )}
            //   </div> */}
            //   <div className="w-12 h-12 rounded-full flex items-center justify-center"
            //     style={{
            //       background: 'radial-gradient(circle, rgba(254,94,41,0.4) 0%, rgba(254,94,41,0) 100%)'
            //     }}
            //   >
            //     <span className="text-white font-bold text-xs">N</span>
            //   </div>
            // </Marker>

          ))}
      </Map>

    </div >
  );
}



// <Layer
//             id='clusters' //클릭 이벤트 판별용으로 추가한 id
//             type='circle' //레이어 타입. circle, symbol, line, fill 등이 있음
//             source='points' //데이터를 가져올 소스 id
//             filter={['has', 'point_count']}
//             paint={{
//               'circle-color': '#3b82f6',
//               'circle-radius': ['step', ['get', 'point_count'], 20, 5, 30, 10, 40],
//               'circle-stroke-width': 2,
//               'circle-stroke-color': '#fff',
//             }}

//           />
//           {/* Cluster 숫자 */}
//           <Layer
//             id='cluster-count'
//             type='symbol'
//             source='points'
//             filter={['has', 'point_count']}
//             layout={{
//               'text-field': '{point_count_abbreviated}', //기본제공. 클러스터 내 포인트 카운팅
//               //TODO: 폰트 지정 가능
//               'text-size': 12,
//             }}
//           />
// 개별 포인트
// <Layer
//   id='unclustered-point'
//   type='circle'
//   source='points'
//   filter={['!', ['has', 'point_count']]}
//   paint={{
//     'circle-color': '#f87171',
//     'circle-radius': metersToPixels(100, viewport.latitude, viewport.zoom), // 10m 기준
//     'circle-stroke-width': 2,
//     'circle-stroke-color': '#fff',
//     'circle-opacity': 0.2,
//   }}

// />
// <Layer
//   id='unclustered-point-label'
//   type='symbol'
//   filter={['!', ['has', 'point_count']]}
//   layout={{
//     'text-field': ['get', 'name'], // GeoJSON properties.name 사용
//     'text-size': 12,
//     'text-offset': [0, 1.5], // 원 아래로 위치
//     'text-anchor': 'top',
//   }}
//   paint={{
//     'text-color': '#000',
//   }}
// />
// <Layer
//   id="circle-colored"
//   type="circle"
//   paint={{
//     'circle-radius': 50,
//     'circle-color': [
//       'case',
//       ['==', ['%', ['get', 'status'], 3], 0], '#ef4444',  // 나머지 0 → 빨강
//       ['==', ['%', ['get', 'status'], 3], 1], '#facc15',  // 나머지 1 → 노랑
//       '#22c55e',                                            // 나머지 2 → 초록
//     ],
//     'circle-opacity': 0.4,
//   }}
// />