import React from "react";

export function BoiLogo({ className = "h-9 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Institutional geometric emblem inspired by Nigerian industrial growth */}
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-9 w-9 shrink-0"
        aria-hidden="true"
      >
        <rect width="40" height="40" rx="8" fill="#0B4738" />
        {/* Tiered industrial growth towers with BOI gold accent */}
        <path d="M9 29V21H14V29H9Z" fill="#C59A32" />
        <path d="M17 29V15H23V29H17Z" fill="#FFFFFF" />
        <path d="M26 29V11H31V29H26Z" fill="#C59A32" />
        {/* Foundation baseline */}
        <rect x="7" y="30.5" width="26" height="2" rx="1" fill="#FFFFFF" opacity="0.8" />
      </svg>
      <div className="flex flex-col justify-center leading-tight">
        <div className="flex items-center gap-1.5">
          <span className="font-serif font-bold text-[18px] tracking-tight text-boi-green-deep">
            BOI
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-boi-gold bg-boi-gold-light px-1.5 py-0.5 rounded-xs border border-boi-gold/20">
            EST. 1959
          </span>
        </div>
        <span className="text-[11px] font-medium tracking-normal text-boi-text-muted">
          BANK OF INDUSTRY
        </span>
      </div>
    </div>
  );
}
