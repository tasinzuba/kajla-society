"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  HiOutlineUser,
  HiOutlineEnvelope,
  HiOutlinePhone,
  HiOutlineHome,
  HiOutlineIdentification,
  HiOutlineBriefcase,
  HiOutlineCalendarDays,
  HiOutlineUsers,
  HiOutlineDocumentText,
} from "react-icons/hi2";
import {
  getMembershipApplication,
  updateMembershipStatus,
  deleteMembership,
  type MembershipApplication,
  type ApplicationStatus,
  type ChildInfo,
} from "@/lib/applications";
import { formatDate } from "@/lib/utils";
import { mediaUrl } from "@/lib/media";

const STATUS_STYLES: Record<ApplicationStatus, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  APPROVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
};

export default function MembershipApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [application, setApplication] = useState<MembershipApplication | null>(null);
  const [adminNote, setAdminNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMembershipApplication(id)
      .then((data) => {
        setApplication(data);
        setAdminNote(data.adminNote ?? "");
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, [id]);

  async function updateStatus(status: ApplicationStatus) {
    if (!application) return;
    setUpdating(true);
    setError(null);
    try {
      const updated = await updateMembershipStatus(application.id, status, adminNote);
      setApplication(updated);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed");
    } finally {
      setUpdating(false);
    }
  }

  async function onDelete() {
    if (!application) return;
    if (!confirm("Delete this application permanently?")) return;
    setUpdating(true);
    try {
      await deleteMembership(application.id);
      router.push("/admin/applications/membership");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
      setUpdating(false);
    }
  }

  if (loading) {
    return (
      <div className="bg-white border border-border rounded-md p-16 text-center text-muted">
        Loading...
      </div>
    );
  }

  if (!application) {
    return (
      <div className="bg-white border border-border rounded-md p-16 text-center">
        <p className="text-muted">Application not found.</p>
      </div>
    );
  }

  const a = application;
  const children: ChildInfo[] = Array.isArray(a.children) ? a.children : [];

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <Link
          href="/admin/applications/membership"
          className="text-sm text-muted hover:text-primary"
        >
          ← Back to applications
        </Link>
        <div className="flex items-center gap-3 mt-1 flex-wrap">
          <h1 className="text-3xl font-bold text-primary">{a.fullName}</h1>
          <span
            className={`inline-block px-3 py-1 text-[10px] uppercase tracking-wider rounded-full font-bold ${STATUS_STYLES[a.status]}`}
          >
            {a.status}
          </span>
          <span className="inline-block px-3 py-1 text-[10px] uppercase tracking-wider rounded-full font-bold bg-primary-dark text-amber-400">
            {a.membershipType} Member
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted mt-2">
          <HiOutlineCalendarDays />
          Submitted {formatDate(a.createdAt)}
        </div>
      </div>

      {error && (
        <div className="px-4 py-3 rounded bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Membership Type & Declaration */}
      <Card title="Membership Type & Declaration" Icon={HiOutlineIdentification}>
        <DetailRow label="Type" value={a.membershipType} />
        <DetailRow
          label="Declaration"
          value={a.agreedDeclaration ? "✓ Agreed to terms" : "Not agreed"}
        />
        {(a.proposerName || a.proposerMembershipNo) && (
          <div className="grid sm:grid-cols-2 gap-x-6 mt-3 pt-3 border-t border-border">
            <div>
              <Subhead>Proposer</Subhead>
              <DetailRow label="Name" value={a.proposerName ?? "—"} compact />
              <DetailRow
                label="Membership No."
                value={a.proposerMembershipNo ?? "—"}
                compact
              />
            </div>
            <div>
              <Subhead>Seconder</Subhead>
              <DetailRow label="Name" value={a.seconderName ?? "—"} compact />
              <DetailRow
                label="Membership No."
                value={a.seconderMembershipNo ?? "—"}
                compact
              />
            </div>
          </div>
        )}
      </Card>

      {/* Personal */}
      <Card title="Personal Information" Icon={HiOutlineUser}>
        <DetailRow label="Full Name" value={a.fullName} />
        {a.fullNameBn && <DetailRow label="Name (Bangla)" value={a.fullNameBn} />}
        {a.fatherName && <DetailRow label="Father's Name" value={a.fatherName} />}
        {a.motherName && <DetailRow label="Mother's Name" value={a.motherName} />}
        {a.spouseName && <DetailRow label="Spouse Name" value={a.spouseName} />}
        {a.dateOfBirth && (
          <DetailRow label="Date of Birth" value={formatDate(a.dateOfBirth)} />
        )}
        {a.gender && <DetailRow label="Gender" value={a.gender} />}
        {a.bloodGroup && <DetailRow label="Blood Group" value={a.bloodGroup} />}
        {a.profession && <DetailRow label="Profession" value={a.profession} />}
      </Card>

      {/* Contact */}
      <Card title="Contact Information" Icon={HiOutlineEnvelope}>
        <DetailRow
          label="Email"
          value={
            <a href={`mailto:${a.email}`} className="text-secondary hover:underline">
              {a.email}
            </a>
          }
        />
        <DetailRow
          label="Mobile"
          value={
            <a href={`tel:${a.mobile}`} className="text-secondary hover:underline">
              {a.mobile}
            </a>
          }
        />
        {a.officePhone && (
          <DetailRow
            label="Office Phone"
            value={
              <a href={`tel:${a.officePhone}`} className="text-secondary hover:underline">
                {a.officePhone}
              </a>
            }
          />
        )}
        {a.residencePhone && (
          <DetailRow
            label="Residence Phone"
            value={
              <a href={`tel:${a.residencePhone}`} className="text-secondary hover:underline">
                {a.residencePhone}
              </a>
            }
          />
        )}
      </Card>

      {/* Children */}
      {children.length > 0 && (
        <Card title="Children Information" Icon={HiOutlineUsers}>
          <div className="space-y-3">
            {children.map((c, i) => (
              <div
                key={i}
                className="bg-amber-50/50 border border-amber-200 rounded-md p-3"
              >
                <div className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2">
                  Child {i + 1}
                </div>
                <DetailRow label="Name" value={c.name} compact />
                {c.dateOfBirth && (
                  <DetailRow
                    label="Date of Birth"
                    value={formatDate(c.dateOfBirth)}
                    compact
                  />
                )}
                {c.school && <DetailRow label="School" value={c.school} compact />}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Professional */}
      {(a.designation || a.organization) && (
        <Card title="Professional Information" Icon={HiOutlineBriefcase}>
          {a.designation && (
            <DetailRow label="Designation" value={a.designation} />
          )}
          {a.organization && (
            <DetailRow label="Organization" value={a.organization} />
          )}
        </Card>
      )}

      {/* Address & Property */}
      {(a.residenceAddress ||
        a.propertyOwner ||
        a.propertyScheduleSummary ||
        a.relationshipToProperty) && (
        <Card title="Address & Property Information" Icon={HiOutlineHome}>
          {a.residenceAddress && (
            <DetailRow label="Residence Address" value={a.residenceAddress} />
          )}
          {a.propertyOwner && (
            <DetailRow label="Property Owner" value={a.propertyOwner} />
          )}
          {a.propertyScheduleSummary && (
            <DetailRow label="Property Schedule" value={a.propertyScheduleSummary} />
          )}
          {a.relationshipToProperty && (
            <DetailRow
              label="Relationship to Property"
              value={a.relationshipToProperty}
            />
          )}
        </Card>
      )}

      {/* Documents */}
      {(a.photoUrl || a.nidUrl || a.taxReceiptUrl) && (
        <Card title="Submitted Documents" Icon={HiOutlineDocumentText}>
          <div className="grid sm:grid-cols-3 gap-4">
            <DocumentTile label="Photograph (PP)" url={a.photoUrl} />
            <DocumentTile label="NID Card" url={a.nidUrl} />
            <DocumentTile label="Tax Receipt / Sale Deed" url={a.taxReceiptUrl} />
          </div>
        </Card>
      )}

      {/* Admin Decision */}
      <div className="bg-white border border-border rounded-md p-6 space-y-4">
        <h2 className="text-sm font-bold text-primary-dark uppercase tracking-wider pb-3 border-b border-border">
          Admin Decision
        </h2>

        <div>
          <label className="block text-xs font-bold text-primary-dark mb-1.5 uppercase tracking-wider">
            Admin Note (optional)
          </label>
          <textarea
            rows={3}
            value={adminNote}
            onChange={(e) => setAdminNote(e.target.value)}
            placeholder="Internal note or reason for decision..."
            className="w-full px-4 py-2 border border-border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => updateStatus("APPROVED")}
            disabled={updating || a.status === "APPROVED"}
            className="inline-flex items-center px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-md font-bold text-sm uppercase tracking-wider transition disabled:opacity-50"
          >
            Approve
          </button>
          <button
            type="button"
            onClick={() => updateStatus("REJECTED")}
            disabled={updating || a.status === "REJECTED"}
            className="inline-flex items-center px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-md font-bold text-sm uppercase tracking-wider transition disabled:opacity-50"
          >
            Reject
          </button>
          <button
            type="button"
            onClick={() => updateStatus("PENDING")}
            disabled={updating || a.status === "PENDING"}
            className="inline-flex items-center px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-primary-dark rounded-md font-bold text-sm uppercase tracking-wider transition disabled:opacity-50"
          >
            Mark Pending
          </button>
          <div className="flex-1" />
          <button
            type="button"
            onClick={onDelete}
            disabled={updating}
            className="inline-flex items-center px-5 py-2.5 text-red-600 hover:text-red-700 rounded-md font-semibold text-sm transition disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Helpers
// ============================================================
function Card({
  title,
  Icon,
  children,
}: {
  title: string;
  Icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white border border-border rounded-md p-5 lg:p-6">
      <h2 className="flex items-center gap-2.5 text-base font-bold text-primary-dark tracking-tight pb-3 mb-4 border-b border-border">
        <Icon className="text-xl text-amber-700" />
        {title}
      </h2>
      {children}
    </section>
  );
}

function DetailRow({
  label,
  value,
  compact,
}: {
  label: string;
  value: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <div
      className={`grid grid-cols-[140px_1fr] gap-3 ${compact ? "py-1" : "py-1.5"} text-sm`}
    >
      <div className="text-[11px] uppercase tracking-wider text-muted font-semibold pt-0.5">
        {label}
      </div>
      <div className="text-foreground font-medium">{value}</div>
    </div>
  );
}

function Subhead({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="text-xs font-bold text-primary-dark uppercase tracking-wider mb-2">
      {children}
    </h4>
  );
}

function DocumentTile({
  label,
  url,
}: {
  label: string;
  url: string | null | undefined;
}) {
  const fullUrl = url ? mediaUrl(url) : null;
  const isPdf = url?.toLowerCase().endsWith(".pdf");

  return (
    <div className="border border-border rounded-md p-3 bg-amber-50/30">
      <div className="text-[11px] uppercase tracking-wider text-muted font-semibold mb-2">
        {label}
      </div>
      {fullUrl ? (
        <>
          {isPdf ? (
            <div className="grid place-items-center bg-red-50 text-red-600 rounded h-32">
              <HiOutlineDocumentText className="text-4xl" />
            </div>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={fullUrl}
              alt={label}
              className="w-full h-32 object-cover rounded border border-border"
            />
          )}
          <a
            href={fullUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block mt-2 text-xs text-center font-bold text-amber-700 hover:underline uppercase tracking-wider"
          >
            View Full →
          </a>
        </>
      ) : (
        <div className="grid place-items-center h-32 text-muted text-sm">
          Not uploaded
        </div>
      )}
    </div>
  );
}
