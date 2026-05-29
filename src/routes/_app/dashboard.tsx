import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Activity, CalendarDays, Pill, FileText, HeartPulse, Droplet, Footprints, Moon, Plus, Clock,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/PageHeader";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — GenZ Medi" }] }),
  component: DashboardPage,
});

const stats = [
  { label: "Heart Rate", value: "72", unit: "bpm", icon: HeartPulse, color: "text-rose-500", bg: "bg-rose-500/10" },
  { label: "Blood Sugar", value: "98", unit: "mg/dL", icon: Droplet, color: "text-sky-500", bg: "bg-sky-500/10" },
  { label: "Steps Today", value: "7,842", unit: "steps", icon: Footprints, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { label: "Sleep", value: "7h 12m", unit: "last night", icon: Moon, color: "text-violet-500", bg: "bg-violet-500/10" },
];

const appointments = [
  { doctor: "Dr. Meera Iyer", specialty: "Cardiologist", time: "Today, 4:30 PM", mode: "In-clinic" },
  { doctor: "Dr. Rohan Verma", specialty: "Dermatologist", time: "Tomorrow, 11:00 AM", mode: "Video" },
  { doctor: "Dr. Anika Shah", specialty: "Dentist", time: "Fri, 2:15 PM", mode: "In-clinic" },
];

const meds = [
  { name: "Atorvastatin 10mg", time: "8:00 AM", taken: true },
  { name: "Vitamin D3", time: "1:00 PM", taken: true },
  { name: "Metformin 500mg", time: "9:00 PM", taken: false },
];

const reports = [
  { name: "Complete Blood Count", date: "May 20, 2026", status: "Normal" },
  { name: "Lipid Profile", date: "May 12, 2026", status: "Review" },
  { name: "Thyroid Panel", date: "Apr 28, 2026", status: "Normal" },
];

function DashboardPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Good afternoon, Aarav"
        subtitle="Here's a quick look at your health today."
        action={
          <Button asChild className="bg-gradient-hero text-primary-foreground shadow-glow hover:-translate-y-0.5 transition-transform">
            <Link to="/appointments"><Plus className="mr-1.5 h-4 w-4" /> Book appointment</Link>
          </Button>
        }
      />

      {/* Health stats */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="shadow-card border-transparent transition-all hover:-translate-y-0.5 hover:shadow-glow">
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-center justify-between">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.bg}`}>
                    <s.icon className={`h-5 w-5 ${s.color}`} />
                  </div>
                  <Badge variant="secondary" className="text-[10px]">Live</Badge>
                </div>
                <div className="mt-3">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold tracking-tight">{s.value}</span>
                    <span className="text-xs text-muted-foreground">{s.unit}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Upcoming appointments */}
        <Card className="lg:col-span-2 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-base">Upcoming Appointments</CardTitle>
              <CardDescription>Your next visits</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm"><Link to="/appointments">View all</Link></Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {appointments.map((a) => (
              <div key={a.doctor} className="flex items-center justify-between rounded-xl border border-border bg-card p-3 transition-colors hover:bg-accent/40">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-hero text-primary-foreground font-semibold">
                    {a.doctor.split(" ")[1][0]}
                  </div>
                  <div>
                    <p className="font-medium">{a.doctor}</p>
                    <p className="text-xs text-muted-foreground">{a.specialty} • {a.mode}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" /> {a.time}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Medicine reminder */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Today's Medicines</CardTitle>
            <CardDescription>3 of 3 reminders</CardDescription>
            <Progress value={66} className="mt-2" />
          </CardHeader>
          <CardContent className="space-y-3">
            {meds.map((m) => (
              <div key={m.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${m.taken ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"}`}>
                    <Pill className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{m.name}</p>
                    <p className="text-xs text-muted-foreground">{m.time}</p>
                  </div>
                </div>
                <Badge variant={m.taken ? "secondary" : "outline"} className="text-[10px]">
                  {m.taken ? "Taken" : "Pending"}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Reports */}
      <Card className="mt-6 shadow-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-base">Recent Reports</CardTitle>
            <CardDescription>Lab results & diagnostics</CardDescription>
          </div>
          <Button asChild variant="ghost" size="sm"><Link to="/reports">View all</Link></Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-muted-foreground">
                  <th className="pb-2 font-medium">Report</th>
                  <th className="pb-2 font-medium">Date</th>
                  <th className="pb-2 font-medium">Status</th>
                  <th className="pb-2 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => (
                  <tr key={r.name} className="border-t border-border">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        <span className="font-medium">{r.name}</span>
                      </div>
                    </td>
                    <td className="py-3 text-muted-foreground">{r.date}</td>
                    <td className="py-3">
                      <Badge variant={r.status === "Normal" ? "secondary" : "outline"}>{r.status}</Badge>
                    </td>
                    <td className="py-3 text-right">
                      <Button size="sm" variant="ghost">View</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
