import axios from 'axios';

const getDataFromUrl = (url) => {
  const apiUrl = new URL('https://allorigins.hexlet.app/get');
  apiUrl.searchParams.set('disableCache', 'true');
  apiUrl.searchParams.set('url', url);

  return axios.get(apiUrl.toString(), { timeout: 45000 })
    .then((response) => response.data.contents);
};

export default getDataFromUrl;
