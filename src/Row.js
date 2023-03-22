import React, { useState, useEffect } from "react";
import axios from "./axios";
import "./Row.css";
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";

const base_url = "https://image.tmdb.org/t/p/original";

function Row({ title, fetchURL, isLargerow }) {
  const [movies, setMovies] = useState([]); //saving all the movies in a state called as movies which is initially empty
  const [trailerURL, setURL] = useState("");
  //using useEffect as we want to run something based on a specific condition - useEffect is used if we want to run code on a specific condition
  useEffect(() => {
    async function fetchData() {
      console.log(movies);
      const request = await axios.get(fetchURL);
      setMovies(request.data.results); //we want array of  movies which is under data.results
      return request;
    }
    fetchData(); //we have to call this function this way if we're using async inside useEffect
  }, [fetchURL]);
  console.log(movies);
  //if we use any variable inside useEffect ,we'll have to provide it the square brackets above
  //as now it shows useEffect is dependent on fetchURL, so anytime fetchURL changes - useEffect will run again
  //if [] is empty ,then run useEffect only once

  const opts = {
    height: "400",
    width: "100%",
    playerVars: {
      autoplay: 1, //I want to autoplay the video as I open the page
    },
  };

  const handleClick = (movie) => {
    if (trailerURL) {
      //if there's already a URL playing ,then we'll remove it
      setURL("");
    } else {
      movieTrailer(movie?.name || "") //movieTrailer is an npm module that will start finding a trailer on youtube with a movie name that we'll  provide - also provided empty string if movie name is undefined
        .then((url) => {
          //it is a promise so it'll return a url
          //https://www.youtube.com/watch?v=XtMThy8QKqU
          const params = new URLSearchParams(new URL(url).search); //URLSearchParams allows us to use the 'get' keyword so that we get the exact id after v
          setURL(params.get("v")); // we want the id after v
        })
        .catch((error) => console.log(error));
    }
  };

  return (
    <div>
      <h2 className="title">{title}</h2>
      <div className="row_images">
        {movies.map((movie) => (
          <img
            key={movie.id}
            onClick={() => handleClick(movie)} //key is imp in map function so that it doesn't re-render the entire row - it just changes that particular element
            className={`row_image ${isLargerow && "row_imageLarger"}`}
            //backdroppath is not a url so added a base url to it
            src={`${base_url}${
              isLargerow ? movie.poster_path : movie.backdrop_path
            }`}
            alt={movie.name}
          ></img>
        ))}
      </div>
      {/* <YouTube videoId="XtMThy8QKqU" opts={opts}/>  -refer react-youtube documentation- just need to put options and video id */}
      {trailerURL && <YouTube videoId={trailerURL} opts={opts} />}
    </div>
  );
}
export default Row;
