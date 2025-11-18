import { useState } from "react";

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
  return (
    <>
      <div className='flex h-max p-4 overflow-x-auto whitespace-nowrap scrollbar-hide snap-x'>
        {items.map((item: TabItem) => (
          <div key={item.key} className="flex flex-col w-max h-max">
            <span
              className={`p-2 cursor-pointer snap-start
                      ${selected === item.key ? "text-text-brand h-9 label1-sb" : "text-text-primary label2-r"}`}
              onClick={() => onSelect(item.key)}>
              {item.label}</span>
            {selected === item.key && <span className="w-full h-1 bg-text-brand rounded-full" />}
          </div>
        ))}
      </div>
    </>
  )
}
