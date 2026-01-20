import { useMovieStore } from "../../context/MovieContext";
import { useState, useEffect } from "react";

const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

const Header = () => {
    const {
        query,
        setQuery,
        movies,
        setMovies,
        fav,
        loading,
        setLoading,
        selectedMovie,
        setSelectedMovie,
    } = useMovieStore();

    const [showPopup, setShowPopup] = useState(false);

    // Fetch movies as user types
    useEffect(() => {
        if (query.trim() === "") {
            setMovies([]);
            setShowPopup(false);
            return;
        }

        const fetchMovies = async () => {
            setLoading(true);
            try {
                const res = await fetch(
                    `https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}&type=movie`
                );
                const data = await res.json();
                setMovies(data.Search || []);
                setShowPopup(true);
            } catch (error) {
                console.error(error);
                setMovies([]);
            } finally {
                setLoading(false);
            }
        };

        const timeout = setTimeout(fetchMovies, 400); // debounce
        return () => clearTimeout(timeout);
    }, [query]);


    const [genre, setGenre] = useState("");
    // ...existing code...
    return (
        <div className="container mx-auto px-5 py-5 bg-blue-100 relative">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
                {/* Left section: Title + Genre + Favorite */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
                    <div className="text-2xl font-bold text-blue-800">🎬 Movie Details</div>
                    <select className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-300">
                        <option value="" selected hidden>
                            Genre
                        </option>
                        <option value="action">Action</option>
                        <option value="comedy">Comedy</option>
                        <option value="drama">Drama</option>
                    </select>
                    <button
                        className="text-blue-700 font-medium hover:text-blue-900 transition"
                        onClick={() =>
                            setMovies(fav)}
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
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    {/* Popup Dropdown */}
                    {showPopup && movies.length > 0 && (
                        <div className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded shadow-lg z-10 max-h-64 overflow-y-auto mt-1">
                            {movies.map((movie) => (
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
