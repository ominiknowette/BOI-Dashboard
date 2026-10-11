import React, { Suspense } from "react";
import { DashboardClientLayout } from "./DashboardClientLayout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-canvas flex flex-col items-center justify-center p-8 gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/boi-impact-mark-transparent.png"
            alt="Bank of Industry"
            width={48}
            height={48}
            className="w-12 h-12 object-contain animate-pulse"
          />
          <span className="text-deep-green text-sm font-semibold">
            Loading Bank of Industry Impact Intelligence Portal...
          </span>
        </div>
      }
    >
      <DashboardClientLayout>{children}</DashboardClientLayout>
    </Suspense>
  );
}
