"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface QuestionStatsCardsProps {
  totals: {
    sessions: number;
    questions: number;
    suggestedClicks: number;
    freeText: number;
  };
  themesUsed: Array<{ theme: string; count: number }>;
  hrInterests: Array<{ category: string; count: number }>;
  mostAsked: Array<{ question: string; count: number }>;
}

interface TotalGroupProps {
  label: string;
  value: number;
}

function TotalGroup({ label, value }: TotalGroupProps) {
  return (
    <div className="flex items-baseline gap-2 px-4 first:pl-0">
      <span className="text-[12px] uppercase tracking-wide text-fg-subtle">
        {label}
      </span>
      <span className="font-mono tnum text-[16px] text-fg">{value}</span>
    </div>
  );
}

function HorizontalBar({
  value,
  max,
}: {
  value: number;
  max: number;
}) {
  const ratio = max > 0 ? Math.max(0.04, value / max) : 0;
  return (
    <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-panel-soft">
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-0 rounded-full bg-accent-soft"
        style={{ width: `${(ratio * 100).toFixed(2)}%` }}
      />
    </div>
  );
}

export function QuestionStatsCards({
  totals,
  themesUsed,
  hrInterests,
  mostAsked,
}: QuestionStatsCardsProps) {
  const interestMax = hrInterests.reduce((m, r) => Math.max(m, r.count), 0);
  const askedMax = mostAsked.reduce((m, r) => Math.max(m, r.count), 0);

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Totals strip — single horizontal row, no card grid. */}
      <div className="col-span-12">
        <div
          className={cn(
            "flex flex-wrap items-baseline divide-x divide-border rounded-md border border-border bg-panel px-4 py-3"
          )}
        >
          <TotalGroup label="Sessions" value={totals.sessions} />
          <TotalGroup label="Questions" value={totals.questions} />
          <TotalGroup label="Curated clicks" value={totals.suggestedClicks} />
          <TotalGroup label="Free-text" value={totals.freeText} />
        </div>
      </div>

      {/* Most asked */}
      <section className="col-span-12 md:col-span-7">
        <h2 className="mb-2 text-[13px] font-medium uppercase tracking-wide text-fg-subtle">
          Most asked
        </h2>
        {mostAsked.length === 0 ? (
          <p className="text-[13.5px] text-fg-subtle">No questions yet.</p>
        ) : (
          <ul className="divide-y divide-border rounded-md border border-border bg-panel">
            {mostAsked.slice(0, 5).map((row) => (
              <li
                key={row.question}
                className="flex items-center gap-3 px-3 py-2 text-[13.5px] transition-colors hover:bg-panel-soft"
              >
                <span className="min-w-0 flex-1 truncate text-fg">
                  {row.question}
                </span>
                <span className="font-mono tnum text-[12.5px] text-fg-muted">
                  {row.count}
                </span>
                <div className="hidden w-24 sm:block">
                  <HorizontalBar value={row.count} max={askedMax} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Interest mix */}
      <section className="col-span-12 md:col-span-5">
        <h2 className="mb-2 text-[13px] font-medium uppercase tracking-wide text-fg-subtle">
          Interest mix
        </h2>
        {hrInterests.length === 0 ? (
          <p className="text-[13.5px] text-fg-subtle">No curated clicks yet.</p>
        ) : (
          <ul className="flex flex-col gap-2 rounded-md border border-border bg-panel p-3">
            {hrInterests.map((row) => (
              <li
                key={row.category}
                className="grid grid-cols-[1fr_auto] items-center gap-2"
              >
                <div className="flex items-center justify-between gap-2 text-[13.5px]">
                  <span className="truncate text-fg">{row.category}</span>
                  <span className="font-mono tnum text-[12.5px] text-fg-muted">
                    {row.count}
                  </span>
                </div>
                <div className="col-span-2">
                  <HorizontalBar value={row.count} max={interestMax} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Themes used — text badges only. */}
      <section className="col-span-12">
        <h2 className="mb-2 text-[13px] font-medium uppercase tracking-wide text-fg-subtle">
          Themes used
        </h2>
        {themesUsed.length === 0 ? (
          <p className="text-[13.5px] text-fg-subtle">No theme data yet.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {themesUsed.map((row) => (
              <span
                key={row.theme}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-panel-soft px-2.5 py-1 text-[12.5px] text-fg-muted"
              >
                <span>{row.theme || "(unknown)"}</span>
                <span
                  aria-hidden="true"
                  className="h-3 w-px bg-border"
                />
                <span className="font-mono tnum text-fg">{row.count}</span>
              </span>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default QuestionStatsCards;
