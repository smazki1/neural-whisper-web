import type React from "react";

interface ShinyButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  target?: string;
  rel?: string;
  className?: string;
  ariaLabel?: string;
}

export function ShinyButton({
  children,
  onClick,
  href,
  target,
  rel,
  className = "",
  ariaLabel,
}: ShinyButtonProps) {
  const content = <span>{children}</span>;

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        onClick={onClick}
        aria-label={ariaLabel}
        className={`shiny-cta ${className}`}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={`shiny-cta ${className}`}
    >
      {content}
    </button>
  );
}
