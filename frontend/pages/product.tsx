// frontend/pages/product.tsx
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import ReactMarkdown from "react-markdown";
import Header from "../components/Header";

export default function ProductPage() {
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const { isSignedIn, user } = useUser();

  // ✅ FIXED: Use unsafeMetadata with 'as any' for TypeScript safety
  useEffect(() => {
    if (isSignedIn && (user?.unsafeMetadata as any)?.plan !== "pro") {
      const usedToday = (user?.unsafeMetadata as any)?.ideasUsedToday || 0;
      if (usedToday >= 3) {
        window.location.href = "/pricing?upgrade=true";
      }
    }
  }, [isSignedIn, user]);

  const generateIdea = async () => {
    if (!isSignedIn) return alert("Please sign in first");
    
    setLoading(true);
    setIdea("");
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8005";
      const response = await fetch(`${apiUrl}/api`);
      
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;

        const chunk = decoder.decode(value);
        for (const line of chunk.split("\n")) {
          if (line.startsWith("data: ")) {
            const cleanText = line.replace("data: ", "").replace(/\\n/g, "\n");
            setIdea(prev => prev + cleanText);
          }
        }
      }
    } catch (error) {
      console.error("Stream error:", error);
      setIdea("Error generating idea. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      {/* ✅ FIXED: Plan Status Badge using unsafeMetadata */}
      {isSignedIn && (
        <div className="text-center mb-4">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            (user?.unsafeMetadata as any)?.plan === "pro" 
              ? "bg-green-100 text-green-800" 
              : "bg-yellow-100 text-yellow-800"
          }`}>
            {(user?.unsafeMetadata as any)?.plan === "pro" 
              ? "🚀 Pro Plan" 
              : "✨ Free Plan (3/day)"}
          </span>
        </div>
      )}

      <main className="container mx-auto px-6 py-12 max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Business Idea Generator</h1>
          <p className="text-gray-600">Powered by Groq AI • Real-time streaming</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg">
          <button
            onClick={generateIdea}
            disabled={loading || !isSignedIn}
            className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {loading ? " Generating..." : "Generate Business Idea"}
          </button>

          {idea && (
            <div className="mt-8 bg-slate-50 p-6 rounded-lg border border-slate-200">
              <div className="prose prose-blue max-w-none text-gray-800">
                <ReactMarkdown>{idea}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}