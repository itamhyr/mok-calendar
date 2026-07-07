"use client";

import { AnimatePresence, motion } from "framer-motion";

type EventItem = {
  title: string;
  description: string;
  category?: string;
  year?: string;
};

const labelMap: Record<string, string> = {
  iran: "ایران",
  world: "جهان",
  history: "تاریخ",
};

export default function BottomSheet({
  item,
  onClose,
}: {
  item: EventItem | null;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {item && (
        <>
          <motion.div
            key="backdrop"
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <motion.div
            key="sheet"
            className="fixed bottom-0 left-0 right-0 z-50 glass-strong rounded-t-[32px] px-6 pt-3 shadow-2xl"
            style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 32px)" }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.55 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100 || info.velocity.y > 500) onClose();
            }}
          >
            <div className="w-9 h-1.5 rounded-full bg-black/15 dark:bg-white/25 mx-auto mb-6" />

            {(item.category || item.year) && (
              <div className="mb-3">
                <span className="inline-block text-[11px] font-bold text-accent bg-accent/10 rounded-full px-3 py-1 tabular-nums">
                  {item.year ? item.year : labelMap[item.category ?? ""] ?? item.category}
                </span>
              </div>
            )}

            <h3 className="text-[20px] font-bold leading-snug mb-3">
              {item.title}
            </h3>

            <p className="text-[14.5px] leading-[1.9] opacity-70">
              {item.description}
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
