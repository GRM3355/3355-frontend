import React from 'react'
import { Marker, type MarkerEvent, type ViewState } from 'react-map-gl/mapbox'
import type { SinglePoint } from './MyMap'
import { metersToPixels } from '@/utils/map';

type SinglePointProps = {
  viewport: ViewState;
  singlePoints: SinglePoint[];
  onClickPoint: (festivalPoint: SinglePoint) => void;
}

export default function SinglePoints({ viewport, singlePoints, onClickPoint }: SinglePointProps) {
  const circleColor = {
    upcoming: "bg-alpha-gray-16",
    low: "bg-alpha-green-16",
    medium: "bg-alpha-yellow-16",
    high: "bg-alpha-pink-16"
  };

  return (
    <>
      {singlePoints?.map((point, i) => (
        <Marker
          key={`${i}_${point.id}`}
          longitude={point.longitude}
          latitude={point.latitude}
          anchor="center"
        >
          <div className="relative"
            onClick={(e) => {
              e.stopPropagation();
              onClickPoint(point);
            }}>
            {/* 큰 원 */}
            <div
              className={`${circleColor[point.status]} rounded-full z-0 absolute top-[50%] left-[50%]`}
              style={{
                width: `${metersToPixels(1000, viewport.latitude, viewport.zoom)}px`,
                height: `${metersToPixels(1000, viewport.latitude, viewport.zoom)}px`,
                transform: 'translate(-50%, -50%)',
                transition: 'width 0.3s ease, height 0.3s ease',
              }}
            ></div>
            {/* 작은 원 */}
            <div
              className={`w-10 h-10 ${circleColor[point.status]} rounded-full absolute top-[50%] left-[50%] z-10`}
              style={{ transform: 'translate(-50%, -50%)' }}
            ></div>
          </div>
        </Marker>
      ))}
      {/* 텍스트 */}
      {singlePoints?.map((point, i) => (
        <Marker
          key={`${i}_${point.id}`}
          longitude={point.longitude}
          latitude={point.latitude}
          anchor="center"
          className='z-0 '
        // onClick={() => onClickPoint(point.id, point.longitude, point.latitude)}
        >
          <div className='relative'
            onClick={(e) => {
              e.stopPropagation();
              onClickPoint(point);
            }}>
            {/* 원 모양 */}


            {/* 말풍선 */}
            <div
              className="absolute w-max h-max top-[50%] left-[50%] bg-white rounded-2 p-2 z-10"
              style={{ transform: 'translate(8px, -50%)', zIndex: 9999 }}
            >
              {point.name}
            </div>
          </div>

        </Marker>
      ))}
    </>
  )
}
