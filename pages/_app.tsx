import '../styles/globals.css'

import type { AppProps } from 'next/app'
import Navbar from '../components/Navbar'
import Head from 'next/head'
import ErrorBoundary from '../components/ErrorBoundary'
import { Suspense } from 'react'
import LoadingSpinner from '../components/ui/LoadingSpinner'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
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
    </Suspense>
  )
}

export default MyApp
