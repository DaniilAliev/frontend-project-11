import axios from 'axios';

const parserFunc = (url) =>
  axios
    .get(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}`)
    .then((response) => {
      const parser = new DOMParser();
      return parser.parseFromString(response.data.contents, 'text/xml');
    });

export default parserFunc;
