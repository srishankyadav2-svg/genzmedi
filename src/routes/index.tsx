import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, HeartPulse, Mail, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "sonner";
import { sendLoginOtp, verifyLoginOtp } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sign in — GenZ Medi" },
      { name: "description", content: "Sign in to GenZ Medi with a secure one-time email code." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendIn, setResendIn] = useState(0);

  // If already signed in, jump straight to dashboard.
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard" });
    });
  }, [navigate]);

  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  const validEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

  const onSendCode = async (e: FormEvent) => {
    e.preventDefault();
    if (!validEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    setLoading(true);
    try {
      await sendLoginOtp(email.trim());
      toast.success("Verification code sent", { description: `Check ${email} for a 6-digit code.` });
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
      await verifyLoginOtp(email.trim(), code);
      toast.success("Welcome to GenZ Medi!");
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
      await sendLoginOtp(email.trim());
      toast.success("New code sent");
      setResendIn(45);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to resend code";
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
            <h1 className="text-2xl font-bold tracking-tight">
              {step === "email" ? "Welcome to GenZ Medi" : "Verify your email"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {step === "email"
                ? "Enter your email and we'll send you a secure 6-digit code."
                : (
                  <>We sent a code to <span className="font-medium text-foreground">{email}</span></>
                )}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {step === "email" ? (
              <motion.form
                key="email"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.2 }}
                onSubmit={onSendCode}
                className="space-y-4"
              >
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email address</Label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      placeholder="you@genzmedi.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
                  {loading ? "Sending code..." : "Send verification code"}
                </Button>

                <p className="flex items-center justify-center gap-1.5 pt-2 text-center text-xs text-muted-foreground">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                  Passwordless, secure sign-in. No password needed.
                </p>
              </motion.form>
            ) : (
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
                      if (v.length === 6) {
                        // auto-submit
                        setTimeout(() => onVerify(), 50);
                      }
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
                    onClick={() => { setStep("email"); setCode(""); }}
                    className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" /> Change email
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
