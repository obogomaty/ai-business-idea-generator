// // frontend/pages/product.tsx
// import { useState } from "react";
// import { useUser } from "@clerk/nextjs";
// import { fetchEventSource } from "@microsoft/fetch-event-source";
// import ReactMarkdown from "react-markdown";

// const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

// export default function ProductPage() {
//   const { isSignedIn } = useUser();
//   const [idea, setIdea] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleGenerate = async () => {
//     if (!isSignedIn) {
//       setError("Please sign in to generate ideas");
//       return;
//     }

//     setIdea("");
//     setIsLoading(true);
//     setError("");

//     try {
//       await fetchEventSource(`${API_URL}/api`, {
//         method: "GET",
//         headers: {
//           Accept: "text/event-stream",
//         },
//         onmessage(ev) {
//           if (ev.data) {
//             setIdea((prev) => prev + ev.data);
//           }
//         },
//         onerror(err) {
//           console.error("SSE error:", err);
//           throw err;
//         },
//       });
//     } catch (err: any) {
//       console.error("Streaming failed:", err);
//       setError("Error generating idea. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (!isSignedIn) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <h1 className="text-2xl font-bold mb-4">Please sign in</h1>
//           <p className="text-gray-600 mb-6">Sign in to generate AI business ideas</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-12 px-4">
//       <div className="max-w-3xl mx-auto">
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-gray-900">Business Idea Generator</h1>
//           <p className="text-gray-600 mt-2">Powered by Groq AI • Real-time streaming</p>
//         </div>

//         <div className="bg-white rounded-xl shadow-lg p-6">
//           <button
//             onClick={handleGenerate}
//             disabled={isLoading}
//             className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
//           >
//             {isLoading ? "✨ Generating..." : " Generate Business Idea"}
//           </button>

//           {error && (
//             <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
//                {error}
//             </div>
//           )}

//           {idea && (
//             <div className="mt-6 prose prose-blue max-w-none">
//               <ReactMarkdown>{idea}</ReactMarkdown>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


// frontend/pages/product.tsx
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import ReactMarkdown from "react-markdown";

//  Fixed: Default to port 8005 (your backend port)
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8005";

export default function ProductPage() {
  const { isSignedIn } = useUser();
  const [idea, setIdea] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    if (!isSignedIn) {
      setError("Please sign in to generate ideas");
      return;
    }

    setIdea("");
    setIsLoading(true);
    setError("");

    try {
      await fetchEventSource(`${API_URL}/api`, {
        method: "GET",
        headers: {
          Accept: "text/event-stream",
        },
        onmessage(ev) {
          if (ev.data) {
            //  Fixed: Convert literal "\n" to actual newlines for clean Markdown
            const clean = ev.data.replace(/\\n/g, '\n');
            setIdea((prev) => prev + clean);
          }
        },
        onerror(err) {
          console.error("SSE error:", err);
          throw err;
        },
      });
    } catch (err: any) {
      console.error("Streaming failed:", err);
      setError("Error generating idea. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in</h1>
          <p className="text-gray-600 mb-6">Sign in to generate AI business ideas</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Business Idea Generator</h1>
          <p className="text-gray-600 mt-2">Powered by Groq AI • Real-time streaming</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            {isLoading ? "✨ Generating..." : " Generate Business Idea"}
          </button>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
               {error}
            </div>
          )}

          {idea && (
            <div className="mt-6 prose prose-blue max-w-none whitespace-pre-wrap">
              <ReactMarkdown>{idea}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}