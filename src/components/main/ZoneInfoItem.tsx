import React from 'react'

type ZoneInfoItem = {
  color?: string;
  label: string;
  info?: string;
}
export default function ZoneInfoItem({ color, label, info }: ZoneInfoItem) {
  return (
    <>
      <div className='flex items-center'>
        <p className={`w-2.5 h-2.5 ${color ? color : "bg-state-zone-pink-primary"} rounded-full`} />
        <p className='label4-sb text-primary pl-1'>{label}</p>
        {info && <p className='label5-r text-text-tertiary'>{info}</p>}
      </div>
    </>
  )
}
