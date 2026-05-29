import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MessageCircle, CalendarPlus } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/doctors")({
  head: () => ({ meta: [{ title: "Doctors — GenZ Medi" }] }),
  component: DoctorsPage,
});

const doctors = [
  { name: "Dr. Meera Iyer", specialty: "Cardiologist", exp: "14 yrs", rating: 4.9, fee: "₹800" },
  { name: "Dr. Rohan Verma", specialty: "Dermatologist", exp: "9 yrs", rating: 4.8, fee: "₹600" },
  { name: "Dr. Anika Shah", specialty: "Dentist", exp: "11 yrs", rating: 4.7, fee: "₹500" },
  { name: "Dr. Kabir Menon", specialty: "Neurologist", exp: "16 yrs", rating: 4.9, fee: "₹1,200" },
  { name: "Dr. Sneha Rao", specialty: "Pediatrician", exp: "8 yrs", rating: 4.8, fee: "₹550" },
  { name: "Dr. Vihaan Joshi", specialty: "Orthopedic", exp: "12 yrs", rating: 4.6, fee: "₹750" },
];

function DoctorsPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Our Doctors" subtitle="Curated specialists for every need." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {doctors.map((d) => (
          <Card key={d.name} className="shadow-card transition-all hover:-translate-y-1 hover:shadow-glow">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-hero text-lg font-bold text-primary-foreground shadow-glow">
                  {d.name.split(" ")[1][0]}
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{d.name}</p>
                  <p className="text-sm text-muted-foreground">{d.specialty}</p>
                  <div className="mt-1 flex items-center gap-2 text-xs">
                    <span className="flex items-center gap-0.5 text-amber-500"><Star className="h-3.5 w-3.5 fill-current" /> {d.rating}</span>
                    <span className="text-muted-foreground">• {d.exp}</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <Badge variant="secondary">{d.fee} / visit</Badge>
                <div className="flex gap-1.5">
                  <Button size="icon" variant="outline" onClick={() => toast.info("Chat opened")} aria-label="Message">
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                  <Button size="sm" onClick={() => toast.success(`Booking with ${d.name}`)}>
                    <CalendarPlus className="mr-1.5 h-4 w-4" /> Book
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
