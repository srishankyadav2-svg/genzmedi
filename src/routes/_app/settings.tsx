import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({ meta: [{ title: "Settings — GenZ Medi" }] }),
  component: SettingsPage,
});

const rows = [
  { id: "email", label: "Email notifications", desc: "Appointment reminders & summaries" },
  { id: "sms", label: "SMS alerts", desc: "Urgent prescription & test updates" },
  { id: "share", label: "Share data with my doctors", desc: "Allow specialists to view your records" },
  { id: "biometric", label: "Biometric login", desc: "Use FaceID/fingerprint to sign in" },
];

function SettingsPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Settings" subtitle="Preferences, privacy and security." />
      <Card className="shadow-card">
        <CardHeader><CardTitle className="text-base">Preferences</CardTitle></CardHeader>
        <CardContent className="space-y-5">
          {rows.map((r) => (
            <div key={r.id} className="flex items-center justify-between gap-4">
              <div>
                <Label htmlFor={r.id} className="font-medium">{r.label}</Label>
                <p className="text-xs text-muted-foreground">{r.desc}</p>
              </div>
              <Switch id={r.id} defaultChecked onCheckedChange={(v) => toast.success(`${r.label}: ${v ? "On" : "Off"}`)} />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="mt-4 shadow-card">
        <CardHeader><CardTitle className="text-base">Danger zone</CardTitle></CardHeader>
        <CardContent className="flex items-center justify-between">
          <div>
            <p className="font-medium">Delete account</p>
            <p className="text-xs text-muted-foreground">Permanently remove your account and data.</p>
          </div>
          <Button variant="destructive" onClick={() => toast.error("Account deletion requires verification")}>
            Delete
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
