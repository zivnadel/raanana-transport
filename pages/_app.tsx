import "../styles/globals.css";

import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import Navbar from "../components/Navbar";
import Head from "next/head";
import ErrorBoundary from "../components/ErrorBoundary";
import Footer from "../components/Footer";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
	return (
		<ErrorBoundary>
			<Head>
				<title>הסעות רעננה</title>
				<meta name="robots" content="noindex, nofollow" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1, maximum-scale=1"></meta>
			</Head>
			<header>
				<Navbar />
			</header>
			<main className="h-[95vh]">
				<SessionProvider session={session}>
					<Component {...pageProps} />
				</SessionProvider>
			</main>
			<footer className="h-[5vh]">
				<Footer />
			</footer>
		</ErrorBoundary>
	);
}

export default MyApp;
