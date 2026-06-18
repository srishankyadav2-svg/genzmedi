import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Activity, Eye, EyeOff, Lock, Mail, Phone, ShieldCheck, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create your account — GenZ Medi" },
      { name: "description", content: "Join GenZ Medi — modern, secure healthcare built for you." },
    ],
  }),
  component: SignupPage,
});

const NAVY = "#080D24";
const NAVY_2 = "#121A3A";
const TEAL = "#00D4B4";

const signupSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z
    .string()
    .trim()
    .max(20)
    .optional()
    .or(z.literal("")),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password is too long"),
});

function SignupPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [agree, setAgree] = useState(true);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!agree) {
      toast.error("Please accept the Terms & Privacy Policy");
      return;
    }
    const parsed = signupSchema.safeParse({ fullName, email, phone, password });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: {
          full_name: parsed.data.fullName,
          phone: parsed.data.phone || null,
        },
      },
    });
    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }
    if (data.session) {
      toast.success("Welcome to GenZ Medi!");
      navigate({ to: "/dashboard" });
    } else {
      toast.success("Check your email to confirm your account");
      navigate({ to: "/" });
    }
  };

  const onGoogle = async () => {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setLoading(false);
      toast.error(result.error.message ?? "Google sign-in failed");
      return;
    }
    if (result.redirected) return;
    toast.success("Welcome to GenZ Medi!");
    navigate({ to: "/dashboard" });
  };

  const benefits = [
    { label: "Free", sub: "to join" },
    { label: "24/7", sub: "Care access" },
    { label: "HIPAA", sub: "Aligned" },
  ];

  return (
    <div
      className="min-h-screen w-full text-white"
      style={{ fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif' }}
    >
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        {/* LEFT PANEL */}
        <section
          className="relative flex flex-col justify-between overflow-hidden px-6 py-8 sm:px-10 lg:px-14 lg:py-14"
          style={{ backgroundColor: NAVY }}
        >
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

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative my-10 lg:my-0"
          >
            <h1 className="text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Start your
              <br />
              <span style={{ color: TEAL }}>care journey.</span>
            </h1>
            <p className="mt-5 max-w-md text-sm text-white/65 sm:text-base">
              Create your free GenZ Medi account in seconds — book doctors, manage prescriptions, and keep every record in one secure place.
            </p>

            <div className="mt-7 flex flex-wrap gap-2.5">
              {benefits.map((s) => (
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
            <h2 className="text-3xl font-bold tracking-tight">Create your account</h2>
            <p className="mt-1.5 text-sm text-white/55">
              Already a member?{" "}
              <Link to="/" className="font-medium hover:underline" style={{ color: TEAL }}>
                Sign in instead
              </Link>
            </p>

            <Button
              type="button"
              onClick={onGoogle}
              disabled={loading}
              className="mt-7 h-11 w-full gap-2.5 border border-white/10 bg-white/[0.04] font-medium text-white hover:bg-white/[0.08]"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.4-1.6 4.1-5.5 4.1-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.3 14.6 2.3 12 2.3 6.7 2.3 2.4 6.6 2.4 12s4.3 9.7 9.6 9.7c5.5 0 9.2-3.9 9.2-9.4 0-.6-.1-1.1-.2-1.6H12z" />
              </svg>
              Sign up with Google
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 text-xs uppercase tracking-wider text-white/40" style={{ backgroundColor: NAVY_2 }}>
                  or sign up with email
                </span>
              </div>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="fullName" className="text-xs font-medium text-white/70">Full name</Label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                  <Input
                    id="fullName"
                    type="text"
                    autoComplete="name"
                    placeholder="Jane Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="h-11 border-white/10 bg-white/[0.04] pl-9 text-white placeholder:text-white/35 focus-visible:border-[#00D4B4] focus-visible:ring-2 focus-visible:ring-[#00D4B4]/30"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-medium text-white/70">Email</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@genzmedi.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 border-white/10 bg-white/[0.04] pl-9 text-white placeholder:text-white/35 focus-visible:border-[#00D4B4] focus-visible:ring-2 focus-visible:ring-[#00D4B4]/30"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-xs font-medium text-white/70">
                  Phone <span className="text-white/40">(optional)</span>
                </Label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                  <Input
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="+1 555 123 4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-11 border-white/10 bg-white/[0.04] pl-9 text-white placeholder:text-white/35 focus-visible:border-[#00D4B4] focus-visible:ring-2 focus-visible:ring-[#00D4B4]/30"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-medium text-white/70">Password</Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                  <Input
                    id="password"
                    type={show ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="At least 8 characters"
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
              </div>

              <label className="flex cursor-pointer items-start gap-2 text-sm text-white/70">
                <Checkbox
                  checked={agree}
                  onCheckedChange={(v) => setAgree(!!v)}
                  className="mt-0.5 border-white/20 data-[state=checked]:border-[#00D4B4] data-[state=checked]:bg-[#00D4B4] data-[state=checked]:text-[#080D24]"
                />
                <span>
                  I agree to the{" "}
                  <a href="#" className="underline hover:text-white">Terms</a> &{" "}
                  <a href="#" className="underline hover:text-white">Privacy Policy</a>
                </span>
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
                {loading ? "Creating account..." : "Create your GenZ Medi account"}
              </Button>

              <div className="flex items-center justify-center gap-1.5 text-xs text-white/45">
                <ShieldCheck className="h-3.5 w-3.5" style={{ color: TEAL }} />
                256-bit encrypted & HIPAA-aligned
              </div>
            </form>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
