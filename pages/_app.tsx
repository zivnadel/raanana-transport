import "../styles/globals.css";

import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import Navbar from "../components/ui/Navbar";
import Head from "next/head";
import ErrorBoundary from "../components/ErrorBoundary";
import Footer from "../components/ui/Footer";
import { useRouter } from "next/router";
import React from "react";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import Modal from "../components/ui/modals/Modal";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
	const router = useRouter();

	const [isLoading, setIsLoading] = React.useState(false);

	React.useEffect(() => {
		const handleChangeStart = (url: string) => {
			if (url === "/dashboard" || url === "/login") {
				setIsLoading(true);
			}
		};

		const handleChangeEnd = (url: string) => {
			if (url === "/dashboard" || url === "/login" || url === "/unauthorized") {
				setIsLoading(false);
			}
		};

		router.events.on("routeChangeStart", handleChangeStart);
		router.events.on("routeChangeComplete", handleChangeEnd);
		router.events.on("routeChangeError", handleChangeEnd);
	}, []);

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
					{isLoading ? (
						<Modal>
							<LoadingSpinner />
						</Modal>
					) : (
						<Component {...pageProps} />
					)}
				</SessionProvider>
			</main>
			<footer className="h-[5vh]">
				<Footer />
			</footer>
		</ErrorBoundary>
	);
}

export default MyApp;
