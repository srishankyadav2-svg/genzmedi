import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pill, Plus } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/medicines")({
  head: () => ({ meta: [{ title: "Medicines — GenZ Medi" }] }),
  component: MedicinesPage,
});

const meds = [
  { name: "Atorvastatin", dose: "10 mg", schedule: "Once daily — Morning", refill: "12 days left", status: "Active" },
  { name: "Metformin", dose: "500 mg", schedule: "Twice daily", refill: "20 days left", status: "Active" },
  { name: "Vitamin D3", dose: "60,000 IU", schedule: "Weekly — Sunday", refill: "5 weeks left", status: "Active" },
  { name: "Amoxicillin", dose: "500 mg", schedule: "Thrice daily — 5 days", refill: "Completed", status: "Finished" },
];

function MedicinesPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Medicines"
        subtitle="Your prescriptions and reminders."
        action={
          <Button onClick={() => toast.success("Reminder added")} className="bg-gradient-hero text-primary-foreground shadow-glow">
            <Plus className="mr-1.5 h-4 w-4" /> Add reminder
          </Button>
        }
      />
      <div className="grid gap-3 sm:grid-cols-2">
        {meds.map((m) => (
          <Card key={m.name} className="shadow-card transition-all hover:-translate-y-0.5 hover:shadow-glow">
            <CardContent className="flex items-start gap-3 p-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Pill className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold">{m.name}</p>
                  <Badge variant={m.status === "Active" ? "secondary" : "outline"}>{m.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{m.dose} • {m.schedule}</p>
                <p className="mt-2 text-xs text-muted-foreground">Refill: {m.refill}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
