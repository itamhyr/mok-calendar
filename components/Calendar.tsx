"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  jalaliMonthLength,
  jalaliMonthNames,
  jalaliWeekDaysShort,
  jsDayToPersianColumn,
  toGregorian,
} from "@/lib/jalali";

export default function Calendar({
  jy,
  jm,
  isCurrentMonth,
  todayDay,
  selectedDay,
  onPrevMonth,
  onNextMonth,
  onSelectDay,
}: {
  jy: number;
  jm: number;
  isCurrentMonth: boolean;
  todayDay: number;
  selectedDay: number | null;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onSelectDay: (day: number) => void;
}) {
  const monthLen = jalaliMonthLength(jy, jm);

  // Find which column (0=Saturday..6=Friday) the 1st of the month falls on
  const firstGreg = toGregorian(jy, jm, 1);
  const firstJsDate = new Date(firstGreg.gy, firstGreg.gm - 1, firstGreg.gd);
  const firstColumn = jsDayToPersianColumn(firstJsDate.getDay());

  const cells: (number | null)[] = [
    ...Array(firstColumn).fill(null),
    ...Array.from({ length: monthLen }, (_, i) => i + 1),
  ];

  // Track navigation direction purely for the transition animation — no
  // change to the component's external contract.
  const prevKeyRef = useRef(jy * 100 + jm);
  const [direction, setDirection] = useState(1);
  useEffect(() => {
    const key = jy * 100 + jm;
    setDirection(key > prevKeyRef.current ? 1 : -1);
    prevKeyRef.current = key;
  }, [jy, jm]);

  return (
    <div className="glass rounded-xl3 p-5 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between mb-5">
        {/* Right side in RTL: goes to the previous (older) month */}
        <button
          onClick={onPrevMonth}
          aria-label="ماه قبل"
          className="w-9 h-9 flex items-center justify-center rounded-full surface-soft active:scale-90 transition-transform text-[16px]"
        >
          ›
        </button>

        <AnimatePresence mode="wait">
          <motion.h1
            key={`${jy}-${jm}`}
            className="text-[19px] font-bold tabular-nums"
            initial={{ opacity: 0, y: direction > 0 ? 6 : -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: direction > 0 ? -6 : 6 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            {jalaliMonthNames[jm - 1]} {jy}
          </motion.h1>
        </AnimatePresence>

        {/* Left side in RTL: goes to the next (newer) month */}
        <button
          onClick={onNextMonth}
          aria-label="ماه بعد"
          className="w-9 h-9 flex items-center justify-center rounded-full surface-soft active:scale-90 transition-transform text-[16px]"
        >
          ‹
        </button>
      </div>

      <div className="grid grid-cols-7 text-center mb-1">
        {jalaliWeekDaysShort.map((d, i) => (
          <div
            key={i}
            className="text-[11px] opacity-40 font-semibold pb-2 tracking-wide"
          >
            {d}
          </div>
        ))}
      </div>

      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={`${jy}-${jm}`}
            custom={direction}
            initial={{ opacity: 0, x: direction > 0 ? 28 : -28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -28 : 28 }}
            transition={{ duration: 0.24, ease: [0.32, 0.72, 0, 1] }}
            className="grid grid-cols-7 gap-y-1.5"
          >
            {cells.map((day, idx) => {
              const isToday = isCurrentMonth && day === todayDay;
              const isSelected = day === selectedDay;
              return (
                <div
                  key={idx}
                  className="flex items-center justify-center py-0.5"
                >
                  {day && (
                    <button
                      onClick={() => onSelectDay(day)}
                      className={`relative w-10 h-10 flex items-center justify-center rounded-full text-[14px] transition-transform active:scale-90 ${
                        isToday && isSelected
                          ? "bg-accent text-white font-bold accent-glow"
                          : isToday
                          ? "bg-accent text-white font-semibold shadow-[0_0_16px_rgba(10,132,255,0.5)]"
                          : isSelected
                          ? "glass accent-glow text-accent font-bold"
                          : "font-normal opacity-90"
                      }`}
                    >
                      {day}
                    </button>
                  )}
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
