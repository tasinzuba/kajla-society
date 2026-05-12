import { ApplicationLayout } from "@/components/site/ApplicationLayout";
import { AdoptionForm } from "@/components/site/AdoptionForm";

export const metadata = { title: "Adopt a Gate" };

export default function AdoptGatePage() {
  return (
    <ApplicationLayout
      title="Adopt a Gate"
      subtitle="Support our security infrastructure by sponsoring a Kajla Society gate."
      current="/services/adopt-gate"
    >
      <div className="bg-gradient-to-r from-accent to-cream border border-primary/10 rounded-2xl p-5 mb-6 text-sm flex gap-4 items-start shadow-sm">
        <div className="w-10 h-10 rounded-xl bg-primary text-white grid place-items-center flex-shrink-0 text-lg">
          ★
        </div>
        <div>
          <strong className="text-primary block mb-1">What you get</strong>
          <span className="text-foreground/80">
            Sponsorship plaque at the gate, recognition on the society
            website, and the gratitude of every resident who uses it.
          </span>
        </div>
      </div>
      <AdoptionForm
        target="GATE"
        locationLabel="Gate you'd like to adopt"
        locationPlaceholder="e.g. Main Gate, Gate 2"
      />
    </ApplicationLayout>
  );
}
