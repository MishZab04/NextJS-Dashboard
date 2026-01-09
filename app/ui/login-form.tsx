"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { lusitana } from "@/app/ui/fonts";
import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { Button } from "./button";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setLoading(false);

    if (res?.error) {
      setError(res.error);
    } else {
      // login successful, redirect manually
      router.push("/dashboard"); // change to your desired page
    }
  };

  return (
    <form className="space-y-3" onSubmit={handleLogin}>
      {/* Email input */}
      <div className="relative">
        <AtSymbolIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border px-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      {/* Password input */}
      <div className="relative">
        <KeyIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border px-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      {/* Error message */}
      {error && (
        <div className="flex items-center text-red-500 text-sm">
          <ExclamationCircleIcon className="h-5 w-5 mr-1" />
          {error}
        </div>
      )}

      {/* Submit button */}
      <Button
        type="submit"
        className="w-full flex items-center justify-center gap-2"
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
        <ArrowRightIcon className="h-5 w-5" />
      </Button>
    </form>
  );
}
