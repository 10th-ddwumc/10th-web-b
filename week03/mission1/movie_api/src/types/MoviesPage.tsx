import { useEffect, useState } from "react";
import type { Movie, MovieResponse } from "../types/movies";
import axios from "axios";

const MoviesPage = () => {
    const [movies, setMovies] = useState<Movie[]>([]);


    useEffect(() => {
        const fetchMovies = async () => {
            const {data} = await axios.get<MovieResponse>(
                'https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=1',{
                    headers: {
                        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhNjYzMjk0Mjk0OWQ5NGZmNTFkYzAyMGEyZTg3N2Q5ZiIsIm5iZiI6MTc3NDkxOTgwMi4wOTIsInN1YiI6IjY5Y2IyMDdhYWY0ZTI4YWU0N2NhM2JmZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.L-mQWy75DgVf1ZZnzZTOMR0CiM0MlsJSUsdVF4PemPE'
                    },
                }
            );
            setMovies(data.results);
        };

        fetchMovies();
    }, []);

    return(
        <ul className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4">
        {movies.map((movie) => (
            <li className="group relative w-full aspect-[2/3] overflow-hidden rounded-lg">
                <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    className="w-full h-full object-cover transition duration-300 group-hover:blur-sm"
                />

                <div className="absolute inset-0 flex flex-col items-center justify-center 
                                text-white opacity-0 group-hover:opacity-100 
                                transition">
                    <p className="text-sm font-bold">{movie.title}</p>
                    <p className="text-sm">{movie.overview}</p>
                </div>
            </li>
        ))}
        </ul>
    );
};

export default MoviesPage;