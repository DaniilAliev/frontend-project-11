import axios from 'axios';
import { renderErrors } from './render.js';

const parserFunc = (url, watchedState, i18nextInstance) =>
  axios
    .get(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}`)
    .then((response) => {
      const parser = new DOMParser();
      return parser.parseFromString(response.data.contents, 'text/xml');
    })
    .catch(() => {
      watchedState.errors = i18nextInstance.t('networkError');
    });

export default parserFunc;
