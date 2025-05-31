import { useEffect, useState } from "react";

const APIKEY = "90f314a9";

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    function () {
      async function fetchMovies() {
        const controller = new AbortController();
        try {
          setIsLoading(true);
          setError("");
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${APIKEY}&s=${query}`,
            { signal: controller.signal }
          );
          if (!res.ok)
            throw new Error("Unable to fetch data. Something went wrong.");
          const data = await res.json();
          if (data.Response === "False") throw new Error(data.Error);
          setMovies(data.Search);
          setError("");
        } catch (err) {
          if (err.name !== "AbortError") {
            setError(err.message);
          }
        } finally {
          setIsLoading(false);
        }

        return function () {
          controller.abort();
        };
      }

      if (query.length < 3) {
        setError("");
        setMovies([]);
        return;
      }

      fetchMovies();
    },
    [query]
  );

  return { movies, isLoading, error };
}
