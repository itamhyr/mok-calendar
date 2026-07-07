"use client";

import { useMemo, useState } from "react";
import Calendar from "@/components/Calendar";
import Card from "@/components/Card";
import BottomSheet from "@/components/BottomSheet";
import {
  jalaliDateKey,
  jalaliMonthLength,
  jalaliMonthNames,
  shiftJalaliMonth,
  toJalali,
} from "@/lib/jalali";
import events from "@/data/events.json";

type EventItem = {
  title: string;
  description: string;
  category?: string;
  year?: string;
};

type DayData = {
  events?: EventItem[];
  history?: EventItem[];
};

const eventsData = events as Record<string, DayData>;

export default function Home() {
  const [selected, setSelected] = useState<EventItem | null>(null);

  const today = useMemo(() => {
    const now = new Date();
    return toJalali(now.getFullYear(), now.getMonth() + 1, now.getDate());
  }, []);

  // The month/year currently displayed in the calendar grid (navigable).
  const [viewJy, setViewJy] = useState(today.jy);
  const [viewJm, setViewJm] = useState(today.jm);

  // The day the user has selected. Defaults to today. The two cards below
  // always reflect this date, not necessarily the real "today".
  const [selectedJy, setSelectedJy] = useState(today.jy);
  const [selectedJm, setSelectedJm] = useState(today.jm);
  const [selectedJd, setSelectedJd] = useState(today.jd);

  const isCurrentMonth = viewJy === today.jy && viewJm === today.jm;
  const isTodaySelected =
    selectedJy === today.jy && selectedJm === today.jm && selectedJd === today.jd;

  const selectedKey = jalaliDateKey(selectedJy, selectedJm, selectedJd);
  const selectedData = eventsData[selectedKey];

  const goPrevMonth = () => {
    const { jy, jm } = shiftJalaliMonth(viewJy, viewJm, -1);
    setViewJy(jy);
    setViewJm(jm);
    // Keep the same day-of-month selected when possible, clamped to the
    // new month's length (e.g. day 31 -> 30 in a shorter month).
    const clampedDay = Math.min(selectedJd, jalaliMonthLength(jy, jm));
    setSelectedJy(jy);
    setSelectedJm(jm);
    setSelectedJd(clampedDay);
  };

  const goNextMonth = () => {
    const { jy, jm } = shiftJalaliMonth(viewJy, viewJm, 1);
    setViewJy(jy);
    setViewJm(jm);
    const clampedDay = Math.min(selectedJd, jalaliMonthLength(jy, jm));
    setSelectedJy(jy);
    setSelectedJm(jm);
    setSelectedJd(clampedDay);
  };

  const handleSelectDay = (day: number) => {
    setSelectedJy(viewJy);
    setSelectedJm(viewJm);
    setSelectedJd(day);
  };

  return (
    <main className="min-h-screen max-w-md mx-auto px-5 pt-8 pb-12 flex flex-col gap-5">
      <Calendar
        jy={viewJy}
        jm={viewJm}
        isCurrentMonth={isCurrentMonth}
        todayDay={today.jd}
        selectedDay={
          selectedJy === viewJy && selectedJm === viewJm ? selectedJd : null
        }
        onPrevMonth={goPrevMonth}
        onNextMonth={goNextMonth}
        onSelectDay={handleSelectDay}
      />

      {!isTodaySelected && (
        <p className="text-[12px] font-medium text-accent text-center -mt-2">
          نمایش مناسبت‌های {selectedJd} {jalaliMonthNames[selectedJm - 1]}
        </p>
      )}

      <Card
        icon="📅"
        title="مناسبت‌های امروز"
        items={selectedData?.events ?? []}
        onSelect={setSelected}
      />

      <Card
        icon="📜"
        title="در چنین روزی"
        items={selectedData?.history ?? []}
        onSelect={setSelected}
      />

      <BottomSheet item={selected} onClose={() => setSelected(null)} />
    </main>
  );
}
