import { type ReactElement } from "react";

const defaultStyles = "font-semibold flex justify-center hover:cursor-pointer";

// Single source of truth for variants. Adding a new variant = one new key here.
// The "primary" | "secondary" union type below is derived from these keys,
// so ButtonProps and variantStyles can never drift out of sync.
const variantStyles = {
  primary: "theme-button-primary",
  secondary: "theme-button-secondary",
} satisfies Record<string, string>;

// Same idea for sizes — one object, one place to edit.
const sizeStyles = {
  sm: "p-1.5 rounded-md",
  default: "px-2 py-2 rounded-lg",
  lg: "px-6 py-3 rounded-lg",
  submit: "w-full px-2 py-2 rounded-lg",
} satisfies Record<string, string>;

// `keyof typeof ...` pulls the type directly from the objects above.
// Add "warning: '...'" to variantStyles and Variant updates automatically.
export type Variant = keyof typeof variantStyles;
export type Size = keyof typeof sizeStyles;

export interface ButtonProps {
  variant: Variant;
  size: Size;
  text?: string;
  startIcon?: ReactElement;
  endIcon?: ReactElement;
  onClickfn?: () => void;
  loading?: boolean;
  full?: boolean;
}

export default function ButtonElement({
  variant,
  size,
  text,
  startIcon,
  endIcon,
  onClickfn,
  loading,
  full,
}: ButtonProps) {
  // Combine all class pieces, filtering out any that don't apply.
  const className = [
    defaultStyles,
    variantStyles[variant],
    sizeStyles[size],
    loading && "opacity-60",
    full ? "w-full" : "w-auto",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button onClick={onClickfn} className={className}>
      {startIcon}
      <p>{text}</p>
      {endIcon}
    </button>
  );
}