"use client";

type EventItem = {
  title: string;
  description: string;
  category?: string;
  year?: string;
};

export default function Card({
  icon,
  title,
  items,
  onSelect,
}: {
  icon: string;
  title: string;
  items: EventItem[];
  onSelect: (item: EventItem) => void;
}) {
  return (
    <div className="glass rounded-xl3 p-5 shadow-sm">
      <div className="flex items-center gap-2.5 mb-4">
        <span className="w-8 h-8 flex items-center justify-center rounded-full bg-accent/10 text-[15px]">
          {icon}
        </span>
        <h2 className="text-[15px] font-bold">{title}</h2>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
          <span className="text-[22px] opacity-30">◌</span>
          <p className="text-[13px] opacity-40">
            موردی برای نمایش وجود ندارد
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((item, idx) => (
            <button
              key={idx}
              onClick={() => onSelect(item)}
              className="w-full text-right rounded-2xl px-4 py-3.5 surface-soft active:scale-[0.98] transition-transform"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-[14px] font-medium leading-relaxed">
                  {item.title}
                </span>
                {item.year && (
                  <span className="text-[11px] shrink-0 text-accent font-bold tabular-nums bg-accent/10 rounded-full px-2 py-0.5">
                    {item.year}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
