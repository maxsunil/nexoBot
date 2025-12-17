
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Lock, User, Bot, Sparkles, ArrowRight, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to login");

      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-blue-950 dark:to-indigo-950 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 overflow-hidden relative">
      {/* Background Elements omitted for brevity, keeping same style as previous if preferred, but simplifying for new structure */}
      
       <div className="w-full max-w-md relative z-10">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
           <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/50 mb-4">
                  <Bot className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome Back</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Sign in to your account</p>
           </div>

           {message && (
                  <div className={`mb-6 flex items-start space-x-2 p-4 rounded-xl ${
                    message.type === 'error' 
                      ? 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200' 
                      : 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200'
                  }`}>
                    <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <p className="text-sm">{message.text}</p>
                  </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
                <div>
                    <Label htmlFor="username">Username</Label>
                    <div className="relative mt-1">
                        <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input 
                            id="username" 
                            type="text" 
                            placeholder="Enter your username" 
                            className="pl-10" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required 
                        />
                    </div>
                </div>

                 <div>
                    <Label htmlFor="password">Password</Label>
                    <div className="relative mt-1">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input 
                            id="password" 
                            type="password" 
                            placeholder="••••••••" 
                            className="pl-10" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                        />
                    </div>
                </div>

                <Button type="submit" className="w-full text-lg py-6" disabled={loading}>
                    {loading ? <Loader2 className="animate-spin mr-2" /> : "Sign In"}
                </Button>
            </form>

            <div className="mt-8 text-center text-sm">
                Don't have an account?{' '}
                <Link href="/signup" className="font-semibold text-indigo-600 hover:text-indigo-500">
                    Sign up
                </Link>
            </div>
        </div>
       </div>
    </div>
  );
}
