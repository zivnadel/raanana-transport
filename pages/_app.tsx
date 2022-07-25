import "../styles/globals.css";

import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import Navbar from "../components/Navbar";
import Head from "next/head";
import ErrorBoundary from "../components/ErrorBoundary";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
	return (
		<ErrorBoundary>
			<Head>
				<title>הסעות רעננה</title>
				<meta name="robots" content="noindex, nofollow" />
			</Head>
			<header>
				<Navbar />
			</header>
			<main>
				<SessionProvider session={session}>
					<Component {...pageProps} />
				</SessionProvider>
			</main>
		</ErrorBoundary>
	);
}

export default MyApp;
