
import axios from "axios";
const axiosBase = axios.create({
    // baseURL: "http://localhost:5400/api",
    baseURL: "https://evangadi-forum-ce9a2f3ee76f.herokuapp.com/api",

});

export default axiosBase;

