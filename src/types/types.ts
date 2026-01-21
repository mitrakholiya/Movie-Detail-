 export  type Movie = {
        imdbID: string;
        Title: string;
        Year: string;
        Poster: string;
    };

export  type OMDBResponse = {
        Search?: Movie[];
        Response: "True" | "False";
        Error?: string;
    };
