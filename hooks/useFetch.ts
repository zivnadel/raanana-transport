import { useEffect, useState } from "react";

export function useFetch<T>(url: string, options: RequestInit) {
	const [response, setResponse] = useState<T | null>(null);
	const [error, setError] = useState<any>();
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const abortController = new AbortController();

		setIsLoading(true);
		(async () => {
			try {
				const response = await fetch(url, {
					...options,
					signal: abortController.signal,
				});
				const data = await response.json();
				if (data.response) {
					setResponse(data.response);
				} else {
					setResponse(data);
				}
				setIsLoading(false);
			} catch (error: any) {
				if (isAbortError(error)) {
					return;
				}
				setError(error as any);
				setIsLoading(false);
			}
		})();
		return () => {
			abortController.abort();
		};
	}, [url, options]);

	return { response, error, isLoading };
}

// type guards
function isAbortError(error: any): error is DOMException {
	if (error && error.name === "AbortError") {
		return true;
	}
	return false;
}
