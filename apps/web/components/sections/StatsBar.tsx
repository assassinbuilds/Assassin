"use client";
type Stat = {
  value: string;
  label: string;
};

const StatsBar = ({ stats }: { stats: Stat[] }) => (
  <div className="mx-auto grid max-w-6xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
    {stats.map((stat, index) => (
      <div
        key={stat.label}
        className="rounded-lg border border-slate-200 bg-white p-6 text-center shadow-[0_24px_70px_-52px_rgba(15,23,42,0.75)]"
      >
        <p className={`text-4xl font-black ${index === 1 ? "text-blue-500" : index === 2 ? "text-emerald-500" : "text-red-600"}`}>
          {stat.value}
        </p>
        <p className="mt-2 text-xs font-black uppercase tracking-[0.18em] text-slate-500">
          {stat.label}
        </p>
      </div>
    ))}
  </div>
);

export default StatsBar;

