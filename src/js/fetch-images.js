import axios from 'axios';

const API_KEY = '38062230-7402f65f1db4c269e21af0429';
const BASE_URL = 'https://pixabay.com/api/';

// Функція фечить запит
async function fetchImages(searchQuery) {
  const options = new URLSearchParams({
    key: API_KEY,
    q: searchQuery,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
  });

  const response = await axios.get(`${BASE_URL}?${options}`);

  return response;
}

export { fetchImages };
