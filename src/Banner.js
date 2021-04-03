import { useEffect, useState } from "react"
import axios from './axios'
import requests from './requests'

import './Banner.css'

// Baseurl for the banner image which sits in the background
const baseUrl = "https://image.tmdb.org/t/p/original/"

export default function Banner (props) {

    const [movie,setMovie] = useState([])

    useEffect (() => {
        async function fetchData() {
            const request = await axios.get(requests.fetchNetflixOriginals)

            // Choosing a movie randomly to set
            setMovie(request.data.results[
                Math.floor(Math.random() * request.data.results.length - 1)
            ])

            return request
        }
        fetchData()
    },[])

    // console.log(baseUrl+movie.backdrop_path)

    // truncate function for the banner description 
    // because it can be big
    function truncate(str,n) {
        return str?.length > n ? str.substr(0,n-1) + "..." : str
    }

    return (
        <header className="banner" 
            style={{
                backgroundImage: `url(${baseUrl}${movie?.backdrop_path})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center center',
            }}
        >
            <div className="banner__contents">
                <h1 className="banner__title">
                    {
                        movie?.title || movie?.name || movie?.original_name
                    }
                </h1>
                <div className="banner__buttons">
                    <button className="banner__button">Play</button>
                    <button className="banner__button">My List</button>
                </div>
                <div className="banner_description">
                    {truncate(movie?.overview,150)}
                </div>
            </div>
            <div className="fade--bottom" />
        </header>
    )
}