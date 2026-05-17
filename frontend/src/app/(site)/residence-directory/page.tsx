"use client";

import { useEffect, useState, useCallback } from "react";
import {
  HiOutlineMagnifyingGlass,
  HiOutlineHome,
  HiOutlineXMark,
} from "react-icons/hi2";
import { listResidentsPublic, type PublicResident } from "@/lib/residents";
import { mediaUrl } from "@/lib/media";
import { PageHero } from "@/components/site/PageHero";
import { stockImages } from "@/lib/images";

export default function ResidenceDirectoryPage() {
  const [items, setItems] = useState<PublicResident[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [q, setQ] = useState("");
  const [block, setBlock] = useState("");
  const [road, setRoad] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listResidentsPublic({
        page,
        limit: 24,
        q: q || undefined,
        block: block || undefined,
        road: road || undefined,
      });
      setItems(data.items);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [page, q, block, road]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  function clearFilters() {
    setQ("");
    setRoad("");
    setBlock("");
    setPage(1);
  }

  const hasFilters = q || road || block;

  return (
    <>
      <PageHero
        title="Residence Directory"
        titleBn="বাসিন্দা তালিকা"
        subtitle="Search residents by name, house number, road, or block."
        image={stockImages.heroResidents}
        crumbs={[{ label: "Residence Directory" }]}
      />

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Search panel */}
        <div className="bg-white border border-border rounded-2xl p-5 mb-8 shadow-sm">
          <div className="relative mb-3">
            <HiOutlineMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-muted text-xl" />
            <input
              type="text"
              value={q}
              onChange={(e) => {
                setPage(1);
                setQ(e.target.value);
              }}
              placeholder="Search by name, house, or membership number..."
              className="w-full pl-12 pr-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
            />
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            <input
              type="text"
              value={road}
              onChange={(e) => {
                setPage(1);
                setRoad(e.target.value);
              }}
              placeholder="Road"
              className="px-4 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
            />
            <input
              type="text"
              value={block}
              onChange={(e) => {
                setPage(1);
                setBlock(e.target.value);
              }}
              placeholder="Block"
              className="px-4 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
            />
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 border border-border rounded-lg text-sm text-muted hover:text-danger hover:border-danger transition"
              >
                <HiOutlineXMark />
                Clear filters
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="px-4 py-3 mb-6 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        <p className="text-sm text-muted mb-5">
          <strong className="text-foreground">{total}</strong>{" "}
          {total === 1 ? "resident" : "residents"} found
        </p>

        {loading ? (
          <div className="text-center py-16 text-muted">Loading...</div>
        ) : items.length === 0 ? (
          <div className="bg-white border border-border rounded-2xl p-16 text-center shadow-sm">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent grid place-items-center">
              <HiOutlineHome className="text-3xl text-primary" />
            </div>
            <p className="text-muted">No residents match your search.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((r) => (
              <div
                key={r.id}
                className="bg-white border border-border rounded-2xl p-4 hover:shadow-xl hover:border-primary/30 transition-all hover:-translate-y-0.5 flex items-center gap-3"
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-accent to-cream overflow-hidden flex-shrink-0 ring-2 ring-white shadow">
                  {r.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={mediaUrl(r.photo) ?? ""}
                      alt={r.fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full grid place-items-center text-xl text-primary font-extrabold">
                      {r.fullName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-primary truncate tracking-tight">
                    {r.fullName}
                  </h3>
                  <div className="text-xs text-muted mt-1">
                    H# <strong className="text-foreground">{r.houseNo}</strong>
                    {r.road && <span>, Rd {r.road}</span>}
                    {r.block && <span>, Blk {r.block}</span>}
                  </div>
                  {r.membershipNo && (
                    <div className="text-[10px] text-secondary mt-0.5 font-semibold">
                      ID: {r.membershipNo}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-10 flex-wrap">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`min-w-[40px] h-10 grid place-items-center rounded-lg text-sm font-semibold transition ${
                  p === page
                    ? "bg-amber-400 text-primary-dark shadow-md"
                    : "bg-white border border-border hover:border-amber-400"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}

        <p className="text-xs text-muted mt-10 text-center max-w-md mx-auto">
          Contact information is shown only in the admin panel. Apply for
          membership to be added to the directory.
        </p>
      </div>
    </>
  );
}
