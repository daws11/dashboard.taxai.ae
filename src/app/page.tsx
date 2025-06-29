"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signIn, useSession } from "next-auth/react";
import { ThemeToggle } from "@/components/ThemeToggle";
import Image from 'next/image';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [status, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (res?.ok) {
      router.replace("/dashboard");
    } else {
      setError("Invalid email or password.");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-blue-50 dark:bg-blue-950">
      <div className="relative w-full max-w-md">
        <div className="absolute top-4 right-4 z-10">
          <ThemeToggle />
        </div>
        <form
          onSubmit={handleLogin}
          className="bg-white dark:bg-blue-900 p-8 rounded-lg shadow-lg w-full space-y-6 border border-blue-200 dark:border-blue-800"
        >
          <div className="flex justify-center mb-2">
            <Image src="/taxai-logo.png" alt="TaxAi Logo" width={497} height={203} priority />
          </div>
          {/* <h1 className="text-2xl font-bold text-blue-900 dark:text-white text-center">Login to Your Account</h1> */}
          <div>
            <label htmlFor="email" className="block text-blue-900 dark:text-blue-200 mb-1">Email</label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-700 text-blue-900 dark:text-white"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-blue-900 dark:text-blue-200 mb-1">Password</label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-700 text-blue-900 dark:text-white"
              required
            />
          </div>
          <div className="flex justify-between items-center mt-2">
            <a href="#" className="text-blue-600 hover:underline text-sm">Forgot password?</a>
          </div>
          {error && <div className="text-red-600 text-sm text-center">{error}</div>}
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-800 dark:hover:bg-blue-900 flex items-center justify-center"
            disabled={loading || status === "loading"}
          >
            {loading || status === "loading" ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
                Loading...
              </span>
            ) : (
              "Login"
            )}
          </Button>
          <div className="mt-8 text-center text-sm text-blue-900 dark:text-blue-200">
            Login using an account you have previously created.<br />
            <span>
              Don&apos;t have an account?{' '}
              <a href="https://www.taxai.ae/register" className="text-blue-600 hover:underline">Register</a>
            </span>
          </div>
        </form>
      </div>
    </main>
  );
}
