"use client";

import { useState } from "react";
import Link from "next/link";
import {
  HiOutlineEnvelope,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiOutlineArrowLeft,
  HiArrowRight,
  HiOutlineExclamationCircle,
} from "react-icons/hi2";
import { login } from "@/lib/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      // Full page reload so AdminShell's useAuth re-mounts and reads the new
      // session from localStorage. Using router.replace() keeps stale state
      // and bounces us back to /admin/login.
      window.location.href = "/admin";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left: visual */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-dark/95 via-primary/85 to-primary/70" />
        <div className="absolute inset-0 bg-pattern-dots opacity-20" />

        <div className="relative flex flex-col justify-between p-12 text-white w-full">
          <Link href="/" className="inline-flex items-center gap-3 group w-fit">
            <div className="w-12 h-12 rounded-xl bg-white text-primary grid place-items-center font-extrabold text-lg shadow-lg">
              KS
            </div>
            <div>
              <div className="text-xl font-extrabold">Kajla Society</div>
              <div className="text-[11px] text-accent font-bn">
                কাজলা সোসাইটি
              </div>
            </div>
          </Link>

          <div>
            <h2 className="text-4xl xl:text-5xl font-extrabold leading-tight mb-4 tracking-tight">
              Welcome back to <br />
              <span className="text-accent">your community.</span>
            </h2>
            <p className="text-white/85 text-lg max-w-md leading-relaxed">
              Sign in to manage Kajla Society — articles, events, residents,
              applications, and more.
            </p>
          </div>

          <div className="text-xs text-white/60">
            © {new Date().getFullYear()} Kajla Society. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right: form */}
      <div className="flex-1 flex items-center justify-center bg-background p-6 lg:p-10">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-primary mb-8 transition"
          >
            <HiOutlineArrowLeft />
            Back to site
          </Link>

          {/* Mobile-only brand */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary text-white grid place-items-center font-extrabold text-lg shadow">
              KS
            </div>
            <div>
              <div className="text-lg font-extrabold text-primary">
                Kajla Society
              </div>
              <div className="text-[11px] text-muted font-bn">
                কাজলা সোসাইটি
              </div>
            </div>
          </div>

          <div className="mb-8">
            <span className="inline-block px-3 py-1 bg-accent text-primary text-[10px] uppercase tracking-widest rounded-full font-semibold mb-3">
              Admin Panel
            </span>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-primary tracking-tight">
              Sign in
            </h1>
            <p className="text-muted mt-2 text-sm">
              Enter your credentials to access the dashboard.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            {error && (
              <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2.5">
                <HiOutlineExclamationCircle className="text-lg flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-primary mb-2 uppercase tracking-wider">
                Email
              </label>
              <div className="relative">
                <HiOutlineEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-muted text-lg" />
                <input
                  type="email"
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                  placeholder="admin@kajla.org"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary mb-2 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-muted text-lg" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3 bg-white border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-primary transition"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <HiOutlineEyeSlash className="text-lg" />
                  ) : (
                    <HiOutlineEye className="text-lg" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-primary to-primary-light text-white font-semibold rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {submitting ? (
                "Signing in..."
              ) : (
                <>
                  Sign in <HiArrowRight />
                </>
              )}
            </button>
          </form>

          <p className="text-xs text-muted text-center mt-8">
            Need help accessing your account?{" "}
            <Link href="/contact" className="text-secondary hover:underline font-semibold">
              Contact support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
