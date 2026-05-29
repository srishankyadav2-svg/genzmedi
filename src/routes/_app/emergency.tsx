import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Ambulance, Phone, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/emergency")({
  head: () => ({ meta: [{ title: "Emergency — GenZ Medi" }] }),
  component: EmergencyPage,
});

const contacts = [
  { name: "Ambulance", number: "102", icon: Ambulance, color: "bg-rose-500/10 text-rose-500" },
  { name: "Emergency Helpline", number: "112", icon: ShieldAlert, color: "bg-amber-500/10 text-amber-500" },
  { name: "Poison Control", number: "1066", icon: AlertTriangle, color: "bg-orange-500/10 text-orange-500" },
  { name: "GenZ Medi 24/7", number: "+91 88000 88000", icon: Phone, color: "bg-primary/10 text-primary" },
];

const personal = [
  { name: "Rhea Kapoor (Spouse)", relation: "Primary", number: "+91 98200 11122" },
  { name: "Dr. Meera Iyer", relation: "Cardiologist", number: "+91 99876 54321" },
  { name: "Vihaan Kapoor (Brother)", relation: "Secondary", number: "+91 99000 22233" },
];

function EmergencyPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="Emergency Contacts" subtitle="Quick access when every second matters." />
      <Card className="mb-6 border-destructive/30 bg-destructive/5">
        <CardContent className="flex items-center justify-between gap-4 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive text-destructive-foreground">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <p className="font-semibold">In an emergency?</p>
              <p className="text-sm text-muted-foreground">Tap SOS to alert your emergency circle and share location.</p>
            </div>
          </div>
          <Button variant="destructive" onClick={() => toast.success("SOS sent. Help is on the way.")}>
            Send SOS
          </Button>
        </CardContent>
      </Card>

      <h2 className="mb-3 text-sm font-semibold text-muted-foreground">National Helplines</h2>
      <div className="mb-6 grid gap-3 sm:grid-cols-2">
        {contacts.map((c) => (
          <Card key={c.name} className="shadow-card transition-all hover:-translate-y-0.5 hover:shadow-glow">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${c.color}`}>
                  <c.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">{c.name}</p>
                  <p className="text-sm text-muted-foreground">{c.number}</p>
                </div>
              </div>
              <Button size="sm" asChild><a href={`tel:${c.number.replace(/\s/g, "")}`}><Phone className="mr-1.5 h-4 w-4" /> Call</a></Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <h2 className="mb-3 text-sm font-semibold text-muted-foreground">Personal Contacts</h2>
      <div className="grid gap-3">
        {personal.map((p) => (
          <Card key={p.name} className="shadow-card">
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.relation} • {p.number}</p>
              </div>
              <Button size="sm" variant="outline" asChild><a href={`tel:${p.number.replace(/\s/g, "")}`}><Phone className="mr-1.5 h-4 w-4" /> Call</a></Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
