import { ApplicationLayout } from "@/components/site/ApplicationLayout";
import { AdoptionForm } from "@/components/site/AdoptionForm";

export const metadata = { title: "Adopt a Road" };

export default function AdoptRoadPage() {
  return (
    <ApplicationLayout
      title="Adopt a Road"
      subtitle="Sponsor maintenance of a road in Kajla Society. Your contribution keeps our community beautiful."
      current="/services/adopt-road"
    >
      <div className="bg-gradient-to-r from-accent to-cream border border-primary/10 rounded-2xl p-5 mb-6 text-sm flex gap-4 items-start shadow-sm">
        <div className="w-10 h-10 rounded-xl bg-primary text-white grid place-items-center flex-shrink-0 text-lg">
          ★
        </div>
        <div>
          <strong className="text-primary block mb-1">What you get</strong>
          <span className="text-foreground/80">
            Sponsorship plaque, recognition on the society website, and the
            satisfaction of giving back to the community.
          </span>
        </div>
      </div>
      <AdoptionForm
        target="ROAD"
        locationLabel="Road you'd like to adopt"
        locationPlaceholder="e.g. Road 5, Block B"
      />
    </ApplicationLayout>
  );
}
