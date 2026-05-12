import { HiOutlineCheckCircle } from "react-icons/hi2";

export function ApplicationSuccess({ id, type }: { id: string; type: string }) {
  return (
    <div className="bg-white border border-border rounded-2xl p-10 text-center shadow-md">
      <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-green-100 grid place-items-center">
        <HiOutlineCheckCircle className="text-5xl text-green-600" />
      </div>
      <h2 className="text-2xl lg:text-3xl font-extrabold text-primary mb-2 tracking-tight">
        Application submitted!
      </h2>
      <p className="text-muted mb-5 max-w-md mx-auto">
        Your {type} application has been received and is pending review. We&apos;ll
        email you when there&apos;s an update.
      </p>
      <div className="inline-block bg-accent rounded-xl px-5 py-3">
        <div className="text-[10px] uppercase tracking-wider text-muted font-bold">
          Reference ID
        </div>
        <code className="text-primary font-bold text-sm">{id}</code>
      </div>
    </div>
  );
}

export const inputCls =
  "w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all";

export function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-bold text-primary mb-2 uppercase tracking-wider">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}
