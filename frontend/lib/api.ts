// frontend/lib/api.ts
import { fetchEventSource } from "@microsoft/fetch-event-source";

//  CRITICAL: Use environment variable for backend URL
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8005";

export interface IdeaStreamCallbacks {
  onMessage: (data: string) => void;
  onError?: (error: Error) => void;
  onClose?: () => void;
}

export async function streamIdea(
  getToken: () => Promise<string | null>,
  callbacks: IdeaStreamCallbacks
) {
  const jwt = await getToken();
  
  //  For testing: Skip auth check since backend endpoint is public
  // Remove this comment and re-enable auth when ready:
  // if (!jwt) {
  //   callbacks.onError?.(new Error('Authentication required'));
  //   return;
  // }

  try {
    await fetchEventSource(`${API_BASE}/api`, {  //  Use full URL with API_BASE
      method: 'GET',
      headers: {
        //  Only send auth header if you have a token AND backend requires it
        ...(jwt && { 'Authorization': `Bearer ${jwt}` }),
        'Accept': 'text/event-stream'
      },
      onmessage: (event) => {
        if (event.data) {
          // Decode escaped newlines for proper markdown display
          const cleanData = event.data.replace(/\\n/g, '\n');
          callbacks.onMessage(cleanData);
        }
      },
      onerror: (error) => {
        console.error('❌ SSE error:', error);
        callbacks.onError?.(error);
        // Don't throw - let fetchEventSource handle retries
      },
      onclose: () => {
        console.log(' SSE connection closed');
        callbacks.onClose?.();
      },
      //  Keep connection alive even if tab is hidden
      openWhenHidden: true,
    });
  } catch (err: any) {
    console.error('🔥 Streaming failed:', err);
    callbacks.onError?.(err);
  }
}