import axios from 'axios';

export default axios.create({
  baseURL: 'https://api.unsplash.com',
  headers: {
    Authorization:
      'Client-ID e6fb9c03dfc88876d5c310d9552c7184bf6e873305f0c32b0a5024c1ce36f69b',
  }
});