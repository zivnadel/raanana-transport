import "../styles/globals.css";

import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import Head from "next/head";
import ErrorBoundary from "../components/ErrorBoundary";
import Footer from "../components/ui/Footer";
import Navbar from "../components/ui/Navbar";
import { LoadingContextProvider } from "../store/LoadingContext";

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
			<main className="mt-32 min-h-[95vh] lg:mt-0 lg:h-[95vh]">
				<SessionProvider session={session}>
					<LoadingContextProvider>
						<Component {...pageProps} />
					</LoadingContextProvider>
				</SessionProvider>
			</main>
			<footer className="h-[5vh]">
				<Footer />
			</footer>
		</ErrorBoundary>
	);
}

export default MyApp;
