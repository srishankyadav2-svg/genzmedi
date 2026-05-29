import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Download, IndianRupee, Wallet } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/billing")({
  head: () => ({ meta: [{ title: "Billing — GenZ Medi" }] }),
  component: BillingPage,
});

const invoices = [
  { id: "INV-2026-0142", desc: "Cardiology consultation", date: "May 20, 2026", amount: "₹800", status: "Paid" },
  { id: "INV-2026-0131", desc: "Lipid Profile test", date: "May 12, 2026", amount: "₹1,200", status: "Paid" },
  { id: "INV-2026-0120", desc: "Dental cleaning", date: "Apr 28, 2026", amount: "₹1,500", status: "Pending" },
  { id: "INV-2026-0099", desc: "Medicines order", date: "Apr 14, 2026", amount: "₹640", status: "Paid" },
];

function BillingPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Billing & Payments" subtitle="Invoices, methods, and balances." />
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="shadow-card bg-gradient-hero text-primary-foreground">
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-wide opacity-80">Outstanding</p>
            <div className="mt-2 flex items-baseline gap-1">
              <IndianRupee className="h-5 w-5" />
              <span className="text-3xl font-bold">1,500</span>
            </div>
            <Button variant="secondary" className="mt-4" size="sm" onClick={() => toast.success("Payment successful")}>Pay now</Button>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Wallet balance</p>
            <div className="mt-2 flex items-center gap-2">
              <Wallet className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">₹320</span>
            </div>
            <Button variant="outline" size="sm" className="mt-4" onClick={() => toast.info("Top-up coming up")}>Top up</Button>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Default card</p>
            <div className="mt-2 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              <span className="font-medium">•••• 4242</span>
            </div>
            <Button variant="outline" size="sm" className="mt-4" onClick={() => toast.info("Manage methods")}>Manage</Button>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 shadow-card">
        <CardHeader><CardTitle className="text-base">Invoices</CardTitle></CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="p-4 font-medium">Invoice</th>
                  <th className="p-4 font-medium">Description</th>
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium">Amount</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium text-right"></th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((i) => (
                  <tr key={i.id} className="border-t border-border hover:bg-accent/30">
                    <td className="p-4 font-medium">{i.id}</td>
                    <td className="p-4 text-muted-foreground">{i.desc}</td>
                    <td className="p-4 text-muted-foreground">{i.date}</td>
                    <td className="p-4 font-medium">{i.amount}</td>
                    <td className="p-4"><Badge variant={i.status === "Paid" ? "secondary" : "outline"}>{i.status}</Badge></td>
                    <td className="p-4 text-right">
                      <Button size="sm" variant="ghost" onClick={() => toast.success("Downloading invoice")}>
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
