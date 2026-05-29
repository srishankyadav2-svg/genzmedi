import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, MapPin, Plus, Video } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/appointments")({
  head: () => ({ meta: [{ title: "Appointments — GenZ Medi" }] }),
  component: AppointmentsPage,
});

const data = [
  { doctor: "Dr. Meera Iyer", specialty: "Cardiologist", date: "May 29, 2026", time: "4:30 PM", mode: "In-clinic", location: "GenZ Heart Center, Mumbai", status: "Confirmed" },
  { doctor: "Dr. Rohan Verma", specialty: "Dermatologist", date: "May 30, 2026", time: "11:00 AM", mode: "Video", location: "Online consultation", status: "Confirmed" },
  { doctor: "Dr. Anika Shah", specialty: "Dentist", date: "Jun 02, 2026", time: "2:15 PM", mode: "In-clinic", location: "Smile Studio, Bengaluru", status: "Pending" },
  { doctor: "Dr. Kabir Menon", specialty: "Neurologist", date: "Jun 10, 2026", time: "10:00 AM", mode: "Video", location: "Online consultation", status: "Confirmed" },
];

function AppointmentsPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Appointments"
        subtitle="Manage your upcoming and past visits."
        action={
          <Button onClick={() => toast.success("Booking flow opened")} className="bg-gradient-hero text-primary-foreground shadow-glow hover:-translate-y-0.5 transition-transform">
            <Plus className="mr-1.5 h-4 w-4" /> Book new
          </Button>
        }
      />
      <div className="grid gap-3 sm:gap-4">
        {data.map((a) => (
          <Card key={a.doctor} className="shadow-card transition-all hover:-translate-y-0.5 hover:shadow-glow">
            <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-hero text-primary-foreground font-bold">
                  {a.doctor.split(" ")[1][0]}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold">{a.doctor}</p>
                    <Badge variant={a.status === "Confirmed" ? "secondary" : "outline"}>{a.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{a.specialty}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" /> {a.date}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {a.time}</span>
                    <span className="flex items-center gap-1">
                      {a.mode === "Video" ? <Video className="h-3.5 w-3.5" /> : <MapPin className="h-3.5 w-3.5" />} {a.location}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 sm:flex-col sm:items-end">
                <Button variant="outline" size="sm" onClick={() => toast.info("Rescheduling...")}>Reschedule</Button>
                <Button size="sm" onClick={() => toast.success(a.mode === "Video" ? "Joining call..." : "Directions opened")}>
                  {a.mode === "Video" ? "Join call" : "Get directions"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
