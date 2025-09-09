import axios from 'axios';

const api = axios.create({
    baseURL: "http://localhost:8000" // fastapi backend URL
    });

 
export default api;