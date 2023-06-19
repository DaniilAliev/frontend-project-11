import axios from 'axios';
import _ from 'lodash';

const parserFunc = (url, watchedState, i18nextInstance) => axios
  .get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(
    url,
  )}`, { timeout: 10000 })
  .then((response) => {
    const parser = new DOMParser();
    return parser.parseFromString(response.data.contents, 'text/xml');
  })
  .catch(() => {
    watchedState.form.isValid = false;
    watchedState.form.errors = i18nextInstance.t(
      'texts.statusMessage.networkError',
    );
    watchedState.form.submittingProcess = false;
  });

const getTitleFromParsedHTML = (parsedHTML) => parsedHTML.querySelector('title').textContent;

const getDescriptionFromParsedHTML = (parsedHTML) => parsedHTML.querySelector('description').textContent;

const parserError = (parsedHTML, watchedState, i18nextInstance, existingUrls, url) => {
  if (parsedHTML.querySelector('parsererror')) {
    watchedState.form.isValid = false;
    watchedState.form.submittingProcess = false;
    watchedState.form.errors = i18nextInstance.t('texts.statusMessage.noValidRss');
  } else {
    watchedState.form.submittingProcess = true;
    existingUrls.push(url);
  }
};

const itemsInfo = (newPost, items) => {
  items.forEach((item) => {
    const link = item.querySelector('link').textContent;
    const title = item.querySelector('title').textContent;
    const description = item.querySelector('description').textContent;
    const id = _.uniqueId();

    newPost.push({
      id,
      title,
      description,
      link,
    });
  });
};

const initAndRun = (urlParse, watchedState, i18nextInstance) => parserFunc(
  urlParse,
  watchedState,
  i18nextInstance,
)
  .then((parsedHTML) => {
    setTimeout(() => initAndRun(urlParse, watchedState, i18nextInstance), 5000);
    return parsedHTML;
  });

export {
  parserFunc, getTitleFromParsedHTML, getDescriptionFromParsedHTML, parserError, itemsInfo,
  initAndRun,
};
