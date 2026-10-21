"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="flex items-center gap-1.5 text-xs text-slate-500 py-2">
      <Link href="/dashboard" className="hover:text-slate-900 flex items-center gap-1">
        <Home className="w-3.5 h-3.5" />
        <span>AICTE</span>
      </Link>
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <React.Fragment key={idx}>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            {isLast || !item.href ? (
              <span className="font-medium text-slate-900 truncate max-w-xs">{item.label}</span>
            ) : (
              <Link href={item.href} className="hover:text-slate-900 truncate max-w-xs">
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
