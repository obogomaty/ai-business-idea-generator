import type { AppProps } from 'next/app';
import { ClerkProvider } from '@clerk/nextjs';
import '../styles/globals.css';

// 🔴 HARD CODED KEY FOR DEBUGGING ONLY
const CLERK_PUB_KEY = "pk_test_aHVtYmxlLXNvbGUtNTIuY2xlcmsuYWNjb3VudHMuZGV2JA";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider publishableKey={CLERK_PUB_KEY} {...pageProps}>
      <Component {...pageProps} />
    </ClerkProvider>
  );
}