"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { QuestionStatsCards } from "@/components/QuestionStatsCards";
import { AnalyticsTable, type AnalyticsLogRow } from "@/components/AnalyticsTable";
import { cn } from "@/lib/utils";

interface AdminTotals {
  sessions: number;
  questions: number;
  suggestedClicks: number;
  freeText: number;
}

interface AdminData {
  isFirestoreConfigured: boolean;
  totals: AdminTotals;
  mostAsked: Array<{ question: string; count: number }>;
  latest: AnalyticsLogRow[];
  themesUsed: Array<{ theme: string; count: number }>;
  hrInterests: Array<{ category: string; count: number }>;
}

const EMPTY: AdminData = {
  isFirestoreConfigured: false,
  totals: { sessions: 0, questions: 0, suggestedClicks: 0, freeText: 0 },
  mostAsked: [],
  latest: [],
  themesUsed: [],
  hrInterests: [],
};

function LoginForm({ onAuthed }: { onAuthed: () => void }) {
  const [password, setPassword] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    setSubmitting(true);
    setErrorMessage(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.status === 200) {
        onAuthed();
        return;
      }
      if (res.status === 401) {
        setErrorMessage("That password isn't right.");
      } else {
        setErrorMessage("Login is currently unavailable.");
      }
    } catch {
      setErrorMessage("Network error. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-4 pt-12">
      <div className="flex flex-col gap-1">
        <h1 className="text-[19px] font-semibold text-fg">Admin sign in</h1>
        <p className="text-[13.5px] text-fg-muted">
          Restricted to Sharan and review collaborators.
        </p>
      </div>
      <form onSubmit={submit} className="flex flex-col gap-3">
        <label className="flex flex-col gap-1 text-[12.5px] uppercase tracking-wide text-fg-subtle">
          <span>Password</span>
          <input
            type="password"
            value={password}
            autoFocus
            onChange={(e) => setPassword(e.target.value)}
            className={cn(
              "rounded-md border border-border bg-panel px-3 py-2 text-[14px] text-fg",
              "focus:border-border-strong focus:outline-none"
            )}
            autoComplete="current-password"
          />
        </label>
        {errorMessage ? (
          <div className="text-[13px] text-danger" role="alert">
            {errorMessage}
          </div>
        ) : null}
        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={submitting || !password}
        >
          {submitting ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </div>
  );
}

function StatsSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="h-12 animate-pulse rounded-md bg-panel-soft" />
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 h-32 animate-pulse rounded-md bg-panel-soft md:col-span-7" />
        <div className="col-span-12 h-32 animate-pulse rounded-md bg-panel-soft md:col-span-5" />
      </div>
      <div className="h-48 animate-pulse rounded-md bg-panel-soft" />
    </div>
  );
}

export function AdminDashboard() {
  const [authed, setAuthed] = React.useState<boolean>(false);
  const [data, setData] = React.useState<AdminData>(EMPTY);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [fetchError, setFetchError] = React.useState<string | null>(null);

  const loadData = React.useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await fetch("/api/admin/data", { cache: "no-store" });
      if (res.status === 401) {
        setAuthed(false);
        return;
      }
      if (!res.ok) {
        setFetchError("Couldn't load analytics.");
        return;
      }
      const json = (await res.json()) as AdminData;
      setData(json);
    } catch {
      setFetchError("Couldn't load analytics.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Try fetching on mount; if it succeeds (cookie still valid) we're already authed.
  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/admin/data", { cache: "no-store" });
        if (cancelled) return;
        if (res.status === 401) {
          setAuthed(false);
          return;
        }
        if (res.ok) {
          const json = (await res.json()) as AdminData;
          setData(json);
          setAuthed(true);
        }
      } catch {
        // ignore; user can sign in manually
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  React.useEffect(() => {
    if (authed) void loadData();
  }, [authed, loadData]);

  const handleSignOut = async () => {
    try {
      await fetch("/api/admin/login", { method: "DELETE" });
    } catch {
      // ignore
    }
    setAuthed(false);
    setData(EMPTY);
  };

  if (!authed) {
    return <LoginForm onAuthed={() => setAuthed(true)} />;
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <header className="flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <h1 className="text-[24px] font-semibold leading-tight text-fg">
            Recruiter signals
          </h1>
          <p className="text-[13.5px] text-fg-muted">
            What hiring teams asked, and what surfaced.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={loadData}
            disabled={loading}
          >
            {loading ? "Refreshing…" : "Refresh"}
          </Button>
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            Sign out
          </Button>
        </div>
      </header>

      {!data.isFirestoreConfigured ? (
        <div className="rounded-md border border-border bg-panel-soft px-3 py-2 text-[13px] text-fg-muted">
          Analytics will appear once Firebase env vars are set.
        </div>
      ) : null}

      {fetchError ? (
        <div className="rounded-md border border-border px-3 py-2 text-[13px] text-danger">
          {fetchError}
        </div>
      ) : null}

      {loading && data.totals.questions === 0 ? (
        <StatsSkeleton />
      ) : (
        <>
          <QuestionStatsCards
            totals={data.totals}
            themesUsed={data.themesUsed}
            hrInterests={data.hrInterests}
            mostAsked={data.mostAsked}
          />
          <AnalyticsTable rows={data.latest} />
        </>
      )}
    </div>
  );
}

export default AdminDashboard;
