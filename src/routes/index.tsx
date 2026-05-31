import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  HeartPulse,
  Lock,
  Mail,
  MessageSquare,
  Phone,
  ShieldCheck,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "sonner";
import {
  identifierToAuthEmail,
  isMfaVerified,
  parseIdentifier,
  requestEmailOtp,
  setMfaVerified,
  signInWithPassword,
  verifyEmailOtp,
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
          "Securely sign in to GenZ Medi with email or mobile, password, and a one-time verification code.",
      },
    ],
  }),
  component: LoginPage,
});

type Step = "credentials" | "channel" | "otp";
type Channel = "email" | "sms";

function LoginPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("credentials");
  const [identifierRaw, setIdentifierRaw] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [identifier, setIdentifier] = useState<Identifier | null>(null);
  const [authEmail, setAuthEmail] = useState("");
  const [channel, setChannel] = useState<Channel>("email");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendIn, setResendIn] = useState(0);

  // Already signed in AND MFA passed → skip to dashboard.
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
    if (!id) {
      toast.error("Enter a valid email or mobile number");
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
      setAuthEmail(identifierToAuthEmail(id));
      // Default channel based on identifier type
      setChannel(id.type === "email" ? "email" : "sms");
      setStep("channel");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Invalid credentials";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const onChooseChannel = async (chosen: Channel) => {
    if (chosen === "sms") {
      toast.info("SMS verification isn't set up yet", {
        description: "Use email OTP for now, or ask your admin to configure an SMS provider.",
      });
      return;
    }
    setChannel(chosen);
    setLoading(true);
    try {
      await requestEmailOtp(authEmail);
      toast.success("Verification code sent", {
        description: identifier?.type === "email" ? identifier.value : authEmail,
      });
      setStep("otp");
      setResendIn(45);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to send code";
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
      await verifyEmailOtp(authEmail, code);
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
      await requestEmailOtp(authEmail);
      toast.success("New code sent");
      setResendIn(45);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to resend";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const identifierIcon =
    identifierRaw.includes("@") ? (
      <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    ) : /\d/.test(identifierRaw) ? (
      <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    ) : (
      <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    );

  const heading =
    step === "credentials"
      ? "Welcome to GenZ Medi"
      : step === "channel"
      ? "Verify it's you"
      : "Enter your code";

  const subheading =
    step === "credentials"
      ? "Sign in with your email or mobile number."
      : step === "channel"
      ? "Choose how you'd like to receive your one-time code."
      : (
        <>
          We sent a 6-digit code to{" "}
          <span className="font-medium text-foreground">
            {identifier?.type === "email" ? identifier.value : authEmail}
          </span>
        </>
      );

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-soft p-4">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-24 h-96 w-96 rounded-full bg-primary/30 blur-3xl animate-blob" />
        <div className="absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-secondary/40 blur-3xl animate-blob [animation-delay:-7s]" />
        <div className="absolute top-1/3 right-1/4 h-72 w-72 rounded-full bg-accent/50 blur-3xl animate-blob [animation-delay:-3s]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-full max-w-md"
      >
        <div className="glass shadow-glow rounded-2xl p-6 sm:p-8">
          <div className="mb-6 flex flex-col items-center text-center">
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-hero shadow-glow animate-float"
            >
              <HeartPulse className="h-7 w-7 text-primary-foreground" />
            </motion.div>
            <h1 className="text-2xl font-bold tracking-tight">{heading}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{subheading}</p>
          </div>

          <AnimatePresence mode="wait">
            {step === "credentials" && (
              <motion.form
                key="creds"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.2 }}
                onSubmit={onCredentials}
                className="space-y-4"
              >
                <div className="space-y-1.5">
                  <Label htmlFor="identifier">Email or mobile number</Label>
                  <div className="relative">
                    {identifierIcon}
                    <Input
                      id="identifier"
                      type="text"
                      autoComplete="username"
                      placeholder="you@genzmedi.com or +91 98xxxxxxxx"
                      value={identifierRaw}
                      onChange={(e) => setIdentifierRaw(e.target.value)}
                      className="pl-9 h-11"
                      disabled={loading}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPwd ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="Your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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

                <Button
                  type="submit"
                  disabled={loading}
                  className="h-11 w-full bg-gradient-hero text-primary-foreground shadow-glow transition-transform hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-70"
                >
                  {loading ? "Checking..." : "Continue"}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  New to GenZ Medi?{" "}
                  <Link to="/signup" className="font-medium text-primary hover:underline">
                    Create an account
                  </Link>
                </p>

                <p className="flex items-center justify-center gap-1.5 pt-1 text-center text-xs text-muted-foreground">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                  Two-step verification keeps your health data safe.
                </p>
              </motion.form>
            )}

            {step === "channel" && (
              <motion.div
                key="channel"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
              >
                <button
                  type="button"
                  onClick={() => onChooseChannel("email")}
                  disabled={loading}
                  className="group flex w-full items-center gap-3 rounded-xl border border-border bg-card p-4 text-left transition hover:border-primary hover:bg-primary/5 disabled:opacity-60"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">Email me a code</div>
                    <div className="text-xs text-muted-foreground">
                      {identifier?.type === "email" ? identifier.value : "Sent to your account email"}
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => onChooseChannel("sms")}
                  disabled={loading}
                  className="group flex w-full items-center gap-3 rounded-xl border border-dashed border-border bg-muted/30 p-4 text-left opacity-80 transition hover:opacity-100"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">Text me a code</div>
                    <div className="text-xs text-muted-foreground">
                      SMS provider not configured yet
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setStep("credentials")}
                  className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Back
                </button>
              </motion.div>
            )}

            {step === "otp" && (
              <motion.form
                key="otp"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.2 }}
                onSubmit={onVerify}
                className="space-y-5"
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
                        <InputOTPSlot key={i} index={i} className="h-12 w-11 text-lg" />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                <Button
                  type="submit"
                  disabled={loading || code.length !== 6}
                  className="h-11 w-full bg-gradient-hero text-primary-foreground shadow-glow disabled:opacity-70"
                >
                  {loading ? "Verifying..." : "Verify & continue"}
                </Button>

                <div className="flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setStep("channel");
                      setCode("");
                    }}
                    className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" /> Change method
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

          <p className="pt-5 text-center text-xs text-muted-foreground">
            By continuing you agree to our Terms & Privacy Policy.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
