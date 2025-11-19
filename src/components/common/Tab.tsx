import { useEffect, useRef, useState } from "react";

export type TabItem = {
  key: string;
  label: string;
}

type TabProps = {
  items: Array<{ key: string, label: string }>
  selected: string;
  onSelect: (key: string) => void;
}

export default function Tab({ items, selected, onSelect }: TabProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scroll = scrollRef.current;
    if (!scroll) return;

    const onWheel = (e: WheelEvent) => {
      console.log("wheel fired", e.deltaY);
      if (e.deltaY === 0) return; // 세로 스크롤 감지
      e.preventDefault(); //패시브 모드에서는 금지
      scroll.scrollLeft += e.deltaY; // 세로휠 가로로
    };

    scroll.addEventListener("wheel", onWheel, { passive: false });
    return () => scroll.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <>
      <div
        ref={scrollRef}
        className='flex h-max m-4 overflow-x-auto whitespace-nowrap scrollbar-hide'>
        {items.map((item: TabItem) => (
          <div key={item.key} className="flex flex-col w-max h-max">
            <span
              className={`p-2 cursor-pointer snap-start h-9 
                      ${selected === item.key ? "text-text-brand label1-sb" : "text-text-primary label2-r"}`}
              onClick={() => onSelect(item.key)}>
              {item.label}</span>
            {selected === item.key && <span className="w-full h-1 bg-text-brand rounded-full" />}
          </div>
        ))}
      </div>
    </>
  )
}
