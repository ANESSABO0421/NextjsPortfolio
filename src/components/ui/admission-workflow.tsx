import { cn } from "@/lib/utils";

const steps = [
  ["01", "Admission", "Student details & documents"],
  ["02", "Reconciliation", "Receipts & bank credits"],
  ["03", "Verification", "Staff review & audit log"],
  ["04", "University submission", "Excel export & document bundle"],
  ["05", "Enrollment", "University enrollment number"],
];

export default function AdmissionWorkflow({ className }: { className?: string }) {
  return (
    <div className={cn("w-full rounded-xl border border-white/10 bg-[#0b0b0c] p-5 sm:p-8", className)}>
      <p className="mono uppercase text-fg-3">D-AIDE Nexus / admission workflow</p>
      <ol className="mt-5 divide-y divide-white/10">
        {steps.map(([, title, detail]) => (
          <li key={title} className="flex items-center gap-4 py-3 sm:py-4">
            <div>
              <p className="font-heading text-base text-white sm:text-xl">{title}</p>
              <p className="mt-1 text-xs text-fg-3 sm:text-sm">{detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
