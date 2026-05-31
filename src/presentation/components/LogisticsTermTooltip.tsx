"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import type { LogisticsTooltipKey } from "@/presentation/constants/logisticsTooltips";
import { useLanguage } from "@/presentation/i18n/LanguageContext";

const VIEWPORT_MARGIN = 12;
const GAP = 10;
const MAX_TOOLTIP_WIDTH = 280;
const MAX_TOOLTIP_HEIGHT_VH = 0.4;

function HelpCircleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <path d="M12 17h.01" />
    </svg>
  );
}

type Placement = "top" | "bottom";

interface TooltipPosition {
  top: number;
  left: number;
  placement: Placement;
  maxWidth: number;
  maxHeight: number;
}

interface LogisticsTermTooltipProps {
  title: string;
  description: string;
  titleClassName?: string;
  iconOnly?: boolean;
  ariaLabel?: string;
}

export function LogisticsTermTooltip({
  title,
  description,
  titleClassName = "text-sm font-medium text-slate-700",
  iconOnly = false,
  ariaLabel,
}: LogisticsTermTooltipProps) {
  const anchorRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState<TooltipPosition | null>(null);

  const computePosition = useCallback((): TooltipPosition | null => {
    const anchor = anchorRef.current;
    const tooltip = tooltipRef.current;
    if (!anchor) return null;

    const rect = anchor.getBoundingClientRect();
    const maxWidth = Math.min(
      MAX_TOOLTIP_WIDTH,
      window.innerWidth - VIEWPORT_MARGIN * 2,
    );
    const maxHeight = Math.min(
      window.innerHeight * MAX_TOOLTIP_HEIGHT_VH,
      window.innerHeight - VIEWPORT_MARGIN * 2,
    );

    const width = tooltip?.offsetWidth ?? maxWidth;
    const height = Math.min(tooltip?.offsetHeight ?? 0, maxHeight) || 1;

    let left = rect.left + rect.width / 2;
    left = Math.max(
      VIEWPORT_MARGIN + width / 2,
      Math.min(left, window.innerWidth - VIEWPORT_MARGIN - width / 2),
    );

    const spaceBelow = window.innerHeight - rect.bottom - GAP - VIEWPORT_MARGIN;
    const spaceAbove = rect.top - GAP - VIEWPORT_MARGIN;
    let placement: Placement = "bottom";
    let top = rect.bottom + GAP;

    if (spaceBelow < height && spaceAbove > spaceBelow) {
      placement = "top";
      top = rect.top - GAP - height;
    }

    top = Math.max(
      VIEWPORT_MARGIN,
      Math.min(top, window.innerHeight - height - VIEWPORT_MARGIN),
    );

    return { top, left, placement, maxWidth, maxHeight };
  }, []);

  const show = useCallback(() => {
    const anchor = anchorRef.current;
    if (anchor) {
      const rect = anchor.getBoundingClientRect();
      const maxWidth = Math.min(
        MAX_TOOLTIP_WIDTH,
        window.innerWidth - VIEWPORT_MARGIN * 2,
      );
      setPosition({
        top: rect.bottom + GAP,
        left: rect.left + rect.width / 2,
        placement: "bottom",
        maxWidth,
        maxHeight:
          window.innerHeight * MAX_TOOLTIP_HEIGHT_VH - VIEWPORT_MARGIN * 2,
      });
    }
    setVisible(true);
  }, []);

  const hide = useCallback(() => {
    setVisible(false);
    setPosition(null);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (!visible) return;
    const next = computePosition();
    if (next) setPosition(next);
  }, [visible, computePosition, description, title]);

  useEffect(() => {
    if (!visible) return;
    const reposition = () => {
      const next = computePosition();
      if (next) setPosition(next);
    };
    window.addEventListener("resize", reposition);
    window.addEventListener("scroll", reposition, true);
    return () => {
      window.removeEventListener("resize", reposition);
      window.removeEventListener("scroll", reposition, true);
    };
  }, [visible, computePosition]);

  const tooltipNode =
    visible && mounted && position ? (
      <div
        ref={tooltipRef}
        role="tooltip"
        className="pointer-events-none fixed z-[9999] overflow-y-auto rounded-xl border border-slate-600/80 bg-slate-900 px-3.5 py-3 text-left text-white shadow-2xl transition-opacity duration-200 ease-out"
        style={{
          top: position.top,
          left: position.left,
          maxWidth: position.maxWidth,
          maxHeight: position.maxHeight,
          width: `min(${position.maxWidth}px, calc(100vw - ${VIEWPORT_MARGIN * 2}px))`,
          transform: "translateX(-50%)",
        }}
      >
        <p className="mb-1.5 text-xs font-semibold leading-snug text-slate-100">
          {title}
        </p>
        <p className="text-xs leading-relaxed text-slate-200 [overflow-wrap:anywhere]">
          {description}
        </p>
        <span
          className={`absolute left-1/2 h-2.5 w-2.5 -translate-x-1/2 rotate-45 border-slate-600/80 bg-slate-900 ${
            position.placement === "bottom"
              ? "-top-1 border-l border-t"
              : "-bottom-1 border-b border-r"
          }`}
          aria-hidden
        />
      </div>
    ) : null;

  return (
    <span className="inline-flex items-center gap-1.5">
      {!iconOnly && <span className={titleClassName}>{title}</span>}
      <span
        ref={anchorRef}
        role="button"
        tabIndex={0}
        className="inline-flex shrink-0 cursor-help rounded-full p-0.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
        aria-label={ariaLabel ?? title}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            show();
          }
        }}
      >
        <HelpCircleIcon className="h-4 w-4" />
      </span>
      {mounted && tooltipNode
        ? createPortal(tooltipNode, document.body)
        : null}
    </span>
  );
}

interface LogisticsTermLabelProps {
  term: LogisticsTooltipKey;
  titleClassName?: string;
  displayTitle?: string;
}

export function LogisticsTermLabel({
  term,
  titleClassName,
  displayTitle,
}: LogisticsTermLabelProps) {
  const { t } = useLanguage();
  const { title, description } = t.tooltips[term];
  const resolvedTitle = displayTitle ?? title;
  return (
    <LogisticsTermTooltip
      title={resolvedTitle}
      description={description}
      titleClassName={titleClassName}
      ariaLabel={t.tooltipAria(resolvedTitle)}
    />
  );
}
