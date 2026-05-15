// frontend/pages/pricing.tsx
"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import Header from "../components/Header";
import Link from "next/link";
import { useState } from "react";

export default function PricingPage() {
  const { user, isSignedIn } = useUser();
  const { session } = useClerk();
  const [loading, setLoading] = useState(false);

  // ✅ SAFE: Use Clerk's official metadata update pattern
  const handleDemoUpgrade = async () => {
    if (!user || !session) return;
    setLoading(true);
    try {
      // Clerk's official way to update public metadata
      await user.update({
        unsafeMetadata: {
          plan: "pro",
          subscriptionStatus: "active",
          upgradedAt: new Date().toISOString(),
        } as any,
      });
      await session.reload();
      alert("🎉 Demo Pro activated!");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Failed to activate demo Pro");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoDowngrade = async () => {
    if (!user || !session) return;
    setLoading(true);
    try {
      await user.update({
        unsafeMetadata: {
          plan: "free",
          subscriptionStatus: "inactive",
        } as any,
      });
      await session.reload();
      alert("⬇️ Downgraded to Free");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="container mx-auto px-6 py-12 max-w-4xl">
        <div className="text-center mb-8">
          <span className="inline-block bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full mb-4">
            🧪 DEMO MODE
          </span>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Free */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200">
            <h3 className="text-2xl font-bold">Free</h3>
            <p className="text-4xl font-bold my-4">$0/mo</p>
            <ul className="space-y-2 mb-6 text-gray-600">
              <li>✓ 3 AI ideas per day</li>
              <li>✓ Basic Markdown</li>
            </ul>
            <button disabled className="w-full bg-slate-100 text-gray-500 py-3 rounded-lg">Current Plan</button>
          </div>

          {/* Pro */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-blue-500 relative">
            <span className="absolute -top-3 left-1/2 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">MOST POPULAR</span>
            <h3 className="text-2xl font-bold">Pro</h3>
            <p className="text-4xl font-bold my-4">$10/mo</p>
            <ul className="space-y-2 mb-6 text-gray-600">
              <li>✓ Unlimited ideas</li>
              <li>✓ Export to PDF/Notion</li>
              <li>✓ Priority support</li>
            </ul>
            {isSignedIn ? (
              <button 
                onClick={handleDemoUpgrade}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
              >
                {loading ? "Activating..." : "✨ Activate Demo Pro"}
              </button>
            ) : (
              <Link href="/sign-in" className="block w-full text-center bg-blue-600 text-white py-3 rounded-lg">
                Sign In to Upgrade
              </Link>
            )}
          </div>
        </div>

        {isSignedIn && (
          <div className="mt-8 text-center">
            <span className={`inline-flex px-4 py-2 rounded-full text-sm font-medium ${
              (user?.unsafeMetadata as any)?.plan === "pro" 
                ? "bg-green-100 text-green-800" 
                : "bg-yellow-100 text-yellow-800"
            }`}>
              {(user?.unsafeMetadata as any)?.plan === "pro" ? "🚀 Pro Plan" : "✨ Free Plan"}
            </span>
          </div>
        )}
      </main>
    </div>
  );
}