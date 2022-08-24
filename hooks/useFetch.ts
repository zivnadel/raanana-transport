import React, { useEffect, useState } from "react";
import { LoadingContext } from "../store/LoadingContext";

export function useFetch<T>(url: string, options: RequestInit) {
	const [response, setResponse] = useState<T | null>(null);
	const [error, setError] = useState<any>();

	const { isLoading, setIsLoading } = React.useContext(LoadingContext)!;

	useEffect(() => {
		setIsLoading(true);
		(async () => {
			try {
				const response = await fetch(url, {
					...options,
				});
				const data = await response.json();

				if (data.response) {
					setResponse(data.response);
				} else {
					setResponse(data);
				}
				setIsLoading(false);
			} catch (error: any) {
				setError(error as any);
				setIsLoading(false);
			}
		})();
	}, [url, options]);

	return { response, error, isLoading };
}
