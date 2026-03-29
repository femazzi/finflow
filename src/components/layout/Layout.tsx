import React from "react";
import Sidebar from "./Sidebar";
import type { Month } from "../../types";

interface LayoutProps {
  children: React.ReactNode;
  months: Month[];
  selectedMonthId: string | null;
  onSelectMonth: (id: string | null) => void;
  onDeleteMonth: (id: string) => void;
  onOpenAddMonth: () => void;
}

export default function Layout({
  children,
  months,
  selectedMonthId,
  onSelectMonth,
  onDeleteMonth,
  onOpenAddMonth,
}: LayoutProps) {
  return (
    <div className="bg-transparent min-h-screen relative w-full overflow-x-hidden">
      <Sidebar
        months={months}
        selectedMonthId={selectedMonthId}
        onSelectMonth={onSelectMonth}
        onDeleteMonth={onDeleteMonth}
        onOpenAddMonth={onOpenAddMonth}
      />
      <main className="min-h-screen relative z-10 px-8 py-10" style={{ paddingLeft: "calc(256px + 2rem)" }}>
        {children}
      </main>
    </div>
  );
}
