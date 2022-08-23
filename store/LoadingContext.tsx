import { useRouter } from "next/router";
import React from "react";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import Modal from "../components/ui/modals/Modal";

export interface LoadingContextType {
	isLoading: boolean;
	setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const LoadingContext = React.createContext<LoadingContextType | null>(
	null
);

export const LoadingContextProvider: React.FC = ({ children }) => {
	const [isLoading, setIsLoading] = React.useState(false);

	const dashboardContext: LoadingContextType = {
		isLoading,
		setIsLoading,
	};

	const router = useRouter();

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
		<LoadingContext.Provider value={dashboardContext}>
			{isLoading ? (
				<>
					<Modal>
						<LoadingSpinner />
					</Modal>
					{router.route === "/dashboard" && children}
				</>
			) : (
				children
			)}
		</LoadingContext.Provider>
	);
};
