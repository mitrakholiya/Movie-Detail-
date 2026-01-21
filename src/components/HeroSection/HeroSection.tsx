import { useEffect, useState } from "react";
import { useMovieStore } from "../../context/MovieContext";



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

const MovieList = () => {
    const {
        movies,
        setMovies,
        selectedMovie,
        fav,
        setFavMovies,
        setSelectedMovie,
        loading,
        setLoading,
    } = useMovieStore();

    const API_KEY = import.meta.env.VITE_OMDB_API_KEY

    // For Page render
    const [page, setPage] = useState<number>(2)
    
    const [back, setBack] = useState<number>(1)


    useEffect(() => {
        const fetchMovies = async () => {
            try {
                setLoading(true);

                const res = await fetch(
                    `https://www.omdbapi.com/?apikey=${API_KEY}&s=movie&y=2025&type=movie&page=${page}`
                );

                const data: OMDBResponse = await res.json();
                if (data.Response === "True" && data.Search) {
                    setMovies(data.Search);
                } else {
                    setMovies([])
                }

            } catch (error) {
                console.error("Error fetching movies:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, [page, back]);

    // For one Selected movie
    const [movieDetails, setMovieDetails] = useState<any>(null);

    useEffect(() => {
        if (!selectedMovie) return;

        const fetchMovieDetails = async () => {
            try {
                setLoading(true);

                const res = await fetch(
                    `https://www.omdbapi.com/?apikey=${API_KEY}&i=${selectedMovie.imdbID}`
                );
                const data = await res.json();

                setMovieDetails(data); // contains imdbRating
                //this test

            } catch (error) {
                console.error("Error fetching movie details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMovieDetails();
    }, [selectedMovie]);

    // Add to Fav
    const addToFav = (
        e: React.MouseEvent<HTMLButtonElement>,
        movie: Movie
    ): void => {
        e.stopPropagation();

        const exists = fav.some(
            (favMovie: Movie) => favMovie.imdbID === movie.imdbID
        );

        if (!exists) {
            setFavMovies([...fav, movie]);
        }
    };

    return (
        <div className="container mx-auto sm:px-5 py-6">
            <button className="text-3xl font-bold mb-6 text-center" onClick={() => setBack(back + 1)}>🎬 Movie List</button>

            <div className="flex flex-wrap gap-6 justify-center">
                {movies.length >= 1 ? movies.map((movie) => (
                    <div key={movie.imdbID} className="bg-white shadow-lg rounded-lg overflow-hidden cursor-pointer hover:scale-105 transform transition duration-300 w-[250px] sm:w-[220px] flex flex-col justify-between" onClick={() => { setMovies([]); setSelectedMovie(movie) }} >
                        {/* Poster */}
                        <img src={movie.Poster !== "N/A" ? movie.Poster : "/placeholder.png"} alt={movie.Title} className="w-full h-[300px] sm:h-[250px] object-cover" />
                        {/* Movie Info */}
                        <div className="p-4">
                            <div className="min-h-[100px]">
                                <h2 className="text-lg font-semibold mb-1">{movie.Title}</h2>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">Year: {movie.Year}</p>
                            {/* {movie.Rating ? (
                                <p className="text-sm font-medium text-yellow-500"> ⭐ {movie.Rating || "N/A"} </p>
                            ) : ""} */}
                            <button
                                className="w-full my-[10px] bg-gray-400 py-[10px] hover:text-white hover:bg-gray-500 duration-500"
                                onClick={(e) => addToFav(e, movie)}
                            >
                                Add To Favorites
                            </button>
                        </div>
                    </div>
                )) : selectedMovie !== null && movieDetails ? (
                    <div className="bg-white shadow-lg rounded-lg overflow-hidden sm:min-w-[600px] sm:w-[900px] min-h-[400px] h-[500px] w-full sm:flex relative">
                        <img src={movieDetails.Poster !== "N/A" ? movieDetails.Poster : "/placeholder.png"} alt={movieDetails.Title} className="h-full object-cover" />
                        <button onClick={()=>setBack(back+1)} className="absolute h-[30px] text-[10px] w-[30px] bg-white rounded-[50%]">←</button>
                        <div className="p-4 flex flex-col justify-between">
                            <h2 className="text-lg font-semibold text-[32px]">{movieDetails.Title}</h2>
                            <p className="text-sm text-gray-600 text-[22px]">Year: {movieDetails.Year}</p>
                            <p className="text-sm text-gray-600">Genre: {movieDetails.Genre}</p>
                            <p className="text-sm font-medium text-yellow-500"> ⭐ IMDb: {movieDetails.imdbRating} </p>
                            <p className="text-sm text-gray-700 mt-2">{movieDetails.Plot}</p>
                            <button
                                className="w-full my-[10px] bg-gray-400 py-[10px] hover:text-white hover:bg-gray-500 duration-500"
                                onClick={(e) => addToFav(e, selectedMovie)}
                            >
                                Add To Favorites
                            </button>

                        </div>
                    </div>
                ) : selectedMovie !== null && !movieDetails ? (
                    <div className="flex justify-center items-center w-full h-64">
                        <span>Loading details...</span>
                    </div>
                ) : ""}
            </div>
            {movies.length >= 2 ? (<>
                <div className="flex justify-center">
                    {page !== 1 ? (<>
                        <button className="p-[10px] bg-blue-400 w-[80px] m-[10px] rounded-[30px] text-white" onClick={() => setPage(page - 1)}>Previus</button>
                    </>) : ""}
                    <button className="p-[10px] bg-blue-400 w-[80px] m-[10px] rounded-[30px] text-white" onClick={() => setPage(page + 1)}>next</button>
                </div>
            </>) : ""}
        </div >
    );
}

export default MovieList;
