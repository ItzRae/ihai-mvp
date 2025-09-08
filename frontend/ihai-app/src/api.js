import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000', // FastAPI ported on 8000
    });

 
export default api;