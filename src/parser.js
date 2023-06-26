import axios from 'axios';
import _ from 'lodash';

const getDataFromUrl = (url) => axios
  .get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(
    url,
  )}`, { timeout: 45000 });

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

const parserFunc = (response, watchedState, i18nextInstance, existingUrls, url) => {
  const parser = new DOMParser();
  const parsedData = parser.parseFromString(response.data.contents, 'text/xml');

  parserError(parsedData, watchedState, i18nextInstance, existingUrls, url);

  if (watchedState.form.isValid !== false) {
    watchedState.form.errors = i18nextInstance.t('texts.statusMessage.successful');
  }

  const titleRSS = parsedData.querySelector('title').textContent;
  const descriptionRss = parsedData.querySelector('description').textContent;
  const link = url;

  return {
    parsedData, titleRSS, descriptionRss, link,
  };
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

export {
  parserFunc, parserError, itemsInfo, getDataFromUrl,
};
