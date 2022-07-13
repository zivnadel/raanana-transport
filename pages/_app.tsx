import '../styles/globals.css';

import type { AppProps } from 'next/app';
import Navbar from '../components/Navbar';
import Head from 'next/head';
import ErrorBoundary from '../components/ErrorBoundary';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary>
      <Head>
        <title>הסעות רעננה</title>
      </Head>
      <header>
        <Navbar />
      </header>
      <main>
        <Component {...pageProps} />
      </main>
    </ErrorBoundary>
  );
}

export default MyApp;
