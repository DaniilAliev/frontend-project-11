import axios from 'axios';

const parserFunc = (url, watchedState, i18nextInstance, isFormSubmit) =>
  axios
    .get(
      `https://allorigins.hexlet.app/get?url=${encodeURIComponent(
        url
      )}&params=${Math.random()}`
    )
    .then((response) => {
      if (response.status === 200 && isFormSubmit === true) {
      }
      const parser = new DOMParser();
      return parser.parseFromString(response.data.contents, 'text/xml');
    })
    .catch(() => {
      watchedState.isValid = false;
      watchedState.form.errors = i18nextInstance.t(
        'texts.statusMessage.networkError'
      );
    });

export default parserFunc;
