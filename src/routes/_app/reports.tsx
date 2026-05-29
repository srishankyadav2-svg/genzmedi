import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Upload } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/reports")({
  head: () => ({ meta: [{ title: "Medical Reports — GenZ Medi" }] }),
  component: ReportsPage,
});

const reports = [
  { name: "Complete Blood Count", type: "Hematology", date: "May 20, 2026", status: "Normal" },
  { name: "Lipid Profile", type: "Biochemistry", date: "May 12, 2026", status: "Review" },
  { name: "Thyroid Panel (TSH, T3, T4)", type: "Endocrine", date: "Apr 28, 2026", status: "Normal" },
  { name: "Chest X-Ray", type: "Radiology", date: "Apr 10, 2026", status: "Normal" },
  { name: "HbA1c", type: "Diabetes", date: "Mar 22, 2026", status: "Borderline" },
];

function ReportsPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Medical Reports"
        subtitle="All your lab and diagnostic reports in one place."
        action={
          <Button onClick={() => toast.success("Upload started")} className="bg-gradient-hero text-primary-foreground shadow-glow">
            <Upload className="mr-1.5 h-4 w-4" /> Upload report
          </Button>
        }
      />
      <Card className="shadow-card">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="p-4 font-medium">Report</th>
                  <th className="p-4 font-medium">Type</th>
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => (
                  <tr key={r.name} className="border-t border-border transition-colors hover:bg-accent/30">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        <span className="font-medium">{r.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">{r.type}</td>
                    <td className="p-4 text-muted-foreground">{r.date}</td>
                    <td className="p-4">
                      <Badge variant={r.status === "Normal" ? "secondary" : "outline"}>{r.status}</Badge>
                    </td>
                    <td className="p-4 text-right">
                      <Button size="sm" variant="ghost" onClick={() => toast.success("Downloading...")}>
                        <Download className="mr-1.5 h-4 w-4" /> PDF
                      </Button>
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
