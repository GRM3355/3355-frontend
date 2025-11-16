import React, { useState } from 'react'
import { Marker, type ViewState } from 'react-map-gl/mapbox'
import type { GroupPoint, SinglePoint } from './MyMap'
import { metersToPixels } from '@/utils/map';

type GroupPointsProps = {
  viewport: ViewState;
  groupPoints: GroupPoint[];
  onClickPoint: (festivalPoint: SinglePoint) => void;
  isShowBottomSheet: boolean;
}

export default function GroupPoints({ viewport, groupPoints, onClickPoint, isShowBottomSheet }: GroupPointsProps) {
  const [color, setColor] = useState<string>("bg-alpha-violet-16");

  const circleColor = {
    upcoming: "bg-alpha-gray-16",
    low: "bg-alpha-green-16",
    medium: "bg-alpha-yellow-16",
    high: "bg-alpha-pink-16"
  };



  return (
    <>
      {groupPoints?.map((point, i) => (
        <Marker
          key={`${i}`}
          longitude={point.longitude}
          latitude={point.latitude}
          anchor="center"

        >
          <div className="relative"
            onClick={(e) => {
              e.stopPropagation();
              onClickPoint(point.points[0]);
            }}>
            {/* 큰 원 */}
            <div
              className={`${(isShowBottomSheet && color) ? color : "bg-alpha-violet-16"} rounded-full z-0 absolute top-[50%] left-[50%]`}
              style={{
                width: `${metersToPixels(1000, viewport.latitude, viewport.zoom)}px`,
                height: `${metersToPixels(1000, viewport.latitude, viewport.zoom)}px`,
                transform: 'translate(-50%, -50%)',
                transition: 'width 0.3s ease, height 0.3s ease',
              }}
            ></div>
            {/* 작은 원 */}
            <div
              className={`w-10 h-10 ${(isShowBottomSheet && color) ? color : "bg-alpha-violet-16"} rounded-full absolute top-[50%] left-[50%] z-10`}
              style={{ transform: 'translate(-50%, -50%)' }}
            ></div>
          </div>
        </Marker>
      ))}
      {/* 텍스트 */}
      {groupPoints?.map((point, i) => (
        <Marker
          key={`${i}`}
          longitude={point.longitude}
          latitude={point.latitude}
          anchor="center"
          className='z-0'
        >
          <div className='relative'
            onClick={(e) => {
              e.stopPropagation();
              onClickPoint(point.points[0]);
            }}>
            {/* 말풍선 */}
            <div
              className="absolute w-max h-max top-[50%] left-[50%] bg-white rounded-2 p-2 z-10"
              style={{ transform: 'translate(8px, -50%)', zIndex: 9999 }}
            >
              {point.points[0].name} + {point.points.length}
            </div>

          </div>

          {/* 다른축제 */}
          {isShowBottomSheet && (
            <div className="absolute w-max h-max top-[50%] left-[50%] "
              style={{ transform: 'translate(8px, -130%)', zIndex: 9999 }}>
              {point.points.map((p, i) => (
                <div className='flex gap-1 bg-gray-50 rounded-4 p-2 z-10'>
                  <span className={`${circleColor[p.status]} w-4 h-4`}></span>
                  <span key={i} className=''
                    onClick={(e) => {
                      e.stopPropagation();
                      onClickPoint(p);
                      setColor(circleColor[p.status]);
                    }}
                  >{p.name}</span>
                </div>

              ))}
            </div>
          )}

        </Marker>
      ))}
    </>
  )
}
