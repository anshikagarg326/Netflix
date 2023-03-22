import axios from 'axios';

const  instance = axios.create({
    baseURL: "https://api.themoviedb.org/3", //base URL which will make requests to the movie database
});

export default instance;