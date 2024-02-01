import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_API_URL

const axiosGet = (uri) => axios.get(BASE_URL + uri)
const axiosPost = (uri, data) => axios.post(BASE_URL + uri, data)
const axiosPut = (uri, data) => axios.put(BASE_URL + uri, data)

export default {
    axiosGet,
    axiosPost,
    axiosPut
}