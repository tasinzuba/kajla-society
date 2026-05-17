"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { IconType } from "react-icons";
import {
  HiOutlinePencilSquare,
  HiOutlineClipboardDocumentList,
  HiOutlineCalendarDays,
  HiOutlineMegaphone,
  HiOutlineDocumentText,
  HiOutlinePhoto,
  HiOutlineEnvelopeOpen,
} from "react-icons/hi2";
import { getDashboardStats, type DashboardStats } from "@/lib/stats";
import { formatDate } from "@/lib/utils";

type ActivityItem = {
  id: string;
  kind: "article" | "application" | "event";
  title: string;
  meta: string;
  href: string;
  date: string;
  Icon: IconType;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed"));
  }, []);

  const metrics: {
    label: string;
    value: number | string;
    href: string;
    hint: string;
  }[] = [
    {
      label: "Residents",
      value: stats?.counters.residents ?? "—",
      href: "/admin/residents",
      hint: "Listed in directory",
    },
    {
      label: "Published articles",
      value: stats?.counters.articlesPublished ?? "—",
      href: "/admin/articles",
      hint:
        stats
          ? `${stats.counters.articlesDraft} drafts in queue`
          : "Loading…",
    },
    {
      label: "Pending applications",
      value: stats?.counters.pendingByType.membership ?? "—",
      href: "/admin/applications/membership",
      hint: "Awaiting review",
    },
    {
      label: "Unread messages",
      value: stats?.counters.unreadMessages ?? "—",
      href: "/admin/messages",
      hint: "Contact form inbox",
    },
  ];

  const activity: ActivityItem[] = [];
  if (stats) {
    stats.recent.membershipApplications.forEach((m) =>
      activity.push({
        id: "ma-" + m.id,
        kind: "application",
        title: m.fullName,
        meta: `Membership application · ${m.status.toLowerCase()}`,
        href: `/admin/applications/membership/${m.id}`,
        date: m.createdAt,
        Icon: HiOutlineClipboardDocumentList,
      })
    );
    stats.recent.articles.forEach((a) =>
      activity.push({
        id: "ar-" + a.id,
        kind: "article",
        title: a.title,
        meta: a.isPublished ? "Article · published" : "Article · draft",
        href: `/admin/articles/${a.id}/edit`,
        date: a.createdAt,
        Icon: HiOutlinePencilSquare,
      })
    );
    stats.recent.events.forEach((e) =>
      activity.push({
        id: "ev-" + e.id,
        kind: "event",
        title: e.title,
        meta: `Event · ${formatDate(e.startsAt)}`,
        href: `/admin/events/${e.id}/edit`,
        date: e.createdAt,
        Icon: HiOutlineCalendarDays,
      })
    );
  }
  activity.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const quickActions: { label: string; href: string; Icon: IconType }[] = [
    { label: "New article", href: "/admin/articles/new", Icon: HiOutlinePencilSquare },
    { label: "New notice", href: "/admin/notices/new", Icon: HiOutlineMegaphone },
    { label: "New event", href: "/admin/events/new", Icon: HiOutlineCalendarDays },
    { label: "New page", href: "/admin/pages/new", Icon: HiOutlineDocumentText },
    { label: "Upload gallery", href: "/admin/gallery/new", Icon: HiOutlinePhoto },
  ];

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex items-end justify-between gap-4 flex-wrap pb-6 border-b border-border">
        <div>
          <h1 className="text-[22px] font-bold text-primary-dark tracking-tight">
            Overview
          </h1>
          <p className="text-[13px] text-muted mt-1">
            A snapshot of activity across Kajla Society.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-[12px] text-muted">
          <span className="font-mono">
            {new Date().toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
      </div>

      {error && (
        <div className="px-3 py-2 rounded bg-red-50 border border-red-200 text-red-700 text-[12px]">
          {error}
        </div>
      )}

      {/* Metric tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 border border-border rounded-md bg-white overflow-hidden">
        {metrics.map((m, i) => (
          <Link
            key={m.label}
            href={m.href}
            className={`group p-5 hover:bg-[#fafaf7] transition ${
              i !== metrics.length - 1 ? "border-b lg:border-b-0 lg:border-r border-border" : ""
            } ${i < 2 ? "border-b lg:border-b-0" : ""}`}
          >
            <div className="text-[10px] uppercase tracking-[0.12em] text-muted/80 font-semibold">
              {m.label}
            </div>
            <div className="text-[28px] lg:text-[32px] font-bold text-primary-dark tracking-tight font-mono mt-2 leading-none">
              {m.value}
            </div>
            <div className="text-[11px] text-muted mt-2 group-hover:text-amber-700 transition">
              {m.hint}
            </div>
          </Link>
        ))}
      </div>

      {/* Quick actions — pill row */}
      <div>
        <div className="text-[10px] uppercase tracking-[0.12em] text-muted/80 font-semibold mb-2.5">
          Quick actions
        </div>
        <div className="flex flex-wrap gap-2">
          {quickActions.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-border rounded text-[12px] font-semibold text-primary-dark hover:border-amber-400 hover:bg-amber-50/40 transition"
            >
              <a.Icon className="text-[14px] text-amber-700" />
              {a.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Two columns: Activity feed (wider) + Snapshot (narrower) */}
      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        {/* Activity feed */}
        <section className="bg-white border border-border rounded-md">
          <header className="px-5 py-3.5 border-b border-border flex items-center justify-between">
            <div>
              <h2 className="text-[13px] font-bold text-primary-dark">
                Recent activity
              </h2>
              <p className="text-[11px] text-muted mt-0.5">
                Latest changes across content and applications.
              </p>
            </div>
          </header>

          {activity.length === 0 ? (
            <div className="px-5 py-12 text-center text-[13px] text-muted">
              No activity yet.
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {activity.slice(0, 10).map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className="flex items-start gap-3 px-5 py-3 hover:bg-[#fafaf7] transition group"
                  >
                    <div className="w-7 h-7 rounded grid place-items-center bg-[#fafaf7] border border-border flex-shrink-0 group-hover:border-amber-400 transition">
                      <item.Icon className="text-[14px] text-amber-700" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-semibold text-primary-dark truncate">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-muted mt-0.5 truncate">
                        {item.meta}
                      </div>
                    </div>
                    <div className="text-[11px] text-muted font-mono whitespace-nowrap pt-0.5">
                      {formatDate(item.date)}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Right column: Snapshot + Inbox preview */}
        <div className="space-y-6">
          <section className="bg-white border border-border rounded-md">
            <header className="px-5 py-3.5 border-b border-border">
              <h2 className="text-[13px] font-bold text-primary-dark">
                Community
              </h2>
            </header>
            <ul className="divide-y divide-border">
              <SnapshotRow
                label="Total residents"
                value={stats?.counters.residents}
                href="/admin/residents"
              />
              <SnapshotRow
                label="Committee members"
                value={stats?.counters.committeeMembers}
                href="/admin/committee"
              />
              <SnapshotRow
                label="Total notices"
                value={stats?.counters.notices}
                href="/admin/notices"
              />
              <SnapshotRow
                label="Upcoming events"
                value={stats?.counters.upcomingEvents}
                href="/admin/events"
              />
            </ul>
          </section>

          <section className="bg-white border border-border rounded-md">
            <header className="px-5 py-3.5 border-b border-border flex items-center gap-2">
              <HiOutlineEnvelopeOpen className="text-[14px] text-amber-700" />
              <h2 className="text-[13px] font-bold text-primary-dark">
                Inbox
              </h2>
            </header>
            <ul className="divide-y divide-border">
              <SnapshotRow
                label="Pending applications"
                value={stats?.counters.pendingByType.membership}
                href="/admin/applications/membership"
                emphasize={
                  (stats?.counters.pendingByType.membership ?? 0) > 0
                }
              />
              <SnapshotRow
                label="Unread messages"
                value={stats?.counters.unreadMessages}
                href="/admin/messages"
                emphasize={(stats?.counters.unreadMessages ?? 0) > 0}
              />
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

function SnapshotRow({
  label,
  value,
  href,
  emphasize,
}: {
  label: string;
  value: number | undefined;
  href?: string;
  emphasize?: boolean;
}) {
  const body = (
    <div className="flex items-center justify-between px-5 py-2.5">
      <span className="text-[12px] text-muted">{label}</span>
      <span
        className={`font-mono text-[14px] font-bold tracking-tight ${
          emphasize ? "text-amber-700" : "text-primary-dark"
        }`}
      >
        {value ?? "—"}
      </span>
    </div>
  );
  return (
    <li>
      {href ? (
        <Link
          href={href}
          className="block hover:bg-[#fafaf7] transition"
        >
          {body}
        </Link>
      ) : (
        body
      )}
    </li>
  );
}
