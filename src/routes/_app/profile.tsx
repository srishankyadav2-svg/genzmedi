import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/profile")({
  head: () => ({ meta: [{ title: "Profile — GenZ Medi" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="Patient Profile" subtitle="Your personal & medical details." />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="shadow-card lg:col-span-1">
          <CardContent className="flex flex-col items-center p-6 text-center">
            <Avatar className="h-20 w-20 border-4 border-background shadow-glow">
              <AvatarFallback className="bg-gradient-hero text-2xl font-bold text-primary-foreground">AK</AvatarFallback>
            </Avatar>
            <p className="mt-3 font-semibold">Aarav Kapoor</p>
            <p className="text-sm text-muted-foreground">Patient ID: GZM-00214</p>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              <Badge variant="secondary">Blood: O+</Badge>
              <Badge variant="secondary">Age: 32</Badge>
              <Badge variant="secondary">Male</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Personal information</CardTitle></CardHeader>
          <CardContent>
            <form className="grid gap-4 sm:grid-cols-2" onSubmit={(e) => { e.preventDefault(); toast.success("Profile saved"); }}>
              <div className="space-y-1.5"><Label>Full name</Label><Input defaultValue="Aarav Kapoor" /></div>
              <div className="space-y-1.5"><Label>Email</Label><Input type="email" defaultValue="aarav@genzmedi.com" /></div>
              <div className="space-y-1.5"><Label>Phone</Label><Input defaultValue="+91 98200 12345" /></div>
              <div className="space-y-1.5"><Label>Date of birth</Label><Input type="date" defaultValue="1993-04-12" /></div>
              <div className="space-y-1.5 sm:col-span-2"><Label>Address</Label><Input defaultValue="A-402, Skyline Heights, Mumbai" /></div>
              <div className="space-y-1.5"><Label>Allergies</Label><Input defaultValue="Penicillin" /></div>
              <div className="space-y-1.5"><Label>Chronic conditions</Label><Input defaultValue="Hypertension" /></div>
              <div className="sm:col-span-2 flex justify-end">
                <Button type="submit" className="bg-gradient-hero text-primary-foreground shadow-glow">Save changes</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
