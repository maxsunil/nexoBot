
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, Lock, User, Briefcase, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";

export default function SignupPage() {
  const [step, setStep] = useState<"details" | "otp">("details");
  const [formData, setFormData] = useState({
    businessName: "",
    email: "",
    username: "",
    password: "",
    otp: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const router = useRouter();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Basic Validation
    if (!formData.email || !formData.username || !formData.password || !formData.businessName) {
         setMessage({ type: "error", text: "All fields are required" });
         setLoading(false);
         return;
    }

    try {
      // We use the existing send-otp route to verify email
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });
      
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to send OTP");

      setMessage({ type: "success", text: "OTP sent to your email!" });
      setStep("otp");
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Signup failed");

      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
      setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 dark:from-gray-950 dark:via-purple-950 dark:to-indigo-950 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 overflow-hidden relative">
      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
          <div className="text-center mb-8">
             <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
               Create Account
             </h2>
             <p className="text-gray-500 dark:text-gray-400">
               {step === 'details' ? 'Start your journey with us' : 'Verify email to continue'}
             </p>
          </div>

          {message && (
              <div className={`mb-6 flex items-start space-x-2 p-4 rounded-xl ${
                message.type === 'error' 
                  ? 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200' 
                  : 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200'
              }`}>
                {message.type === 'error' ? <AlertCircle className="h-5 w-5 flex-shrink-0" /> : <CheckCircle2 className="h-5 w-5 flex-shrink-0" />}
                <p className="text-sm">{message.text}</p>
              </div>
          )}

          {step === "details" ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <Label htmlFor="businessName">Business Name</Label>
                <div className="relative mt-1">
                    <Briefcase className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input id="businessName" placeholder="Acme Corp" className="pl-10" required 
                        value={formData.businessName} onChange={e => updateFormData('businessName', e.target.value)} />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email">Email Address</Label>
                <div className="relative mt-1">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input id="email" type="email" placeholder="you@example.com" className="pl-10" required 
                        value={formData.email} onChange={e => updateFormData('email', e.target.value)} />
                </div>
              </div>

               <div>
                <Label htmlFor="username">Username</Label>
                <div className="relative mt-1">
                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input id="username" placeholder="user123" className="pl-10" required 
                        value={formData.username} onChange={e => updateFormData('username', e.target.value)} />
                </div>
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative mt-1">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input id="password" type="password" placeholder="••••••••" className="pl-10" required 
                        value={formData.password} onChange={e => updateFormData('password', e.target.value)} />
                </div>
              </div>

              <Button type="submit" className="w-full mt-4" disabled={loading}>
                {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : "Next: Verify Email"}
                {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="space-y-6">
               <div className="text-center mb-4">
                 <p className="text-sm text-gray-600 dark:text-gray-300">
                    We sent a code to <span className="font-semibold">{formData.email}</span>
                 </p>
               </div>
               <div>
                <Label htmlFor="otp">Enter Verification Code</Label>
                <Input id="otp" placeholder="123456" className="text-center text-2xl tracking-widest letter-spacing-2" maxLength={6} required 
                    value={formData.otp} onChange={e => updateFormData('otp', e.target.value)} />
               </div>

               <Button type="submit" className="w-full" disabled={loading}>
                 {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : "Complete Signup"}
               </Button>
               
               <Button type="button" variant="ghost" className="w-full" onClick={() => setStep('details')} disabled={loading}>
                 Back to Details
               </Button>
            </form>
          )}

          <div className="mt-8 text-center text-sm">
             Already have an account?{' '}
             <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
               Log in
             </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
