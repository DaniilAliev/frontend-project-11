import axios from 'axios';

const getStringUrl = (url) => {
  const apiUrl = new URL('https://allorigins.hexlet.app/get');
  apiUrl.searchParams.set('disableCache', 'true');
  apiUrl.searchParams.set('url', url);
  return apiUrl.toString();
};

const getDataFromUrl = (url) => axios.get(getStringUrl(url), { timeout: 45000 })
  .then((response) => response.data.contents);

export default getDataFromUrl;
