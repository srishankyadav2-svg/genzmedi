import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, HeartPulse, Lock, Mail, Phone, ShieldCheck, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { normalizePhone, signUp, type Identifier } from "@/lib/auth";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create your account — GenZ Medi" },
      {
        name: "description",
        content:
          "Create a GenZ Medi account with your mobile number. Protected by SMS verification.",
      },
    ],
  }),
  component: SignupPage,
});

type Tab = "phone" | "email";

function SignupPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("phone");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast.error("Please enter your full name");
      return;
    }
    let identifier: Identifier;
    if (tab === "phone") {
      const e164 = normalizePhone(phone);
      if (!e164) {
        toast.error("Enter a valid mobile number with country code");
        return;
      }
      identifier = { type: "phone", value: e164 };
    } else {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        toast.error("Enter a valid email address");
        return;
      }
      identifier = { type: "email", value: email.trim().toLowerCase() };
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords don't match");
      return;
    }
    setLoading(true);
    try {
      await signUp({ identifier, password, fullName: fullName.trim() });
      if (tab === "phone") {
        toast.success("Account created", {
          description: "Sign in with your mobile number and password. You'll receive an SMS code for verification.",
        });
      } else {
        toast.success("Account created", {
          description: "Check your email to confirm your address, then sign in.",
        });
      }
      navigate({ to: "/" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not create account";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-soft p-4">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-24 h-96 w-96 rounded-full bg-primary/30 blur-3xl animate-blob" />
        <div className="absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-secondary/40 blur-3xl animate-blob [animation-delay:-7s]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-full max-w-md"
      >
        <div className="glass shadow-glow rounded-2xl p-6 sm:p-8">
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-hero shadow-glow animate-float">
              <HeartPulse className="h-7 w-7 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Sign up with your mobile number or email to get started.
            </p>
          </div>

          <div className="mb-5 grid grid-cols-2 rounded-xl bg-muted p-1 text-sm">
            <button
              type="button"
              onClick={() => setTab("phone")}
              className={`flex items-center justify-center gap-1.5 rounded-lg py-2 transition ${
                tab === "phone" ? "bg-background shadow-sm font-medium" : "text-muted-foreground"
              }`}
            >
              <Phone className="h-4 w-4" /> Mobile
            </button>
            <button
              type="button"
              onClick={() => setTab("email")}
              className={`flex items-center justify-center gap-1.5 rounded-lg py-2 transition ${
                tab === "email" ? "bg-background shadow-sm font-medium" : "text-muted-foreground"
              }`}
            >
              <Mail className="h-4 w-4" /> Email
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="fullName">Full name</Label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Aarav Kapoor"
                  className="pl-9 h-11"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            {tab === "phone" ? (
              <div className="space-y-1.5">
                <Label htmlFor="phone">Mobile number</Label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98xxxxxxxx"
                    className="pl-9 h-11"
                    disabled={loading}
                    required
                  />
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Include country code. You'll receive an SMS verification code after creating your account.
                </p>
              </div>
            ) : (
              <div className="space-y-1.5">
                <Label htmlFor="email">Email address</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@genzmedi.com"
                    className="pl-9 h-11"
                    disabled={loading}
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPwd ? "text" : "password"}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="pl-9 pr-10 h-11"
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-muted-foreground hover:bg-muted"
                  aria-label={showPwd ? "Hide password" : "Show password"}
                >
                  {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirm">Confirm password</Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="confirm"
                  type={showPwd ? "text" : "password"}
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Re-enter password"
                  className="pl-9 h-11"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="h-11 w-full bg-gradient-hero text-primary-foreground shadow-glow transition-transform hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-70"
            >
              {loading ? "Creating account..." : "Create account"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/" className="font-medium text-primary hover:underline">
                Sign in
              </Link>
            </p>

            <p className="flex items-center justify-center gap-1.5 pt-1 text-center text-xs text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              Protected by SMS verification.
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
