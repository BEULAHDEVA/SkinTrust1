"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import BackgroundVideo from "@/components/BackgroundVideo";

type Step = "method" | "email-input" | "otp";

export default function SignInPage() {
  const [step, setStep] = useState<Step>("method");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  // ── Email validation ──
  const validateEmail = (v: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setEmailError("");
    setLoading(true);
    // Simulate sending OTP
    setTimeout(() => {
      setLoading(false);
      setStep("otp");
      startResendCooldown();
    }, 1200);
  };

  // ── OTP input handling ──
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    setOtpError("");
    // Auto-focus next box
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      (nextInput as HTMLInputElement)?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      (prevInput as HTMLInputElement)?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      document.getElementById("otp-5")?.focus();
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) {
      setOtpError("Please enter all 6 digits.");
      return;
    }
    setLoading(true);
    // Simulate verification — accept any 6-digit code for demo
    setTimeout(() => {
      setLoading(false);
      window.location.href = "/dashboard";
    }, 1200);
  };

  const startResendCooldown = () => {
    setResendCooldown(30);
    const timer = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) { clearInterval(timer); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResend = () => {
    if (resendCooldown > 0) return;
    setOtp(["", "", "", "", "", ""]);
    setOtpError("");
    startResendCooldown();
    document.getElementById("otp-0")?.focus();
  };

  const handleGoogleSignIn = () => {
    setLoading(true);
    // Simulates Google OAuth redirect — replace with real OAuth provider
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 1000);
  };

  return (
    <main className="relative min-h-screen flex flex-col bg-background text-foreground overflow-hidden">
      <BackgroundVideo />

      {/* Back link */}
      <div className="relative z-10 p-6">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to Home
        </a>
      </div>

      <div className="relative z-10 flex-1 flex items-center justify-center px-4 pb-12">
        <div className="w-full max-w-md">

          {/* Logo mark */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center shadow-[0_0_40px_rgba(99,102,241,0.4)]">
                <span className="text-white text-2xl font-bold font-['General_Sans']">M</span>
              </div>
              {/* Glow ring */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-500 opacity-20 blur-xl scale-150" />
            </div>
          </div>

          {/* Card */}
          <div className="liquid-glass rounded-3xl border border-white/10 overflow-hidden shadow-2xl">

            {/* ── Step: Choose method ── */}
            {step === "method" && (
              <div className="p-8 flex flex-col gap-6">
                <div className="text-center">
                  <h1 className="text-2xl font-semibold font-['General_Sans'] tracking-tight">Sign in to KYC Mithra</h1>
                  <p className="text-white/40 text-sm mt-2">Choose how you'd like to continue</p>
                </div>

                {/* Google Button */}
                <button
                  id="signin-google"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-2xl bg-white text-gray-800 font-semibold text-sm hover:bg-gray-50 active:bg-gray-100 transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin" />
                  ) : (
                    <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                  )}
                  Continue with Google
                </button>

                {/* Divider */}
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="text-xs text-white/30 uppercase tracking-widest font-medium">or</span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>

                {/* Email Button */}
                <button
                  id="signin-email"
                  onClick={() => setStep("email-input")}
                  className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-500/30 text-white font-semibold text-sm transition-all"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5 text-indigo-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  Continue with Email
                </button>

                {/* SSO hint */}
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-indigo-500/5 border border-indigo-500/15">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 text-indigo-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <p className="text-xs text-white/40 leading-relaxed">
                    For enterprise SSO, contact your administrator to configure your workspace.
                  </p>
                </div>

                <p className="text-center text-xs text-white/20 leading-relaxed">
                  By signing in, you agree to our{" "}
                  <a href="#" className="text-white/40 hover:text-white underline underline-offset-2">Terms of Service</a>
                  {" "}and{" "}
                  <a href="#" className="text-white/40 hover:text-white underline underline-offset-2">Privacy Policy</a>.
                </p>
              </div>
            )}

            {/* ── Step: Email input ── */}
            {step === "email-input" && (
              <div className="p-8 flex flex-col gap-6">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => { setStep("method"); setEmail(""); setEmailError(""); }}
                    className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                  </button>
                  <div>
                    <h1 className="text-xl font-semibold font-['General_Sans']">Enter your email</h1>
                    <p className="text-white/40 text-xs mt-0.5">We'll send you a one-time code</p>
                  </div>
                </div>

                <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="email-input" className="text-sm font-medium text-white/70">
                      Work email address
                    </label>
                    <div className="relative">
                      <svg viewBox="0 0 24 24" className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                      <input
                        id="email-input"
                        type="email"
                        autoFocus
                        autoComplete="email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                        placeholder="you@company.com"
                        className={`w-full bg-white/5 border rounded-xl pl-11 pr-4 py-3.5 text-white text-sm focus:outline-none focus:ring-2 transition-all placeholder:text-white/20 ${
                          emailError
                            ? "border-rose-500/50 focus:ring-rose-500/20"
                            : "border-white/10 focus:ring-indigo-500/30 focus:border-indigo-500/40"
                        }`}
                      />
                    </div>
                    {emailError && (
                      <p className="text-xs text-rose-400 flex items-center gap-1.5">
                        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        {emailError}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    variant="heroSecondary"
                    disabled={loading || !email}
                    className="w-full py-4 rounded-xl font-semibold bg-indigo-500/20 hover:bg-indigo-500/30 border-indigo-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-indigo-300/40 border-t-indigo-300 rounded-full animate-spin" />
                        Sending code…
                      </>
                    ) : (
                      <>
                        Send verification code
                        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                        </svg>
                      </>
                    )}
                  </Button>
                </form>
              </div>
            )}

            {/* ── Step: OTP entry ── */}
            {step === "otp" && (
              <div className="p-8 flex flex-col gap-6">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => { setStep("email-input"); setOtp(["", "", "", "", "", ""]); setOtpError(""); }}
                    className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-colors"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                  </button>
                  <div>
                    <h1 className="text-xl font-semibold font-['General_Sans']">Check your inbox</h1>
                    <p className="text-white/40 text-xs mt-0.5">
                      We sent a 6-digit code to{" "}
                      <span className="text-indigo-400 font-medium">{email}</span>
                    </p>
                  </div>
                </div>

                {/* Email icon animation */}
                <div className="flex justify-center">
                  <div className="relative w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-7 h-7 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    {/* Ping dot */}
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-500 rounded-full flex items-center justify-center">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75 animate-ping" />
                      <span className="relative text-[8px] text-white font-bold">✓</span>
                    </span>
                  </div>
                </div>

                <form onSubmit={handleOtpSubmit} className="flex flex-col gap-5">
                  {/* OTP Boxes */}
                  <div className="flex justify-center gap-3" onPaste={handleOtpPaste}>
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        id={`otp-${i}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        autoFocus={i === 0}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        className={`w-11 h-14 text-center text-xl font-bold font-['General_Sans'] rounded-xl border bg-white/5 text-white transition-all focus:outline-none focus:scale-105 ${
                          otpError
                            ? "border-rose-500/50 focus:ring-2 focus:ring-rose-500/20"
                            : digit
                            ? "border-indigo-500/60 bg-indigo-500/10 focus:ring-2 focus:ring-indigo-500/30"
                            : "border-white/10 focus:border-indigo-500/40 focus:ring-2 focus:ring-indigo-500/20"
                        }`}
                      />
                    ))}
                  </div>

                  {otpError && (
                    <p className="text-xs text-rose-400 text-center flex items-center justify-center gap-1.5">
                      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      {otpError}
                    </p>
                  )}

                  <Button
                    type="submit"
                    variant="heroSecondary"
                    disabled={loading || otp.join("").length < 6}
                    className="w-full py-4 rounded-xl font-semibold bg-indigo-500/20 hover:bg-indigo-500/30 border-indigo-500/30 flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-indigo-300/40 border-t-indigo-300 rounded-full animate-spin" />
                        Verifying…
                      </>
                    ) : (
                      <>
                        Verify & Sign In
                        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </>
                    )}
                  </Button>
                </form>

                {/* Resend */}
                <div className="text-center">
                  <span className="text-xs text-white/30">Didn't receive a code? </span>
                  <button
                    onClick={handleResend}
                    disabled={resendCooldown > 0}
                    className={`text-xs font-medium transition-colors ${
                      resendCooldown > 0
                        ? "text-white/20 cursor-not-allowed"
                        : "text-indigo-400 hover:text-indigo-300"
                    }`}
                  >
                    {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend code"}
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Footer note */}
          <p className="text-center text-xs text-white/15 mt-6">
            Secured by KYC Mithra · SOC 2 Type II Certified
          </p>
        </div>
      </div>
    </main>
  );
}
