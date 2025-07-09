import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3000/api', // Backend base URL
});

export default instance;