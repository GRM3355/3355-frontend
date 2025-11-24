import { SendSolid, X } from "@mynaui/icons-react";
import { useState, type InputHTMLAttributes, type ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  defaultStyle?: string;
  focusStyle?: string;
  completeStyle?: string;
  disabledStyle?: string;
  isDisabled?: boolean;
  className?: string;
  icon?: ReactNode;
  showClear?: boolean;
  onClear?: () => void; // 삭제 버튼 클릭 시 콜백
  onSend?: () => void; //전송 등
}

export default function Input({
  className = "",
  icon,
  defaultStyle = "",
  focusStyle = "",
  completeStyle = "",
  disabledStyle = "",
  isDisabled = false,
  showClear,
  onClear,
  onSend,
  ...rest
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const currentClass = isDisabled
    ? disabledStyle
    : isFocused
      ? focusStyle
      : rest.value
        ? completeStyle
        : defaultStyle;

  const isComplete = !!rest.value;

  return (
    <>
      <div className="flex w-full items-center gap-2">
        <div className={`flex flex-1 items-center gap-1.5 ${currentClass}`}>
          {icon && <div className="text-icon-border-primary">{icon}</div>}
          <input
            {...rest}
            disabled={isDisabled}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={(e) => {
              if (e.nativeEvent.isComposing) return; //한글 입력 중복 문제 해결용

              if (e.key === "Enter" && rest.value && onSend) {
                e.preventDefault();
                e.stopPropagation();
                onSend();
              }
            }}
            className="focus:outline-none focus:ring-0 flex-1"
          />

          {isComplete && showClear && (
            <X onClick={onClear}
              className="w-5 h-5 p-1 text-white bg-icon-container-secondary rounded-full" />
          )}
        </div>
        {(isFocused || rest.value) && onSend && <SendSolid size={38} className="bg-orange-50 text-text-brand rounded-full p-1"
          onClick={() => onSend()} />}
      </div>
    </>

  );
}
