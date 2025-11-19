import { ChevronDown, ChevronUp } from "@mynaui/icons-react";
import { useState, type MouseEvent } from "react";

export type SelectItem = {
  key: string;
  label: string;
}

type SelectProps = {
  items: Array<{ key: string, label: string }>
  selected: string;
  onSelect: (key: string) => void;
}

export default function Select({ items, selected, onSelect }: SelectProps) {
  const [show, setShow] = useState<boolean>(false);

  const handleSelected = (e: MouseEvent, key: string) => {
    e.stopPropagation();
    setShow(false);
    onSelect(key);
  }

  const handleShow = (e: MouseEvent, b: boolean) => {
    e.stopPropagation();
    setShow(b);
  }

  return (
    <div className='relative'>
      {/* 외부 클릭시 닫히게 */}
      {show && (
        <div
          className="fixed inset-0"
          onClick={(e) => handleShow(e, false)}
        />
      )}
      {/* 기본 */}
      <div onClick={(e) => handleShow(e, !show)}
        className="flex items-center gap-1 lebel5-r text-text-primary">
        <span>{items.find(item => item.key === selected)?.label ?? items[0].label}</span>
        {show ? (<ChevronUp size={20} />) : (<ChevronDown size={20} />)}
      </div>
      {/* 선택지 */}
      {show &&
        <div className='absolute top-8 right-0 flex flex-col w-max bg-surface-bg-page p-4 sheet rounded-3 gap-2
        label5-r'>
          {items.map(item => (
            <span key={item.key} className={`${selected === item.key ? 'text-text-brand' : 'text-text-primary'}`}
              onClick={(e) => handleSelected(e, item.key)}>{item.label}</span>
          ))}
        </div>
      }
    </div>
  )
}
