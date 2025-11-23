import type { ReactNode } from "react";


interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "brand" | "default" | "error";
  size?: "sm" | "md" | "lg";
  className?: string;
  children: ReactNode;
}

export default function Button({
  variant = "default",
  size = "md",
  className = "",
  children,
  disabled = false,
  ...rest
}: ButtonProps) {

  const variants = {
    brand: "bg-surface-container-brand-1 text-text-inverse",
    default: "bg-state-interacion-container-default text-text-primary border border-line-border-primary",
    error: "bg-state-interacion-container-error text-text-inverse",
  };

  const sizes = {
    sm: "p-1 label1-sb h-[38px]",
    md: "p-2 label4-sb h-[38px]",
    lg: "label1-sb h-[48px]",
  };

  return (
    // <button {...rest} className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}>
    <button {...rest} disabled={disabled}
      className={` ${className ? "" : "w-full"} rounded-2 hover:brightness-90
    ${variants[variant]} ${sizes[size]} ${className}
    disabled:bg-state-interacion-container-disabled disabled:text-text-disabled`}>

      {children}
    </button>
  );
}
