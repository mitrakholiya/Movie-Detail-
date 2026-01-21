import { useMovieStore } from "../../context/MovieContext";
import { useState, useEffect } from "react";

const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

type Movie = {
    imdbID: string;
    Title: string;
    Year: string;
    Poster: string;
};

type OMDBResponse = {
    Search?: Movie[];
    Response: "True" | "False";
    Error?: string;
};


const Header = () => {
    const {
        query,
        setQuery,
        movies,
        setMovies,
        fav,
        loading,
        setLoading,
        setFavMovies,
        selectedMovie,
        setSelectedMovie,
    } = useMovieStore();

    const [showPopup, setShowPopup] = useState<boolean>(false);

    // For Search Bar
    // Fetch movies as user types

    type Genere = "drama" | "action" | "comedy" | ""

    const [genere, setGenere] = useState<Genere>("");

    useEffect(() => {
        const searchTerm =
            genere.length >= 2 ? genere : query.trim();

        if (!searchTerm) {
            setMovies([]);
            setShowPopup(false);
            return;
        }

        const fetchMovies = async (): Promise<void> => {
            setLoading(true);
            try {
                const res = await fetch(
                    `https://www.omdbapi.com/?apikey=${API_KEY}&s=${searchTerm}&type=movie`
                );

                const data: OMDBResponse = await res.json();

                if (data.Response === "True" && data.Search) {
                    setMovies(data.Search);
                    if (query.length >= 1) {
                        setShowPopup(true);
                    }
                } else {
                    setMovies([]);
                    setShowPopup(false);
                }
            } catch (error: unknown) {
                if (error instanceof Error) {
                    console.error(error.message);
                }
                setMovies([]);
            } finally {
                setLoading(false);
            }
        };

        const timeout = setTimeout(fetchMovies, 400);
        return () => clearTimeout(timeout);

    }, [query, genere]);

    return (
        <div className="container mx-auto px-5 py-5 bg-blue-100 relative">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
                {/* Left section: Title + Genere + Favorite */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
                    <div className="text-2xl font-bold text-blue-800">🎬 Movie Details</div>
                    <select
                        className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-300"
                        value={genere}

                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                            setGenere(e.target.value as Genere)
                            setQuery('')
                        }}
                    >
                        <option value="" disabled hidden>
                            Genere
                        </option>
                        <option value="action">Action</option>
                        <option value="comedy">Comedy</option>
                        <option value="drama">Drama</option>
                    </select>

                    <button
                        className="text-blue-700 font-medium hover:text-blue-900 transition"
                        onClick={() => {
                            setSelectedMovie(null)
                            setMovies(fav)
                        }
                        }
                    >
                        Favorite
                    </button>
                </div>
                {/* Right section: Search Input */}
                <div className="relative w-full sm:w-64">
                    <input
                        type="search"
                        className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                        placeholder="Search movies..."
                        value={query}

                        onChange={(e) => {
                            setQuery(e.target.value)
                            setGenere('')
                        }}
                    />
                    {/* Popup Dropdown */}
                    {showPopup && movies.length > 0 && (
                        <div className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded shadow-lg z-10 max-h-64 overflow-y-auto mt-1">
                            {movies.map((movie: Movie) => (
                                <div
                                    key={movie.imdbID}
                                    className="flex items-center p-2 hover:bg-blue-50 cursor-pointer transition"
                                    onClick={() => {
                                        setSelectedMovie(movie);
                                        setQuery(movie.Title);
                                        setShowPopup(false);
                                    }}
                                >
                                    <img
                                        src={movie.Poster !== "N/A" ? movie.Poster : "/placeholder.png"}
                                        alt={movie.Title}
                                        className="w-10 h-14 object-cover rounded mr-3"
                                    />
                                    <div>
                                        <strong className="block text-gray-800">{movie.Title}</strong>
                                        <span className="text-gray-500 text-sm">{movie.Year}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
}

export default Header;
