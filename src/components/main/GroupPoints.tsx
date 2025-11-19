import React, { useEffect, useState } from 'react'
import { Marker, type ViewState } from 'react-map-gl/mapbox'
import type { GroupPoint, SinglePoint } from './MyMap'
import { metersToPixels } from '@/utils/map';
import { ChevronUpLeftSolid, LocationHomeSolid } from '@mynaui/icons-react';

type GroupPointsProps = {
  selectedFestivalId?: number | null;
  viewport: ViewState;
  groupPoints: GroupPoint[];
  onClickPoint: (festivalPoint: SinglePoint) => void;
  isShowBottomSheet: boolean;
  onCloseBottomSheet: () => void;
}

export default function GroupPoints({ selectedFestivalId, viewport, groupPoints, onClickPoint,
  isShowBottomSheet, onCloseBottomSheet }: GroupPointsProps) {
  const [status, setStatus] = useState<string>('');

  const circleColor: Record<string, string> = {
    upcoming: "bg-alpha-gray-16",
    low: "bg-alpha-green-16",
    medium: "bg-alpha-yellow-16",
    high: "bg-alpha-pink-16"
  };

  const circleColorStrong: Record<string, string> = {
    upcoming: "bg-state-zone-gray-secondary",
    low: "bg-state-zone-green-secondary",
    medium: "bg-state-zone-yellow-secondary",
    high: "bg-state-zone-pink-secondary"
  };

  const handleClick = (point: SinglePoint) => {
    if (point.id == selectedFestivalId) {
      onClickPoint(point);
      setStatus('');
    }
    else {
      onClickPoint(point);
      setStatus(point.status);
    }
  }

  const handleClickCircle = (point: SinglePoint) => {
    if (!isShowBottomSheet) {
      onClickPoint(point);
    }
    else {
      onCloseBottomSheet();
      setStatus('');
    }
  }

  return (
    <>
      {groupPoints?.map((point, i) => {
        const isSelected = point.points.some(p => p.id === selectedFestivalId);
        const mainPoint = point.points[0];

        return (
          <Marker
            key={`${i}`}
            longitude={point.longitude}
            latitude={point.latitude}
            anchor="center"
            className='bg-state-zone-violet-secondary'
          >
            <div className="relative"
              onClick={(e) => {
                e.stopPropagation();
                handleClickCircle(mainPoint);
              }}>
              {/* 큰 원 */}
              <div
                className={`${!isShowBottomSheet ? "bg-alpha-violet-16" : status ? circleColor[status] : circleColor[mainPoint.status]} 
                rounded-full z-0 absolute top-[50%] left-[50%]`}
                style={{
                  width: `${metersToPixels(1000, viewport.latitude, viewport.zoom)}px`,
                  height: `${metersToPixels(1000, viewport.latitude, viewport.zoom)}px`,
                  transform: 'translate(-50%, -50%)',
                  transition: 'width 0.3s ease, height 0.3s ease',
                }}
              ></div>
              {isShowBottomSheet ? (
                <>
                  {/* 중간 원 */}
                  <div
                    className={`w-15 h-15 ${(isShowBottomSheet && status) ? circleColor[status] : circleColor[mainPoint.status]} rounded-full absolute top-[50%] left-[50%] z-10`}
                    style={{ transform: 'translate(-50%, -50%)' }}
                  ></div>
                  {/* 작은 원 */}
                  <div
                    className={`w-11 h-11 ${(isShowBottomSheet && status) ? circleColorStrong[status] : circleColorStrong[mainPoint.status]} rounded-full absolute top-[50%] left-[50%] z-10`}
                    style={{ transform: 'translate(-50%, -50%)' }}
                  ></div>
                  <LocationHomeSolid size={24} className='text-white absolute top-[50%] left-[50%] z-10'
                    style={{ transform: 'translate(-50%, -50%)' }} />
                </>
              ) : (
                <>
                  {/* 중간 원 */}
                  <div
                    className={`w-[34px] h-[34px] ${(isShowBottomSheet && status) ? circleColor[status] : "bg-alpha-violet-16"} rounded-full absolute top-[50%] left-[50%] z-10`}
                    style={{ transform: 'translate(-50%, -50%)' }}
                  ></div>
                  {/* 작은 원 */}
                  <div
                    className={`w-[18px] h-[18px] ${(isShowBottomSheet && status) ? circleColorStrong[status] : "bg-state-zone-violet-secondary"} rounded-full absolute top-[50%] left-[50%] z-10`}
                    style={{ transform: 'translate(-50%, -50%)' }}
                  ></div>
                </>
              )}

            </div>
          </Marker>
        )
      })}
      {/* 텍스트 */}
      {groupPoints?.map((point, i) => {
        return (
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
                handleClick(point.points[0]);
                // onClickPoint();
              }}>
              {/* 말풍선 */}
              <div
                className={`absolute w-max h-max ${isShowBottomSheet ? "bottom-10" : "bottom-6"} 
                left-0 bg-white rounded-3 rounded-bl-none p-2 z-10 tooltip`}>
                <span className='label4-sb text-primary'>{point.points[0].name}</span>
                <span className='label4-sb text-state-zone-violet-text'> +{point.points.length}</span>
                <ChevronUpLeftSolid className='absolute -bottom-3 -left-[7px] text-white' />
              </div>
              {/* 다른축제 */}

              {isShowBottomSheet && (
                <div className={`absolute w-max h-max bottom-21 left-0 bg-white tooltip rounded-3 z-100 p-1`}>
                  {point.points.map((p, i) => (
                    <div className='flex gap-2 bg-gray-50 rounded-4 p-2 z-10 items-center'>
                      <span className={`${circleColorStrong[p.status]} w-2.5 h-2.5 rounded-full`}></span>
                      <span key={i} className={`${p.id == selectedFestivalId ? "label4-sb" : "label5-r"} text-primary`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClick(p);
                        }}

                      >{p.name}</span>

                    </div>
                  ))}
                </div>
              )}
            </div>
          </Marker>
        )
      })}
    </>
  )
}
