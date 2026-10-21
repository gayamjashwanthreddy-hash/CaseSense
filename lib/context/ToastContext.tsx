"use client";

import React, { createContext, useContext, useState } from "react";
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "warning" | "error" | "info";

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextType {
  toast: (
    optionsOrTitle: string | { title: string; message?: string; type?: ToastType },
    type?: ToastType
  ) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = (
    optionsOrTitle: string | { title: string; message?: string; type?: ToastType },
    typeOverride?: ToastType
  ) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    let item: ToastItem;

    if (typeof optionsOrTitle === "string") {
      item = {
        id,
        title: optionsOrTitle,
        type: typeOverride || "success",
      };
    } else {
      item = {
        id,
        title: optionsOrTitle.title,
        message: optionsOrTitle.message,
        type: optionsOrTitle.type || "success",
      };
    }

    setToasts((prev) => [...prev, item]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast, removeToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-md border shadow-md transition-all duration-200 bg-white ${
              t.type === "success"
                ? "border-emerald-200 text-slate-800"
                : t.type === "warning"
                ? "border-amber-200 text-slate-800"
                : t.type === "error"
                ? "border-rose-200 text-slate-800"
                : "border-blue-200 text-slate-800"
            }`}
          >
            {t.type === "success" && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />}
            {t.type === "warning" && <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />}
            {t.type === "error" && <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />}
            {t.type === "info" && <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />}

            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-slate-900">{t.title}</div>
              {t.message && <div className="text-xs text-slate-600 mt-0.5 leading-relaxed">{t.message}</div>}
            </div>

            <button
              onClick={() => removeToast(t.id)}
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
