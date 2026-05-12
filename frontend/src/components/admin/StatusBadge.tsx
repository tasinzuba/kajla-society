import type { ApplicationStatus } from "@/lib/applications";

const styles: Record<ApplicationStatus, string> = {
  PENDING: "bg-warning/15 text-warning",
  APPROVED: "bg-success/15 text-success",
  REJECTED: "bg-danger/15 text-danger",
};

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <span
      className={`inline-block px-2 py-0.5 text-[10px] uppercase tracking-wider rounded font-semibold ${styles[status]}`}
    >
      {status}
    </span>
  );
}
