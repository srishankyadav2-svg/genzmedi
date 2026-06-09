import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  HeartPulse,
  Lock,
  Phone,
  ShieldCheck,
  Stethoscope,
  Activity,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "sonner";
import {
  isMfaVerified,
  parseIdentifier,
  requestMobileOtp,
  setMfaVerified,
  signInWithPassword,
  verifyMobileOtp,
  type Identifier,
} from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sign in — GenZ Medi" },
      {
        name: "description",
        content:
          "Securely sign in to GenZ Medi with your mobile number, password, and a one-time SMS verification code.",
      },
    ],
  }),
  component: LoginPage,
});

type Step = "credentials" | "otp";

function LoginPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("credentials");
  const [identifierRaw, setIdentifierRaw] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [, setIdentifier] = useState<Identifier | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendIn, setResendIn] = useState(0);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session && isMfaVerified()) navigate({ to: "/dashboard" });
    });
  }, [navigate]);

  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  const onCredentials = async (e: FormEvent) => {
    e.preventDefault();
    const id = parseIdentifier(identifierRaw);
    if (!id || id.type !== "phone") {
      toast.error("Enter a valid mobile number (with country code)");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      await signInWithPassword({ identifier: id, password });
      setIdentifier(id);
      setPhoneNumber(id.value);
      await requestMobileOtp(id.value);
      toast.success("Verification code sent", { description: id.value });
      setStep("otp");
      setResendIn(45);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Invalid credentials";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const onVerify = async (e?: FormEvent) => {
    e?.preventDefault();
    if (code.length !== 6) {
      toast.error("Enter the 6-digit code");
      return;
    }
    setLoading(true);
    try {
      await verifyMobileOtp(phoneNumber, code);
      setMfaVerified();
      toast.success("Welcome back!");
      navigate({ to: "/dashboard" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Invalid or expired code";
      toast.error(msg);
      setCode("");
    } finally {
      setLoading(false);
    }
  };

  const onResend = async () => {
    if (resendIn > 0) return;
    setLoading(true);
    try {
      await requestMobileOtp(phoneNumber);
      toast.success("New code sent");
      setResendIn(45);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to resend";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-2">
      {/* LEFT — brand panel */}
      <aside className="relative hidden overflow-hidden bg-gradient-brand lg:flex lg:flex-col lg:justify-between lg:p-12">
        {/* decorative pattern */}
        <div className="pointer-events-none absolute inset-0 opacity-30">
          <div className="absolute -top-24 -left-16 h-80 w-80 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-[oklch(0.40_0.06_140)]/30 blur-3xl" />
          <svg
            className="absolute inset-0 h-full w-full opacity-[0.08]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
                <path d="M 32 0 L 0 0 0 32" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Brand mark */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative flex items-center gap-3"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/95 shadow-lg">
            <HeartPulse className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="text-lg font-semibold tracking-tight text-white">GenZ Medi</div>
            <div className="text-xs text-white/75">Modern healthcare, simplified</div>
          </div>
        </motion.div>

        {/* Hero copy */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative max-w-md space-y-6"
        >
          <h2 className="text-4xl font-semibold leading-tight tracking-tight text-white">
            Your health,
            <br />
            secured and in sync.
          </h2>
          <p className="text-base leading-relaxed text-white/85">
            Sign in to access your appointments, prescriptions and care team — protected by
            mobile-verified, end-to-end secure authentication.
          </p>

          <div className="grid gap-3 pt-2">
            {[
              { icon: ShieldCheck, label: "HIPAA-aligned data protection" },
              { icon: Stethoscope, label: "Connected with your care providers" },
              { icon: Activity, label: "Real-time vitals & records" },
            ].map((f) => (
              <div key={f.label} className="flex items-center gap-3 text-sm text-white/90">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15 backdrop-blur-sm">
                  <f.icon className="h-4 w-4" />
                </div>
                {f.label}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Footer testimonial */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="relative rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-md"
        >
          <Sparkles className="mb-2 h-4 w-4 text-white/80" />
          <p className="text-sm leading-relaxed text-white/90">
            "GenZ Medi made managing my family's care effortless. The SMS verification gives me
            real peace of mind."
          </p>
          <p className="mt-3 text-xs text-white/70">— Verified patient, since 2024</p>
        </motion.div>
      </aside>

      {/* RIGHT — form panel */}
      <main className="relative flex items-center justify-center bg-background p-6 sm:p-10">
        {/* mobile brand header */}
        <div className="absolute left-6 top-6 flex items-center gap-2 lg:hidden">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-hero shadow-glow">
            <HeartPulse className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-sm font-semibold tracking-tight">GenZ Medi</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <div className="mb-8">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border bg-secondary/40 px-3 py-1 text-xs font-medium text-secondary-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
              Secure clinical sign-in
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              {step === "credentials" ? "Sign in to your account" : "Verify it's you"}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {step === "credentials" ? (
                <>Enter your mobile number and password to continue.</>
              ) : (
                <>
                  We sent a 6-digit code to{" "}
                  <span className="font-medium text-foreground">{phoneNumber}</span>
                </>
              )}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {step === "credentials" && (
              <motion.form
                key="creds"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                onSubmit={onCredentials}
                className="space-y-5"
              >
                <div className="space-y-1.5">
                  <Label htmlFor="identifier" className="text-foreground/80">
                    Mobile number
                  </Label>
                  <div className="relative">
                    <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="identifier"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="+91 98xxxxxxxx"
                      value={identifierRaw}
                      onChange={(e) => setIdentifierRaw(e.target.value)}
                      className="h-12 rounded-lg border-input bg-card pl-10 text-base shadow-sm focus-visible:ring-2 focus-visible:ring-ring/40"
                      disabled={loading}
                      required
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Include country code (e.g., +91 for India)
                  </p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-foreground/80">
                      Password
                    </Label>
                    <button
                      type="button"
                      className="text-xs font-medium text-primary hover:underline"
                      onClick={() => toast.info("Contact your provider to reset your password.")}
                    >
                      Forgot?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPwd ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="Your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 rounded-lg border-input bg-card pl-10 pr-11 text-base shadow-sm focus-visible:ring-2 focus-visible:ring-ring/40"
                      disabled={loading}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd((v) => !v)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground hover:bg-muted"
                      aria-label={showPwd ? "Hide password" : "Show password"}
                    >
                      {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="h-12 w-full rounded-lg bg-primary text-base font-medium text-primary-foreground shadow-glow transition-all hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-lg"
                >
                  {loading ? "Sending code…" : "Continue"}
                </Button>

                <div className="relative py-1">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-background px-3 text-muted-foreground">or</span>
                  </div>
                </div>

                <p className="text-center text-sm text-muted-foreground">
                  New to GenZ Medi?{" "}
                  <Link to="/signup" className="font-medium text-primary hover:underline">
                    Create an account
                  </Link>
                </p>
              </motion.form>
            )}

            {step === "otp" && (
              <motion.form
                key="otp"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                onSubmit={onVerify}
                className="space-y-6"
              >
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={code}
                    onChange={(v) => {
                      setCode(v);
                      if (v.length === 6) setTimeout(() => onVerify(), 50);
                    }}
                    disabled={loading}
                  >
                    <InputOTPGroup>
                      {[0, 1, 2, 3, 4, 5].map((i) => (
                        <InputOTPSlot
                          key={i}
                          index={i}
                          className="h-14 w-12 rounded-lg border-input bg-card text-xl shadow-sm"
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                <Button
                  type="submit"
                  disabled={loading || code.length !== 6}
                  className="h-12 w-full rounded-lg bg-primary text-base font-medium text-primary-foreground shadow-glow hover:bg-primary/90 disabled:opacity-70"
                >
                  {loading ? "Verifying…" : "Verify & continue"}
                </Button>

                <div className="flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setStep("credentials");
                      setCode("");
                    }}
                    className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" /> Back
                  </button>
                  <button
                    type="button"
                    onClick={onResend}
                    disabled={resendIn > 0 || loading}
                    className="font-medium text-primary hover:underline disabled:text-muted-foreground disabled:no-underline"
                  >
                    {resendIn > 0 ? `Resend in ${resendIn}s` : "Resend code"}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          <p className="mt-10 text-center text-xs text-muted-foreground">
            By continuing you agree to our{" "}
            <a className="underline-offset-2 hover:underline" href="#">
              Terms
            </a>{" "}
            &{" "}
            <a className="underline-offset-2 hover:underline" href="#">
              Privacy Policy
            </a>
            .
          </p>
        </motion.div>
      </main>
    </div>
  );
}
