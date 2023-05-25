import axios from 'axios';

const parserFunc = (url, watchedState, i18nextInstance) =>
  axios
    .get(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}`)
    .then((response) => {
      const parser = new DOMParser();
      return parser.parseFromString(response.data.contents, 'text/xml');
    })
    .catch(() => {
      watchedState.isValid = false;
      watchedState.errors = i18nextInstance.t('texts.statusMessage.networkError');
    });

export default parserFunc;
