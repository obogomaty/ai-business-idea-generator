import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <title>IdeaGen Pro | AI Business Ideas</title>
        <meta name="description" content="Generate AI-powered business ideas with Grok" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}