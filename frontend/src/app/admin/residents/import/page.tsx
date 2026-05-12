"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { bulkImportResidents, type ResidentInput } from "@/lib/residents";

const SAMPLE_CSV = `fullName,houseNo,road,block,phone,email,membershipNo
Anwar Khan,12,5,B,01711000000,anwar@example.com,M001
Sara Ahmed,13,5,B,,sara@example.com,
Jamil Karim,14,5,B,01712345678,,M003`;

type Row = Record<string, string>;

function parseCsv(text: string): Row[] {
  // Minimal CSV parser — handles quoted fields and commas
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
  if (lines.length < 2) return [];

  const parseLine = (line: string): string[] => {
    const cells: string[] = [];
    let cur = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (inQuotes) {
        if (ch === '"' && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else if (ch === '"') {
          inQuotes = false;
        } else {
          cur += ch;
        }
      } else {
        if (ch === '"') inQuotes = true;
        else if (ch === ",") {
          cells.push(cur);
          cur = "";
        } else {
          cur += ch;
        }
      }
    }
    cells.push(cur);
    return cells;
  };

  const headers = parseLine(lines[0]).map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const cells = parseLine(line);
    const row: Row = {};
    headers.forEach((h, i) => {
      row[h] = (cells[i] ?? "").trim();
    });
    return row;
  });
}

export default function BulkImportPage() {
  const router = useRouter();
  const [csv, setCsv] = useState("");
  const [preview, setPreview] = useState<ResidentInput[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    created: number;
    failed: number;
    total: number;
    errors: Array<{ index: number; error: string }>;
  } | null>(null);

  function handlePreview() {
    setParseError(null);
    try {
      const rows = parseCsv(csv);
      if (rows.length === 0) {
        setParseError("No data rows found");
        setPreview([]);
        return;
      }

      const items: ResidentInput[] = rows.map((r) => ({
        fullName: r.fullName || r["Full Name"] || "",
        fullNameBn: r.fullNameBn || null,
        houseNo: r.houseNo || r["House No"] || "",
        road: r.road || null,
        block: r.block || null,
        phone: r.phone || null,
        email: r.email || null,
        membershipNo: r.membershipNo || null,
        isVerified: r.isVerified?.toLowerCase() === "true",
        isPublic: r.isPublic ? r.isPublic.toLowerCase() === "true" : true,
      }));

      const missing = items.filter((i) => !i.fullName || !i.houseNo).length;
      if (missing > 0) {
        setParseError(
          `${missing} row(s) missing required fields (fullName, houseNo)`
        );
      }
      setPreview(items);
    } catch (e) {
      setParseError(e instanceof Error ? e.message : "Parse failed");
    }
  }

  async function handleImport() {
    if (preview.length === 0) return;
    setSubmitting(true);
    try {
      const res = await bulkImportResidents(preview);
      setResult(res);
      if (res.failed === 0) {
        setTimeout(() => router.push("/admin/residents"), 1500);
      }
    } catch (e) {
      setParseError(e instanceof Error ? e.message : "Import failed");
    } finally {
      setSubmitting(false);
    }
  }

  function handleFile(file: File) {
    file.text().then((text) => setCsv(text));
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <Link href="/admin/residents" className="text-sm text-muted hover:text-primary">
          ← Back to residents
        </Link>
        <h1 className="text-3xl font-bold text-primary mt-1">Bulk Import Residents</h1>
        <p className="text-muted text-sm mt-1">
          Paste CSV or upload a .csv file. Required columns: <code>fullName, houseNo</code>.
        </p>
      </div>

      <div className="bg-surface border border-border rounded-lg p-6 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-primary mb-1.5 uppercase">
            CSV file or paste below
          </label>
          <div className="flex items-center gap-2 mb-2">
            <input
              type="file"
              accept=".csv,text/csv"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
              className="text-sm"
            />
            <button
              type="button"
              onClick={() => setCsv(SAMPLE_CSV)}
              className="ml-auto text-xs text-secondary hover:underline"
            >
              Load sample
            </button>
          </div>
          <textarea
            value={csv}
            onChange={(e) => setCsv(e.target.value)}
            rows={10}
            className="w-full px-4 py-2 border border-border rounded font-mono text-xs bg-background"
            placeholder="fullName,houseNo,road,block,phone,email,membershipNo&#10;Anwar Khan,12,5,B,..."
          />
        </div>

        {parseError && (
          <div className="px-4 py-2 rounded bg-danger/10 border border-danger/30 text-danger text-sm">
            {parseError}
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={handlePreview}
            disabled={!csv.trim()}
            className="px-4 py-2 border border-border rounded text-sm font-semibold hover:bg-cream disabled:opacity-50"
          >
            Parse & Preview
          </button>
          <button
            onClick={handleImport}
            disabled={preview.length === 0 || submitting}
            className="px-4 py-2 bg-primary text-white rounded text-sm font-semibold disabled:opacity-50"
          >
            {submitting ? "Importing..." : `Import ${preview.length} rows`}
          </button>
        </div>
      </div>

      {/* Preview */}
      {preview.length > 0 && (
        <div className="bg-surface border border-border rounded-lg overflow-hidden">
          <div className="px-4 py-2 bg-cream border-b border-border text-sm font-semibold text-primary">
            Preview ({preview.length} rows)
          </div>
          <div className="max-h-96 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="bg-cream/50 text-xs uppercase text-muted">
                <tr>
                  <th className="text-left px-3 py-2">#</th>
                  <th className="text-left px-3 py-2">Name</th>
                  <th className="text-left px-3 py-2">House</th>
                  <th className="text-left px-3 py-2">Phone</th>
                  <th className="text-left px-3 py-2">Email</th>
                </tr>
              </thead>
              <tbody>
                {preview.slice(0, 50).map((r, i) => (
                  <tr
                    key={i}
                    className={`border-t border-border ${
                      !r.fullName || !r.houseNo ? "bg-danger/5" : ""
                    }`}
                  >
                    <td className="px-3 py-1.5 text-muted">{i + 1}</td>
                    <td className="px-3 py-1.5">{r.fullName || <em className="text-danger">missing</em>}</td>
                    <td className="px-3 py-1.5">{r.houseNo || <em className="text-danger">missing</em>}</td>
                    <td className="px-3 py-1.5 text-xs">{r.phone ?? "—"}</td>
                    <td className="px-3 py-1.5 text-xs">{r.email ?? "—"}</td>
                  </tr>
                ))}
                {preview.length > 50 && (
                  <tr>
                    <td colSpan={5} className="px-3 py-2 text-center text-muted text-xs">
                      ... and {preview.length - 50} more rows
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Result */}
      {result && (
        <div
          className={`rounded-lg p-4 text-sm ${
            result.failed === 0
              ? "bg-success/10 border border-success/30 text-success"
              : "bg-warning/10 border border-warning/30 text-warning"
          }`}
        >
          <p className="font-semibold mb-1">
            ✓ Imported {result.created} of {result.total} rows
            {result.failed > 0 && ` (${result.failed} failed)`}
          </p>
          {result.errors.length > 0 && (
            <ul className="mt-2 space-y-1 text-xs">
              {result.errors.slice(0, 10).map((e) => (
                <li key={e.index}>
                  Row {e.index + 1}: {e.error}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
