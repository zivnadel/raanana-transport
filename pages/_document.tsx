import { Html, Head, Main, NextScript } from "next/document";
import Footer from "../components/ui/Footer";
import Navbar from "../components/ui/Navbar";

function Document() {
	return (
		<Html>
			<Head>
				<title>הסעות רעננה</title>
				<meta name="robots" content="noindex, nofollow" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1, maximum-scale=1"></meta>
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}

export default Document;
