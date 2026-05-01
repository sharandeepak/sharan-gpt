"use client";

import * as React from "react";
import { cn, formatRelative, truncate } from "@/lib/utils";

export interface AnalyticsLogRow {
  id: string;
  sessionId: string;
  question: string;
  response: string;
  source: string;
  theme: string;
  pagePath: string;
  createdAt: string | null;
}

export interface AnalyticsTableProps {
  rows: AnalyticsLogRow[];
}

function SourcePill({ source }: { source: string }) {
  const label = source || "unknown";
  return (
    <span className="inline-flex items-center rounded-sm border border-border bg-panel-soft px-1.5 py-0.5 font-mono text-[11px] text-fg-muted">
      {label}
    </span>
  );
}

export function AnalyticsTable({ rows }: AnalyticsTableProps) {
  const [openId, setOpenId] = React.useState<string | null>(null);

  return (
    <section>
      <h2 className="mb-2 text-[13px] font-medium uppercase tracking-wide text-fg-subtle">
        Recent questions
      </h2>
      <div className="overflow-hidden rounded-md border border-border bg-panel">
        <table className="w-full table-fixed border-collapse text-left text-[13.5px]">
          <colgroup>
            <col className="w-[120px]" />
            <col className="w-[140px]" />
            <col />
            <col className="w-[140px]" />
          </colgroup>
          <thead>
            <tr className="border-b border-border bg-panel-soft text-[12px] uppercase tracking-wide text-fg-subtle">
              <th className="px-3 py-2 text-right font-medium">When</th>
              <th className="px-3 py-2 font-medium">Source</th>
              <th className="px-3 py-2 font-medium">Question</th>
              <th className="px-3 py-2 font-medium">Theme</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-3 py-6 text-center text-fg-subtle"
                >
                  No questions yet.
                </td>
              </tr>
            ) : (
              rows.map((row) => {
                const expanded = openId === row.id;
                const when = row.createdAt
                  ? formatRelative(row.createdAt)
                  : "—";
                return (
                  <React.Fragment key={row.id}>
                    <tr
                      className={cn(
                        "cursor-pointer border-b border-border transition-colors hover:bg-panel-soft",
                        expanded && "bg-panel-soft"
                      )}
                      onClick={() =>
                        setOpenId((prev) => (prev === row.id ? null : row.id))
                      }
                    >
                      <td className="px-3 py-2 text-right font-mono tnum text-[12.5px] text-fg-muted">
                        {when}
                      </td>
                      <td className="px-3 py-2">
                        <SourcePill source={row.source} />
                      </td>
                      <td className="truncate px-3 py-2 text-fg">
                        {truncate(row.question, 60)}
                      </td>
                      <td className="px-3 py-2 font-mono text-[12px] text-fg-muted">
                        {row.theme || "—"}
                      </td>
                    </tr>
                    {expanded ? (
                      <tr className="border-b border-border bg-panel-soft">
                        <td colSpan={4} className="px-3 py-3">
                          <div className="flex flex-col gap-2 text-[13.5px]">
                            <div>
                              <div className="text-[11px] uppercase tracking-wide text-fg-subtle">
                                Question
                              </div>
                              <div className="text-fg">{row.question}</div>
                            </div>
                            <div>
                              <div className="text-[11px] uppercase tracking-wide text-fg-subtle">
                                Response
                              </div>
                              <div className="whitespace-pre-wrap text-fg-muted">
                                {row.response || "—"}
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-3 pt-1 font-mono text-[11px] text-fg-subtle">
                              <span>session: {row.sessionId || "—"}</span>
                              <span>path: {row.pagePath || "—"}</span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : null}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default AnalyticsTable;
