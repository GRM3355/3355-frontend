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
  ...rest
}: ButtonProps) {

  const variants = {
    brand: "bg-surface-container-brand-1 text-text-inverse",
    default: "bg-state-interacion-container-default text-text-primary border border-line-border-primary",
    error: "bg-state-interacion-container-error text-text-inverse",
  };

  const sizes = {
    sm: "p-1 text-sm",
    md: "p-2 text-base",
    lg: "px-5 py-3 text-lg",
  };

  return (
    // <button {...rest} className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}>
    <button {...rest} className={`w-full rounded-2 hover:brightness-90 
    ${variants[variant]} ${sizes[size]} ${className}`}>

      {children}
    </button>
  );
}
