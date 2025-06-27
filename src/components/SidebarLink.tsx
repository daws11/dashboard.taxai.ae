"use client";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ReactNode } from "react";

interface SidebarLinkProps {
  href: string;
  label: string;
  icon: ReactNode;
  active?: boolean;
  onClick?: () => void;
  tooltip?: string;
}

/**
 * SidebarLink - Komponen link sidebar dengan tooltip, active & hover state.
 */
export default function SidebarLink({ href, label, icon, active = false, onClick, tooltip }: SidebarLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={[
        "flex items-center gap-3 px-4 py-2 rounded font-medium transition-colors group",
        active
          ? "bg-blue-100 dark:bg-blue-800 text-blue-900 dark:text-white shadow"
          : "text-blue-700 dark:text-blue-200 hover:bg-blue-50 dark:hover:bg-blue-800 hover:text-blue-900 dark:hover:text-white",
        "focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
      ].join(" ")}
    >
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <span className="group-hover:scale-110 transition-transform">{icon}</span>
        </TooltipTrigger>
        {tooltip && <TooltipContent side="right">{tooltip}</TooltipContent>}
      </Tooltip>
      <span>{label}</span>
    </Link>
  );
} 