import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3000/api', // ✅ make sure this is correct
});

export default instance;
