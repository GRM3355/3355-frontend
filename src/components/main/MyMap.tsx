import { useEffect, useMemo, useRef, useState } from 'react';
import MapGL, { Source, Layer, Marker } from 'react-map-gl/mapbox';
import type { MapRef, ViewState } from 'react-map-gl/mapbox';
import type { FeatureCollection, Point } from 'geojson';
import type { FestivalAPI } from '@/types/api';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { GeoJSONFeature } from 'mapbox-gl';
import { ChevronDownLeftSolid, Circle, CircleSolid, InfoCircle, InfoTriangleSolid, Target, Triangle } from '@mynaui/icons-react';
import { metersToPixels } from '@/utils/map';
import { useAsyncError } from 'react-router-dom';
import SinglePoints from './SinglePoints';
import GroupPoints from './GroupPoints';
import { isFestivalActive } from '@/utils/date';
import ZoneInfoItem from './ZoneInfoItem';

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

    setSinglePoints(filteredSinglePoints);
    setGroupPoints(filteredGroupPoints);
  }

  const handleClickPoint = (festivalPoint: SinglePoint) => {


    if (!isShowBottomSheet)
      onShowBottomSheet();
    else if (isShowBottomSheet && selectedFestivalPoint?.id == festivalPoint.id)
      handleCloseBottomSheet();

    setSeletedFestivalPoint(festivalPoint);

    const selectedFestival = data?.find(
      (f: FestivalAPI) => f.festivalId == festivalPoint.id
    );

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
    handleCloseBottomSheet();
  }

  const handleCloseBottomSheet = () => {
    setSeletedFestivalPoint(null);
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
        onClick={(evt) => {
          const features = evt.features;
          if (!features) return;

          const cluster = features.find(f => f.layer?.id === 'clusters');

          if (cluster && cluster.geometry.type === 'Point') {
            const [longitude, latitude] = cluster.geometry.coordinates;

            mapRef.current?.flyTo({
              center: [longitude, latitude],
              zoom: 16, // 원하는 줌 레벨
            });
          }

          handleCloseBottomSheet();
        }}
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
          clusterMaxZoom={13}
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
        {singlePoints && <SinglePoints selectedFestivalId={selectedFestivalPoint?.id ?? null}
          viewport={viewport} singlePoints={singlePoints} onClickPoint={handleClickPoint} />}
        {groupPoints && <GroupPoints selectedFestivalId={selectedFestivalPoint?.id ?? null}
          viewport={viewport} groupPoints={groupPoints} onClickPoint={handleClickPoint}
          isShowBottomSheet={isShowBottomSheet} onCloseBottomSheet={handleCloseBottomSheet} />}

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
        <InfoCircle size={30} className='absolute top-4 left-4 bg-white text-center self-center rounded-full floating p-1' />
        {showColorInfo && (
          <>
            <div className='absolute top-16 left-8 w-max h-max flex flex-col gap-1 bg-white rounded-4 tooltip p-3 rounded-tl-none'>
              <ZoneInfoItem label="매우 혼잡" info='(0,000 ~ 0,000)' />
              <ZoneInfoItem color="bg-state-zone-yellow-primary" label="보통 혼잡" info='(0,000 ~ 0,000)' />
              <ZoneInfoItem color="bg-state-zone-green-primary" label="보통 혼잡" info='(0,000 ~ 0,000)' />
              <ZoneInfoItem color="bg-state-zone-gray-primary" label="예정 축제" />
              <hr className='text-line-divider-primary my-2' />
              <p className='caption3-r text-text-tertiary'>* 인원수 기준</p>
              <ChevronDownLeftSolid className='absolute -top-3 -left-2 text-white' />
            </div>
          </>
        )}

      </div>
      {/* 재검색 버튼 */}
      <span className='absolute top-4 left-1/2 -translate-x-1/2 label5-r
        bg-surface-overlay-chip chip rounded-full text-basic-100 px-3.5 py-1.5'
        onClick={() => handleResearchFestival()}>이 지역 재검색</span>
      {/* 현재 위치로 이동 */}
      <img src="/Target.svg" alt="target" className={`absolute ${isShowBottomSheet ? "bottom-100" : "bottom-16"} 
      right-3 bg-white p-2.5 rounded-full floating`}
        onClick={() => handleGoMyPos()} />

    </div >
  );
}