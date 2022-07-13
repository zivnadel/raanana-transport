import { useEffect, useState } from 'react'

export function useFetch(url: string, options: RequestInit) {
  const [response, setResponse] = useState<any>(null)
  const [error, setError] = useState<any>();
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const abortController = new AbortController()

    setIsLoading(true)
    ;(async () => {
      try {
        const response = await fetch(url, {
          ...options,
          signal: abortController.signal,
        })
        setResponse(await response.json())
        setIsLoading(false)
      } catch (error: any) {
        if (isAbortError(error)) {
          return;
        }
        setError(error as any)
        setIsLoading(false)
      }
    })()
    return () => {
      abortController.abort()
    }
  }, [url, options])

  return { response, error, isLoading }
}

// type guards
function isAbortError(error: any): error is DOMException {
  if (error && error.name === "AbortError") {
    return true;
  }
  return false;
}
