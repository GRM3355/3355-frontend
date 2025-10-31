import React from 'react'

type RoomItemProps = {
  room: string;
}

export default function RoomItem({ room }: RoomItemProps) {
  return (
    <div>{room}</div>
  )
}
