import { useEffect, useRef, useState } from "react";
import StarRating from "./StarRating";

// refs search enter key

const APIKEY = "90f314a9";
// const url = "http://www.omdbapi.com/?apikey=[yourkey]&";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
  const [query, setQuery] = useState("");
  const [watched, setWatched] = useState(() => {
    const stored = localStorage.getItem("watched");
    console.log(stored);
    return JSON.parse(stored) || [];
  });
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedID, setSelectedID] = useState(null);

  function handleSelectID(id) {
    if (id === selectedID) {
      setSelectedID(null);
    } else {
      setSelectedID(id);
    }
  }

  function handleCloseMovie() {
    setSelectedID(null);
  }

  function handleAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
    setSelectedID(null);
  }

  function handleDeleteWatched(id) {
    setWatched((curr) => curr.filter((movie) => movie.id !== id));
  }

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

  useEffect(
    function () {
      localStorage.setItem("watched", JSON.stringify(watched));
    },
    [watched]
  );

  return (
    <>
      <Navbar>
        <SearchBox query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </Navbar>
      <Main>
        <Box>
          {/* {isLoading ? <Loader /> : <MoviesList movies={movies} />} */}
          {isLoading && <Loader />}
          {error && <ErrorMessage err={error} />}
          {!isLoading && !error && (
            <MoviesList onSelectID={handleSelectID} movies={movies} />
          )}
        </Box>
        <Box>
          {selectedID ? (
            <MovieDetails
              onAddWatched={handleAddWatched}
              selectedID={selectedID}
              onCloseMovie={handleCloseMovie}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function Loader() {
  return <div className="loader">Loading...</div>;
}

function ErrorMessage({ err }) {
  return (
    <div className="error">
      <span>🛑</span> {err}
    </div>
  );
}

function Navbar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function SearchBox({ query, setQuery }) {
  const inputEl = useRef(null);

  useEffect(
    function () {
      function callback(e) {
        if (e.code === "Enter") {
          if (document.activeElement === inputEl) {
            return;
          }
          inputEl.current.focus();
          setQuery("");
        }
      }

      document.addEventListener("keypress", callback);

      return function () {
        document.removeEventListener("keypress", callback);
      };
    },
    [setQuery]
  );

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      ref={inputEl}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

function MoviesList({ movies, onSelectID }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} onSelectID={onSelectID} />
      ))}
    </ul>
  );
}

function Movie({ movie, onSelectID }) {
  return (
    <li onClick={() => onSelectID(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function MovieDetails({ selectedID, onCloseMovie, onAddWatched, watched }) {
  const [movieDetail, setMovieDetail] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [rating, setRating] = useState(0);

  const isWatched = watched.map((movie) => movie.id).includes(selectedID);
  const watchedRating = watched.find(
    (movie) => movie.id === selectedID
  )?.userRating;

  const {
    imdbID: id,
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movieDetail;

  function handleSetRating(rate) {
    setRating(rate);
  }

  useEffect(
    function () {
      async function fetchMovie() {
        try {
          setError("");
          setIsLoading(true);
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${APIKEY}&i=${selectedID}`
          );
          if (!res.ok)
            throw new Error(
              "Something went wrong. Unable to fetch requested movie."
            );
          const data = await res.json();
          if (data.Response === "False")
            throw new Error(
              "Something went wrong. Unable to fetch requested movie."
            );
          setMovieDetail(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      }

      fetchMovie();
    },
    [selectedID]
  );

  useEffect(
    function () {
      if (!title) return;
      document.title = title;

      return function () {
        document.title = "usePopcorn";
      };
    },
    [title]
  );

  useEffect(
    function () {
      function callback(e) {
        if (e.code === "Escape") {
          onCloseMovie();
        }
      }
      document.addEventListener("keypress", callback);

      return function () {
        document.removeEventListener("keypress", callback);
      };
    },
    [onCloseMovie]
  );
  return (
    <>
      {isLoading && <Loader />}
      {error && <ErrorMessage err={error} />}
      {!isLoading && !error && (
        <div className="details">
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={title} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime} &bull; {year}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐️</span> {imdbRating} IMDB Rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {isWatched ? (
                <p>You have rated this movie {watchedRating} ⭐️</p>
              ) : (
                <>
                  {" "}
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={handleSetRating}
                  />
                  {rating > 0 && (
                    <button
                      className="btn-add"
                      onClick={() =>
                        onAddWatched({
                          id,
                          title,
                          poster,
                          userRating: Number(rating),
                          imdbRating: Number(imdbRating),
                          runtime: Number(runtime.split(" ").at(0)),
                        })
                      }
                    >
                      + Add to watched
                    </button>
                  )}
                </>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </div>
      )}
    </>
  );
}

function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedMoviesList({ watched, onDeleteWatched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie
          movie={movie}
          key={movie.id}
          onDeleteWatched={onDeleteWatched}
        />
      ))}
    </ul>
  );
}

function WatchedMovie({ movie, onDeleteWatched }) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
      </div>
      <button className="btn-delete" onClick={() => onDeleteWatched(movie.id)}>
        x
      </button>
    </li>
  );
}
