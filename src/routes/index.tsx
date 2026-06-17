import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Mail, ShieldCheck, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sign in — GenZ Medi" },
      { name: "description", content: "Sign in to GenZ Medi to manage your healthcare." },
    ],
  }),
  component: LoginPage,
});

const NAVY = "#080D24";
const NAVY_2 = "#121A3A";
const TEAL = "#00D4B4";

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [keep, setKeep] = useState(true);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    login();
    toast.success("Welcome back!");
    navigate({ to: "/dashboard" });
  };

  const onGoogle = () => {
    setLoading(true);
    setTimeout(() => {
      login();
      toast.success("Signed in with Google");
      navigate({ to: "/dashboard" });
    }, 500);
  };

  const stats = [
    { label: "50K+", sub: "Patients" },
    { label: "4.9★", sub: "Rating" },
    { label: "< 2 min", sub: "Wait time" },
  ];

  return (
    <div
      className="min-h-screen w-full font-sans text-white"
      style={{ fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif' }}
    >
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        {/* LEFT PANEL */}
        <section
          className="relative flex flex-col justify-between overflow-hidden px-6 py-8 sm:px-10 lg:px-14 lg:py-14"
          style={{ backgroundColor: NAVY }}
        >
          {/* pulsing radial glow */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
            style={{ background: `radial-gradient(circle, ${TEAL}33 0%, ${TEAL}10 40%, transparent 70%)` }}
            animate={{ opacity: [0.55, 0.9, 0.55], scale: [1, 1.08, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.4) 1px, transparent 1px)",
              backgroundSize: "44px 44px",
            }}
          />

          {/* logo */}
          <div className="relative flex items-center gap-2.5">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl shadow-lg"
              style={{ backgroundColor: TEAL, boxShadow: `0 8px 24px ${TEAL}55` }}
            >
              <Activity className="h-5 w-5" style={{ color: NAVY }} strokeWidth={2.6} />
            </div>
            <span className="text-lg font-bold tracking-tight">
              GenZ<span style={{ color: TEAL }}>Medi</span>
            </span>
          </div>

          {/* headline */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative my-10 lg:my-0"
          >
            <h1 className="text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Your health,
              <br />
              <span style={{ color: TEAL }}>your way.</span>
            </h1>
            <p className="mt-5 max-w-md text-sm text-white/65 sm:text-base">
              Book doctors, track prescriptions, and access your medical records — all in one secure, modern platform built for the next generation.
            </p>

            {/* stat pills */}
            <div className="mt-7 flex flex-wrap gap-2.5">
              {stats.map((s) => (
                <div
                  key={s.sub}
                  className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs backdrop-blur-sm sm:text-sm"
                >
                  <span className="font-semibold" style={{ color: TEAL }}>{s.label}</span>
                  <span className="text-white/60">{s.sub}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="relative text-xs text-white/40">
            © {new Date().getFullYear()} GenZ Medi. All rights reserved.
          </div>
        </section>

        {/* RIGHT PANEL */}
        <section
          className="relative flex items-center justify-center px-6 py-10 sm:px-10 lg:px-14"
          style={{ backgroundColor: NAVY_2 }}
        >
          {/* top teal accent */}
          <div
            className="absolute inset-x-0 top-0 h-px"
            style={{ background: `linear-gradient(90deg, transparent, ${TEAL}, transparent)` }}
          />

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full max-w-md"
          >
            <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
            <p className="mt-1.5 text-sm text-white/55">
              New here?{" "}
              <button
                type="button"
                onClick={() => toast.info("Sign-up coming soon")}
                className="font-medium hover:underline"
                style={{ color: TEAL }}
              >
                Create a free account
              </button>
            </p>

            {/* Google */}
            <Button
              type="button"
              onClick={onGoogle}
              disabled={loading}
              className="mt-7 h-11 w-full gap-2.5 border border-white/10 bg-white/[0.04] font-medium text-white hover:bg-white/[0.08]"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.4-1.6 4.1-5.5 4.1-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.3 14.6 2.3 12 2.3 6.7 2.3 2.4 6.6 2.4 12s4.3 9.7 9.6 9.7c5.5 0 9.2-3.9 9.2-9.4 0-.6-.1-1.1-.2-1.6H12z" />
              </svg>
              Continue with Google
            </Button>

            {/* divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 text-xs uppercase tracking-wider text-white/40" style={{ backgroundColor: NAVY_2 }}>
                  or sign in with email
                </span>
              </div>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-medium text-white/70">
                  Email or phone number
                </Label>
                <div className="relative group">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                  <Input
                    id="email"
                    type="text"
                    autoComplete="username"
                    placeholder="you@genzmedi.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 border-white/10 bg-white/[0.04] pl-9 text-white placeholder:text-white/35 focus-visible:border-[#00D4B4] focus-visible:ring-2 focus-visible:ring-[#00D4B4]/30"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-medium text-white/70">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                  <Input
                    id="password"
                    type={show ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 border-white/10 bg-white/[0.04] pl-9 pr-10 text-white placeholder:text-white/35 focus-visible:border-[#00D4B4] focus-visible:ring-2 focus-visible:ring-[#00D4B4]/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShow((s) => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-white/50 hover:bg-white/5 hover:text-white"
                    aria-label={show ? "Hide password" : "Show password"}
                  >
                    {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => toast.info("Password reset link sent")}
                    className="text-xs font-medium hover:underline"
                    style={{ color: TEAL }}
                  >
                    Forgot password?
                  </button>
                </div>
              </div>

              <label className="flex cursor-pointer items-center gap-2 text-sm text-white/70">
                <Checkbox
                  checked={keep}
                  onCheckedChange={(v) => setKeep(!!v)}
                  className="border-white/20 data-[state=checked]:border-[#00D4B4] data-[state=checked]:bg-[#00D4B4] data-[state=checked]:text-[#080D24]"
                />
                Keep me signed in for 30 days
              </label>

              <Button
                type="submit"
                disabled={loading}
                className="h-12 w-full font-semibold transition-transform hover:-translate-y-0.5 disabled:opacity-70"
                style={{
                  backgroundColor: TEAL,
                  color: NAVY,
                  boxShadow: `0 10px 28px ${TEAL}40`,
                }}
              >
                {loading ? "Signing in..." : "Sign in to GenZ Medi"}
              </Button>

              <div className="flex items-center justify-center gap-1.5 text-xs text-white/45">
                <ShieldCheck className="h-3.5 w-3.5" style={{ color: TEAL }} />
                256-bit encrypted & HIPAA-aligned
              </div>

              <p className="pt-2 text-center text-[11px] text-white/40">
                By continuing you agree to our{" "}
                <a href="#" className="underline hover:text-white/70">Terms</a> &{" "}
                <a href="#" className="underline hover:text-white/70">Privacy Policy</a>.
              </p>
            </form>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
