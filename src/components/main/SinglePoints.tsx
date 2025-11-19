import { Marker, type MarkerEvent, type ViewState } from 'react-map-gl/mapbox'
import type { SinglePoint } from './MyMap'
import { metersToPixels } from '@/utils/map';
import { ChevronUpLeftSolid, LocationHomeSolid } from '@mynaui/icons-react';

type SinglePointProps = {
  selectedFestivalId?: number | null;
  viewport: ViewState;
  singlePoints: SinglePoint[];
  onClickPoint: (festivalPoint: SinglePoint) => void;
}

export default function SinglePoints({ selectedFestivalId, viewport, singlePoints, onClickPoint }: SinglePointProps) {
  const circleColor = {
    upcoming: "bg-alpha-gray-16",
    low: "bg-alpha-green-16",
    medium: "bg-alpha-yellow-16",
    high: "bg-alpha-pink-16"
  };

  const circleColorStrong = {
    upcoming: "bg-state-zone-gray-secondary",
    low: "bg-state-zone-green-secondary",
    medium: "bg-state-zone-yellow-secondary",
    high: "bg-state-zone-pink-secondary"
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
            {selectedFestivalId == point.id ? (
              <>
                {/* 중간 원 */}
                <div
                  className={`w-15 h-15 ${circleColor[point.status]} rounded-full absolute top-[50%] left-[50%] z-10`}
                  style={{ transform: 'translate(-50%, -50%)' }}
                ></div>
                {/* 작은 원 */}
                <div
                  className={`w-11 h-11 ${circleColorStrong[point.status]} rounded-full absolute top-[50%] left-[50%] z-10`}
                  style={{ transform: 'translate(-50%, -50%)' }}
                ></div>
                <LocationHomeSolid size={24} className='text-white absolute top-[50%] left-[50%] z-10'
                  style={{ transform: 'translate(-50%, -50%)' }} />
              </>
            ) : (
              <>
                {/* 중간 원 */}
                <div
                  className={`w-[34px] h-[34px] ${circleColor[point.status]} rounded-full absolute top-[50%] left-[50%] z-10`}
                  style={{ transform: 'translate(-50%, -50%)' }}
                ></div>
                {/* 작은 원 */}
                <div
                  className={`w-[18px] h-[18px] ${circleColorStrong[point.status]} rounded-full absolute top-[50%] left-[50%] z-10`}
                  style={{ transform: 'translate(-50%, -50%)' }}
                ></div>
              </>
            )}

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
            {/* 말풍선 */}
            <div
              className={`absolute w-max h-max ${selectedFestivalId == point.id ? "bottom-10" : "bottom-6"} left-0 bg-white rounded-3 rounded-bl-none p-2 z-10 tooltip`}
            // style={{ transform: 'translate(8px, -50%)', zIndex: 9999 }}
            >
              {point.name}
              <ChevronUpLeftSolid className='absolute -bottom-3 -left-[7px] text-white' />
            </div>
          </div>

        </Marker>
      ))}
    </>
  )
}
