import { SendSolid, X } from "@mynaui/icons-react";
import { useState, type ReactNode, type InputHTMLAttributes, type TextareaHTMLAttributes, useRef } from "react";

type InputType = "input" | "textarea";

interface BaseProps {
  defaultStyle?: string;
  focusStyle?: string;
  completeStyle?: string;
  disabledStyle?: string;
  isDisabled?: boolean;
  className?: string;
  icon?: ReactNode;
  showClear?: boolean;
  onClear?: () => void;
  onSend?: () => void;
  inputType?: InputType; // ★ input/textarea 구분
}

type InputProps =
  | (BaseProps & InputHTMLAttributes<HTMLInputElement>)
  | (BaseProps & TextareaHTMLAttributes<HTMLTextAreaElement>);

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

export default function Input({
  className = "",
  icon,
  defaultStyle = "",
  focusStyle = "",
  completeStyle = "",
  disabledStyle = "",
  isDisabled = false,
  inputType = "input",
  showClear,
  onClear,
  onSend,
  ...rest
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const currentClass = isDisabled
    ? disabledStyle
    : isFocused
      ? focusStyle
      : rest.value
        ? completeStyle
        : defaultStyle;

  const isComplete = !!rest.value;

  const handleResize = () => {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "24px"; // 초기 높이로 리셋
    el.style.height = `${el.scrollHeight}px`; // 내용에 맞게 자동 증가
  };

  return (
    <div className="flex w-full items-center gap-2 flex-nowrap">
      <div className={`flex flex-1 items-center gap-1.5 min-w-0 ${currentClass}`}>
        {icon && <div className="text-icon-border-primary">{icon}</div>}

        {inputType === "textarea" ? (
          <textarea
            ref={textareaRef}
            {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
            disabled={isDisabled}
            className="resize-none focus:outline-none focus:ring-0 w-full max-h-15"
            style={{ height: "24px" }}
            enterKeyHint="enter"
            onInput={() => handleResize()}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={(e) => {
              if (e.nativeEvent.isComposing) return;

              if (isMobile || e.shiftKey) {
                return;
              } else if (!isMobile && !e.shiftKey && rest.value && onSend) {
                e.preventDefault();
                onSend();
                const el = textareaRef.current;
                if (el) el.style.height = "38px";
              }
            }}
          />
        ) : (
          <>
            <input
              {...(rest as InputHTMLAttributes<HTMLInputElement>)}
              disabled={isDisabled}
              maxLength={20}
              className="flex-1 focus:outline-none focus:ring-0"
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={(e) => {
                if (e.nativeEvent.isComposing) return;
                if (e.key === "Enter" && rest.value && onSend) {
                  e.preventDefault();
                  onSend();
                }
              }}
            />
            {isComplete && showClear && (
              <X
                onClick={onClear}
                className="w-5 h-5 p-1 text-white bg-icon-container-secondary rounded-full shrink-0"
              />
            )}
          </>
        )}
      </div>
      {(isFocused || rest.value) && onSend && (
        <SendSolid
          size={38}
          className="bg-orange-50 text-text-brand rounded-full p-1 shrink-0 mt-auto"
          onClick={() => onSend()}
        />
      )}
    </div>
  );
}
