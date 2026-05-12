"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/useAuth";
import { getDashboardStats, type DashboardStats } from "@/lib/stats";
import { formatDate } from "@/lib/utils";

const quickActions = [
  { label: "Write Article", href: "/admin/articles/new", icon: "✎" },
  { label: "Post Notice", href: "/admin/notices/new", icon: "📌" },
  { label: "Create Event", href: "/admin/events/new", icon: "📅" },
  { label: "Add Page", href: "/admin/pages/new", icon: "▤" },
];

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed"));
  }, []);

  const cards = [
    {
      label: "Residents",
      value: stats?.counters.residents ?? "—",
      href: "/admin/residents",
      color: "bg-secondary",
      icon: "🏠",
    },
    {
      label: "Articles",
      value: stats ? `${stats.counters.articlesPublished} / ${stats.counters.articlesPublished + stats.counters.articlesDraft}` : "—",
      sublabel: stats ? "published / total" : undefined,
      href: "/admin/articles",
      color: "bg-primary",
      icon: "✎",
    },
    {
      label: "Pending Applications",
      value: stats?.counters.pendingApplications ?? "—",
      href: "/admin/applications/membership",
      color: "bg-warning",
      icon: "📋",
    },
    {
      label: "Unread Messages",
      value: stats?.counters.unreadMessages ?? "—",
      href: "/admin/messages",
      color: "bg-success",
      icon: "✉",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-primary">
          Hello, {user?.name?.split(" ")[0] ?? "Admin"} 👋
        </h1>
        <p className="text-muted mt-1">
          Here&apos;s what&apos;s happening with Kajla Society today.
        </p>
      </div>

      {error && (
        <div className="px-4 py-3 rounded bg-danger/10 border border-danger/30 text-danger text-sm">
          {error}
        </div>
      )}

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="bg-surface border border-border rounded-lg p-5 hover:shadow-md transition group"
          >
            <div
              className={`w-10 h-10 rounded-lg ${c.color} mb-3 grid place-items-center text-white text-lg`}
            >
              {c.icon}
            </div>
            <div className="text-3xl font-bold text-primary">{c.value}</div>
            <div className="text-xs text-muted mt-1 group-hover:text-secondary transition">
              {c.label} →
            </div>
            {c.sublabel && (
              <div className="text-[10px] text-muted mt-0.5">{c.sublabel}</div>
            )}
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="bg-surface border border-border rounded-lg p-6">
        <h2 className="font-semibold text-primary mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {quickActions.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg border border-border hover:border-secondary hover:bg-cream transition group"
            >
              <span className="text-2xl">{a.icon}</span>
              <span className="text-sm font-semibold text-primary group-hover:text-secondary">
                {a.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Pending breakdown */}
      {stats && stats.counters.pendingApplications > 0 && (
        <div className="bg-surface border border-border rounded-lg p-6">
          <h2 className="font-semibold text-primary mb-4">Pending Applications</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            <PendingCard
              label="Membership"
              count={stats.counters.pendingByType.membership}
              href="/admin/applications/membership"
            />
            <PendingCard
              label="Car Sticker"
              count={stats.counters.pendingByType.carSticker}
              href="/admin/applications/car-sticker"
            />
            <PendingCard
              label="Adoptions"
              count={stats.counters.pendingByType.adoption}
              href="/admin/applications/adoptions"
            />
          </div>
        </div>
      )}

      {/* Recent activity + system status */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-surface border border-border rounded-lg p-6">
          <h3 className="font-semibold text-primary mb-3">Recent Articles</h3>
          {stats && stats.recent.articles.length > 0 ? (
            <ul className="space-y-2">
              {stats.recent.articles.map((a) => (
                <li key={a.id} className="flex items-center justify-between text-sm">
                  <Link
                    href={`/admin/articles/${a.id}/edit`}
                    className="text-primary hover:text-secondary truncate flex-1 mr-3"
                  >
                    {a.title}
                  </Link>
                  <span className="text-xs text-muted whitespace-nowrap">
                    {a.isPublished ? (
                      <span className="text-success">● Live</span>
                    ) : (
                      <span className="text-warning">○ Draft</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted">No articles yet.</p>
          )}
          <Link
            href="/admin/articles"
            className="inline-block mt-4 text-xs text-secondary hover:underline"
          >
            View all →
          </Link>
        </div>

        <div className="bg-surface border border-border rounded-lg p-6">
          <h3 className="font-semibold text-primary mb-3">Recent Applicants</h3>
          {stats && stats.recent.membershipApplications.length > 0 ? (
            <ul className="space-y-2">
              {stats.recent.membershipApplications.map((m) => (
                <li key={m.id} className="flex items-center justify-between text-sm">
                  <Link
                    href={`/admin/applications/membership/${m.id}`}
                    className="text-primary hover:text-secondary truncate flex-1 mr-3"
                  >
                    {m.fullName}
                  </Link>
                  <span className="text-xs text-muted whitespace-nowrap">
                    {formatDate(m.createdAt)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted">No applications yet.</p>
          )}
          <Link
            href="/admin/applications/membership"
            className="inline-block mt-4 text-xs text-secondary hover:underline"
          >
            View all →
          </Link>
        </div>
      </div>

      {/* People + System status side-by-side */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-surface border border-border rounded-lg p-6">
          <h3 className="font-semibold text-primary mb-3">People</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between">
              <span className="text-muted">Total residents</span>
              <Link href="/admin/residents" className="text-primary font-semibold hover:text-secondary">
                {stats?.counters.residents ?? "—"}
              </Link>
            </li>
            <li className="flex justify-between">
              <span className="text-muted">Committee members</span>
              <Link href="/admin/committee" className="text-primary font-semibold hover:text-secondary">
                {stats?.counters.committeeMembers ?? "—"}
              </Link>
            </li>
          </ul>
        </div>
        <div className="bg-surface border border-border rounded-lg p-6">
          <h3 className="font-semibold text-primary mb-3">System Status</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between">
              <span className="text-muted">API</span>
              <span className="text-success font-semibold">● Online</span>
            </li>
            <li className="flex justify-between">
              <span className="text-muted">Database</span>
              <span className="text-success font-semibold">● Connected</span>
            </li>
            <li className="flex justify-between">
              <span className="text-muted">Your role</span>
              <span className="text-primary font-semibold">
                {user?.role.replace("_", " ")}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function PendingCard({
  label,
  count,
  href,
}: {
  label: string;
  count: number;
  href: string;
}) {
  return (
    <Link
      href={href}
      className={`border border-border rounded-lg p-4 hover:border-secondary transition ${
        count > 0 ? "bg-warning/5" : ""
      }`}
    >
      <div className="text-2xl font-bold text-primary">{count}</div>
      <div className="text-xs text-muted mt-1">{label}</div>
    </Link>
  );
}
