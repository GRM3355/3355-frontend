import { useEffect, useMemo, useRef, useState } from 'react';
import MapGL, { Source, Layer, Marker } from 'react-map-gl/mapbox';
import type { MapRef, ViewState } from 'react-map-gl/mapbox';
import type { FeatureCollection, Point } from 'geojson';
import type { FestivalAPI } from '@/types/api';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { GeoJSONFeature } from 'mapbox-gl';
import { Circle, CircleSolid, Target } from '@mynaui/icons-react';
import { metersToPixels } from '@/utils/map';
import { useAsyncError } from 'react-router-dom';
import SinglePoints from './SinglePoints';
import GroupPoints from './GroupPoints';
import { isFestivalActive } from '@/utils/date';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

type MyMapProps = {
  data?: FestivalAPI[];
  onSelectFestival: (data: FestivalAPI) => void;
  isShowBottomSheet: boolean;
  onShowBottomSheet: () => void;
  onCloseBottomSheet: () => void;
  onSearchFestivalByLocation: (state: ViewState) => void;
}

export type SinglePoint = {
  id: number;
  longitude: number;
  latitude: number;
  name: string;
  status: 'upcoming' | 'low' | 'medium' | 'high';
}

export type GroupPoint = {
  longitude: number;
  latitude: number;
  points: SinglePoint[];
};

export default function MyMap({
  data,
  onSelectFestival,
  isShowBottomSheet,
  onShowBottomSheet,
  onCloseBottomSheet,
  onSearchFestivalByLocation }: MyMapProps) {
  const mapRef = useRef<MapRef>(null);
  //유저 실제 위치 좌표 
  const [myViewport, setMyViewport] = useState<ViewState>({
    latitude: 37.5681,
    longitude: 126.9696,
    zoom: 14,
  } as ViewState);

  //화면 움직일때의 좌표
  const [viewport, setViewport] = useState<ViewState>({
    latitude: 37.5681,
    longitude: 126.9696,
    zoom: 14,
  } as ViewState);

  const [selectedFestivalPoint, setSeletedFestivalPoint] = useState<SinglePoint | null>(null);

  // 클러스터 색깔 정보
  const [showColorInfo, setShowColorInfo] = useState<boolean>(false);

  // GeoJSON으로 변환
  const geoJsonPoints: FeatureCollection<Point, { id: number; name: string }> = useMemo(() => ({
    type: 'FeatureCollection',
    features: data?.map(festival => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [festival.lon, festival.lat] },
      properties: {
        id: festival.festivalId, name: festival.title, ㅜㅜ: festival.totalParticipantCount,
        status: !isFestivalActive(festival.eventStartDate, festival.eventEndDate)
          ? 'upcoming'
          : festival.totalParticipantCount >= 3
            ? 'high'
            : festival.totalParticipantCount >= 2
              ? 'medium'
              : 'low'
      }
    })) ?? [],
  }), [data]);

  // 클러스터가 아닌 포인트만 담을 state
  const [singlePoints, setSinglePoints] = useState<SinglePoint[]>();
  const [groupPoints, setGroupPoints] = useState<GroupPoint[]>();

  const handleResearchFestival = () => {
    console.log(viewport);
    onSearchFestivalByLocation(viewport);
    handleSetPoints();
  }

  const handleSetPoints = () => {
    if (!mapRef.current || !mapRef.current.isStyleLoaded()) return;

    const points = mapRef.current.querySourceFeatures('points', {
      filter: ['!', ['has', 'point_count']]
    }) ?? [];

    const singlePoints: SinglePoint[] = points
      .filter(
        (f): f is GeoJSONFeature & { geometry: { type: 'Point'; coordinates: [number, number] }; properties: { id: number; name: string } } =>
          f.geometry.type === 'Point' && f.properties?.id != null && typeof f.properties.name === 'string'
      )
      .map(f => ({
        id: f.properties.id,
        name: f.properties.name,
        longitude: f.geometry.coordinates[0],
        latitude: f.geometry.coordinates[1],
        status: f.properties.status
      }));

    //중복 제거
    const uniqueSinglePoints = Array.from(
      new Map(singlePoints.map(p => [p.id, p])).values()
    );


    const groupMap = new Map<string, GroupPoint>();

    uniqueSinglePoints.forEach(point => {
      const key = `${point.longitude.toFixed(6)}_${point.latitude.toFixed(6)}`;
      if (!groupMap.has(key)) {
        groupMap.set(key, { longitude: point.longitude, latitude: point.latitude, points: [point] });
      } else {
        groupMap.get(key)?.points.push(point);
      }
    });

    //그룹에 있는 포인트는 개별 포인트에서 제외
    const filteredSinglePoints = uniqueSinglePoints.filter(point => {
      const key = `${point.longitude.toFixed(6)}_${point.latitude.toFixed(6)}`;
      return groupMap.get(key)!.points.length === 1; // 
    });

    const filteredGroupPoints = [...groupMap.values()].filter(g => g.points.length > 1);
    console.log(filteredGroupPoints);

    setSinglePoints(filteredSinglePoints);
    setGroupPoints(filteredGroupPoints);
  }

  const handleClickPoint = (festivalPoint: SinglePoint) => {


    if (!isShowBottomSheet)
      onShowBottomSheet();
    else if (isShowBottomSheet && selectedFestivalPoint?.id == festivalPoint.id)
      onCloseBottomSheet();

    setSeletedFestivalPoint(festivalPoint);
    const selectedFestival = data?.find(
      (f: FestivalAPI) => f.festivalId == festivalPoint.id
    );

    console.log("festivalId", festivalPoint.id);
    console.log("selectedFestival", selectedFestival);


    if (selectedFestival) {
      onSelectFestival(selectedFestival);
    }

    handleFlyTo(festivalPoint.longitude, festivalPoint.latitude, 16);
  }

  const handleFlyTo = (lon: number, lat: number, zoom: number, center?: boolean) => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [lon, lat],
        zoom,
        speed: 2,
        curve: 1.42,
        offset: center ? [0, 0] : [0, -window.innerHeight * 0.18]
      });
    }
  }

  const handleGoMyPos = () => {
    handleFlyTo(myViewport.longitude, myViewport.latitude, myViewport.zoom, true);
    onCloseBottomSheet();
  }

  return (
    <div className="relative w-full h-full">
      <MapGL
        ref={mapRef}
        initialViewState={viewport}
        mapStyle="mapbox://styles/mapbox/light-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
        style={{ width: '100%', height: '100%' }}
        interactiveLayerIds={['clusters', 'unclustered-point']}
        onClick={() => onCloseBottomSheet()}
        onMoveEnd={(evt) => setViewport(evt.viewState)}
        onLoad={(evt) => {
          const map = evt.target;
          if (!mapRef.current) return;

          if (map.hasImage("cluster-icon")) return;

          map.loadImage('/cluster.png', (error, image) => {
            if (error || !image) {
              console.error("이미지 로드 실패:", error);
              return;
            }

            map.addImage("cluster-icon", image);
            console.log("클러스터 아이콘 등록 완료");
          });

          handleSetPoints();
        }}
        onZoomEnd={() => {
          handleSetPoints();
        }}
      >
        <Source
          id="points"
          type="geojson"
          data={geoJsonPoints}
          cluster={true}
          clusterMaxZoom={6}
          clusterRadius={40}
        >
          {/* 클러스터 심볼 */}
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
            id="clusters-count"
            type="symbol"
            source="points"
            filter={['has', 'point_count']}
            layout={{
              'text-field': '{point_count_abbreviated}',
              'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
              'text-size': 12,
            }}
          />
        </Source>
        {singlePoints && <SinglePoints viewport={viewport} singlePoints={singlePoints} onClickPoint={handleClickPoint} />}
        {groupPoints && <GroupPoints viewport={viewport} groupPoints={groupPoints} onClickPoint={handleClickPoint}
          isShowBottomSheet={isShowBottomSheet} />}

        {/* 내위치 */}
        <Marker
          longitude={myViewport.longitude}
          latitude={myViewport.latitude}>
          <CircleSolid size={12} className='z-999' />
        </Marker>
      </MapGL>
      {/* 클러스터 색깔 정보 */}
      <div className='absolute w-max h-max top-0 left-0'
        onClick={() => setShowColorInfo(prev => !prev)}>
        <p className='absolute top-5 left-5 w-6 h-6 bg-white text-center self-center'>i</p>
        {showColorInfo && (
          <>
            <div className='absolute top-10 left-10 w-max h-max bg-white '>
              <p>매우 혼잡</p>
              <p>보통 혼잡</p>
              <p>여유 있음</p>
              <p>예정 축제</p>
            </div>
          </>
        )}

      </div>
      {/* 재검색 버튼 */}
      <span className='absolute top-0 left-1/2 -translate-x-1/2 border bg-alpha-black-38'
        onClick={() => handleResearchFestival()}>이 지역 재검색</span>
      {/* 현재 위치로 이동 */}
      <Target size={32} className={`absolute ${isShowBottomSheet ? "bottom-100" : "bottom-16"} right-0 bg-white`}
        onClick={() => handleGoMyPos()} />
    </div >
  );
}