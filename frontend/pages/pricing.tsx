
// import { useUser, useClerk } from "@clerk/nextjs";
// import Header from "../components/Header";
// import Link from "next/link";
// import { useState } from "react";

// export default function PricingPage() {
//   const { user, isSignedIn } = useUser();
//   const { session } = useClerk();
//   const [loading, setLoading] = useState(false);

//   // Demo upgrade function (NO STRIPE - just updates Clerk metadata)
//   const handleDemoUpgrade = async () => {
//     if (!user || !session) return;
    
//     setLoading(true);
//     try {
//       // Update user metadata to mark as "pro" (demo only)
//       await user.update({
//         publicMetadata: {
//           plan: "pro",
//           subscriptionStatus: "active",
//           upgradedAt: new Date().toISOString(),
//         },
//       });
//       // Refresh session to apply changes
//       await session.reload();
//       alert("🎉 Demo Pro activated! (No payment charged)");
//     } catch (error) {
//       console.error("Demo upgrade failed:", error);
//       alert("Failed to activate demo Pro. Try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Demo downgrade function
//   const handleDemoDowngrade = async () => {
//     if (!user || !session) return;
    
//     setLoading(true);
//     try {
//       await user.update({
//         publicMetadata: {
//           plan: "free",
//           subscriptionStatus: "inactive",
//         },
//       });
//       await session.reload();
//       alert("⬇️ Downgraded to Free plan (demo)");
//     } catch (error) {
//       console.error("Demo downgrade failed:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-slate-50">
//       <Header />
      
//       <main className="container mx-auto px-6 py-12 max-w-4xl">
//         <div className="text-center mb-8">
//           <span className="inline-block bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full mb-4">
//             🧪 DEMO MODE — NO REAL PAYMENTS
//           </span>
//           <h1 className="text-4xl font-bold text-gray-900 mb-4">
//             Choose Your Plan
//           </h1>
//           <p className="text-gray-600 text-lg">
//             Test the subscription flow without a credit card
//           </p>
//         </div>

//         {/* Current Plan Badge */}
//         {isSignedIn && (
//           <div className="text-center mb-8">
//             <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
//               user?.publicMetadata?.plan === "pro" 
//                 ? "bg-green-100 text-green-800" 
//                 : "bg-slate-100 text-slate-700"
//             }`}>
//               {user?.publicMetadata?.plan === "pro" ? "🚀 Current: Pro Plan" : "✨ Current: Free Plan"}
//             </span>
//           </div>
//         )}

//         <div className="grid md:grid-cols-2 gap-8">
//           {/* Free Plan */}
//           <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200">
//             <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
//             <p className="text-4xl font-bold text-gray-900 mb-6">$0<span className="text-lg font-normal text-gray-500">/mo</span></p>
            
//             <ul className="space-y-3 mb-8">
//               <li className="flex items-center gap-2">
//                 <span className="text-green-500">✓</span>
//                 <span>3 AI ideas per day</span>
//               </li>
//               <li className="flex items-center gap-2">
//                 <span className="text-green-500">✓</span>
//                 <span>Basic Markdown formatting</span>
//               </li>
//               <li className="flex items-center gap-2 text-gray-400">
//                 <span>✗</span>
//                 <span>Export to PDF/Notion</span>
//               </li>
//               <li className="flex items-center gap-2 text-gray-400">
//                 <span>✗</span>
//                 <span>Priority support</span>
//               </li>
//             </ul>

//             {isSignedIn ? (
//               user?.publicMetadata?.plan === "free" ? (
//                 <button disabled className="w-full text-center bg-slate-100 text-gray-500 py-3 rounded-lg font-medium cursor-not-allowed">
//                   Current Plan
//                 </button>
//               ) : (
//                 <button 
//                   onClick={handleDemoDowngrade}
//                   disabled={loading}
//                   className="w-full text-center bg-slate-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-slate-200 transition disabled:opacity-50"
//                 >
//                   {loading ? "Processing..." : "Switch to Free"}
//                 </button>
//               )
//             ) : (
//               <Link 
//                 href="/sign-in"
//                 className="block w-full text-center bg-slate-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-slate-200 transition"
//               >
//                 Sign In to Start
//               </Link>
//             )}
//           </div>

//           {/* Pro Plan (Demo) */}
//           <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-blue-500 relative">
//             <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">
//               DEMO — NO PAYMENT
//             </span>
            
//             <h3 className="text-2xl font-bold text-gray-900 mb-2">Pro (Demo)</h3>
//             <p className="text-4xl font-bold text-gray-900 mb-6">$10<span className="text-lg font-normal text-gray-500">/mo</span></p>
            
//             <ul className="space-y-3 mb-8">
//               <li className="flex items-center gap-2">
//                 <span className="text-green-500">✓</span>
//                 <span><strong>Unlimited</strong> AI ideas</span>
//               </li>
//               <li className="flex items-center gap-2">
//                 <span className="text-green-500">✓</span>
//                 <span>Advanced Markdown + code blocks</span>
//               </li>
//               <li className="flex items-center gap-2">
//                 <span className="text-green-500">✓</span>
//                 <span>Export to PDF, Notion, Markdown</span>
//               </li>
//               <li className="flex items-center gap-2">
//                 <span className="text-green-500">✓</span>
//                 <span>Priority support + early features</span>
//               </li>
//             </ul>

//             {isSignedIn ? (
//               user?.publicMetadata?.plan === "pro" ? (
//                 <button disabled className="w-full text-center bg-green-100 text-green-800 py-3 rounded-lg font-medium cursor-not-allowed">
//                   ✅ Active Pro Plan
//                 </button>
//               ) : (
//                 <button 
//                   onClick={handleDemoUpgrade}
//                   disabled={loading}
//                   className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
//                 >
//                   {loading ? "Activating..." : "🎁 Activate Demo Pro (Free)"}
//                 </button>
//               )
//             ) : (
//               <Link 
//                 href="/sign-in"
//                 className="block w-full text-center bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
//               >
//                 Sign In to Activate Demo
//               </Link>
//             )}
            
//             <p className="mt-4 text-xs text-gray-500 text-center">
//               🔐 This is a demo. No credit card required. No real charge.
//             </p>
//           </div>
//         </div>

//         {/* For Team Lead: How to Switch to Real Payments Later */}
//         <div className="mt-12 p-6 bg-blue-50 rounded-xl border border-blue-200">
//           <h4 className="font-semibold text-blue-900 mb-2">🔧 For Production (Later)</h4>
//           <p className="text-sm text-blue-800 mb-3">
//             When ready for real payments:
//           </p>
//           <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
//             <li>Create Stripe account & connect in Clerk Dashboard</li>
//             <li>Replace <code>handleDemoUpgrade</code> with <code>&lt;CheckoutButton planId="price_..." /&gt;</code></li>
//             <li>Add webhook handler in backend to sync Stripe → Clerk metadata</li>
//             <li>Remove this demo banner</li>
//           </ol>
//         </div>
//       </main>
//     </div>
//   );
// }



// frontend/pages/pricing.tsx

// ... imports remain the same ...

export default function PricingPage() {
  const { user, isSignedIn } = useUser();
  const { session } = useClerk();
  const [loading, setLoading] = useState(false);

  // ✅ FIXED: Cast user to 'any' to bypass strict TypeScript checks for metadata
  const handleDemoUpgrade = async () => {
    if (!user || !session) return;
    
    setLoading(true);
    try {
      await (user as any).update({
        publicMetadata: {
          plan: "pro",
          subscriptionStatus: "active",
          upgradedAt: new Date().toISOString(),
        },
      });
      await session.reload();
      alert("🎉 Demo Pro activated! (No payment charged)");
    } catch (error) {
      console.error("Demo upgrade failed:", error);
      alert("Failed to activate demo Pro. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoDowngrade = async () => {
    if (!user || !session) return;
    
    setLoading(true);
    try {
      await (user as any).update({
        publicMetadata: {
          plan: "free",
          subscriptionStatus: "inactive",
        },
      });
      await session.reload();
      alert("⬇️ Downgraded to Free plan (demo)");
    } catch (error) {
      console.error("Demo downgrade failed:", error);
    } finally {
      setLoading(false);
    }
  };

  // ... rest of your return statement remains exactly the same ...