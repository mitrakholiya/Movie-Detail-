import { createContext, useState, useContext } from "react";
import type { ReactNode } from "react";

/* =====================
   Movie Type
===================== */
export type Movie = {
  imdbID: string;
  Title: string;
  Year: string;
  Rating: number;
  Poster: string;
};

/* =====================
   Context Type (Store Shape)
===================== */
type MovieContextType = {
  movies: Movie[];
  fav: Movie[];
  selectedMovie: Movie | null;
  loading: boolean;
  query:string;
  setQuery:React.Dispatch<React.SetStateAction<string>>
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
  setFavMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
  setSelectedMovie: React.Dispatch<React.SetStateAction<Movie | null>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

/* =====================
   Create Context
===================== */
const MovieContext = createContext<MovieContextType | undefined>(undefined);

/* =====================
   Provider
===================== */
export const MovieProvider = ({ children }: { children: ReactNode }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [fav, setFavMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [query, setQuery] = useState("");

  return (
    <MovieContext.Provider
      value={{
        movies,
        setMovies,
        fav,
        setFavMovies,
        selectedMovie,
        setSelectedMovie,
        loading,
        setLoading,
        query,
        setQuery,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};

/* =====================
   Hook
===================== */
export const useMovieStore = () => {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error("useMovieStore must be used within a MovieProvider");
  }
  return context;
};
