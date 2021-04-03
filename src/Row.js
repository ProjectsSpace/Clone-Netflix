import React, {useEffect, useState} from 'react'
import axios from './axios'
import './Row.css'
import YouTube from 'react-youtube'
import movieTrailer from 'movie-trailer'

// Declaring baseurl for the images to load up
const baseUrl = "https://image.tmdb.org/t/p/original/"

function Row (props) {
    const [movies, setmovies] = useState([])
    const [trailerUrl,setTrailerUrl] = useState("")
    
    useEffect(() => {
        // Fetching the movie lists for this particular row when the component is mounted
        async function fetchMovies () {
            const request = await axios.get(props.fetchUrl)

            // console.log(request.data.results)
            
            setmovies(request.data.results)
            
            return request
        }
        fetchMovies()

        // console.log(movies)

    }, [props.fetchUrl])

    // Setting options for the Youtube player
    const opts = {
        height: "390",
        width: "100%",
        playerVars: {
            autoplay: 1,
        },
    }

    // Getting the movie name for the movieTrailer extention to work
    const handleClick = (movieName) => {
        // sets the url to nothing if user clicks on the poster again
        // works like a toggle for setting trailerUrl set or unset
        if (trailerUrl) {
            setTrailerUrl("")
        }
        else {
            movieTrailer(movieName || "")
            .then(url => {
                const urlParams = new URLSearchParams(new URL(url).search)
                setTrailerUrl(urlParams.get('v'))
            })
            .catch (err => {
                // Setting up fallback trailer video if the trailer isn't found
                // just for the sake of consistency in design
                alert('Trailer isn\'t found for this movie, showing predefined one instead, click ok to watch')
                return setTrailerUrl("mjPUGem9SaY")
            })
        }
    }
    
    return (
        <div className="row">
            <h2 className="row__title">{props.title}</h2>

            <div className="row__posters">
                {movies.map(movie => (
                    <img 
                        // Not all movies has title name or original name set, so using all to be consistent
                        onClick={() => handleClick(movie?.title || movie?.name || movie?.original_name)}
                        key={movie.id}
                        className={`row__poster ${props.isLargeRow && "row__poster--large"}`}
                        src={`${baseUrl}${props.isLargeRow ? movie.poster_path : movie.backdrop_path}`} 
                        alt={movie?.title || movie?.name || movie?.original_name}
                    />
                ))}
            </div>
            
            {/* Only load the player if trailerUrl is set */}
            { trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
        </div>
    )
}

export default Row