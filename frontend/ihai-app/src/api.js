import axios from 'axios'

// If you used the proxy above, keep baseURL as '/api'
const api = axios.create({
  baseURL: '/api'
})
export default api