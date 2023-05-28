import onChange from 'on-change';
import i18next from 'i18next';
import resources from './locales/index.js';
import validate from './validate.js';
import { renderBorder } from './render.js';
import { renderErrors } from './render.js';
import { renderFeeds } from './render.js';
import { renderPosts } from './render.js';
import parserFunc from './parser.js';
import _ from 'lodash';

export default () => {
  const state = {
    currentURL: [],
    isValid: null,
    errors: '',
    stateUI: {
      feeds: [],
      posts: [],
    },
  };

  const elements = {
    form: document.querySelector('form'),
    input: document.querySelector('input'),
    errorField: document.querySelector('.feedback'),
    feedField: document.querySelector('.feeds'),
    postsField: document.querySelector('.posts'),
  };

  // i18next

  const defaultLang = 'ru';

  const i18nextInstance = i18next.createInstance();

  i18nextInstance
    .init({
      lng: defaultLang,
      debug: true,
      resources,
    })
    .then(() => getUrlAndValidate());

  // вотчер за состоянием
  const watchedState = onChange(state, (path, value) => {
    if (path === 'isValid') {
      renderBorder(value, elements);
    }
    if (path === 'errors') {
      renderErrors(value, elements);
    }
    if (path === 'currentURL') {
      const initAndRun = () => {
        createElementsForRender(value);
        setTimeout(initAndRun, 5000);
      };

      initAndRun();

      // createElementsForRender(value);
    }
    if (path === 'stateUI.feeds') {
      console.log(value);
      renderFeeds(value, elements, i18nextInstance);
    }
    if (path === 'stateUI.posts') {
      // console.log(value);
      renderPosts(value, elements, i18nextInstance);
    }
  });

  // функция для получения урл из формы и изменения статуса isValid
  const getUrlAndValidate = () => {
    elements.form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const url = formData.get('url');
      validate(watchedState, url, i18nextInstance)
        .then(() => {
          watchedState.isValid = true;
          watchedState.currentURL.push(url);
          watchedState.errors = i18nextInstance.t('texts.statusMessage.successful');
        })
        .catch((error) => {
          watchedState.isValid = false;
          watchedState.errors = error.message;
        })
        .then(() => {
          if (watchedState.isValid === true) {
            elements.form.reset();
            elements.input.focus();
          }
        });
    });
  };

  const createElementsForRender = (urlAr) => {
    // console.log(urlAr);
    watchedState.stateUI.posts = [];
    const existingFeeds = watchedState.stateUI.feeds.map((feed) => feed.titleRSS);
    const existingPosts = new Set();
    // watchedState.stateUI.feeds = [];
    // фиды
    urlAr.forEach((url) =>
      parserFunc(url, watchedState, i18nextInstance)
        .then((parsedHTML) => {
          console.log(parsedHTML);
          // фиды
          const titleRSS = parsedHTML.querySelector('title').textContent;
          const descriptionRss =
            parsedHTML.querySelector('description').textContent;

          if (!existingFeeds.includes(titleRSS)) {
            watchedState.stateUI.feeds.unshift({ titleRSS, descriptionRss });
            existingFeeds.push(titleRSS);
          }

          // посты
          const items = parsedHTML.querySelectorAll('item');
          const newPost = [];
          items.forEach((item) => {
            const link = item.querySelector('link').textContent;
            const title = item.querySelector('title').textContent;
            const description = item.querySelector('description').textContent;
            const id = _.uniqueId();
            const status = 'unwatched';
            newPost.push({ id, title, description, link, status });
          });
          watchedState.stateUI.posts = [...newPost, ...watchedState.stateUI.posts];
        })
        .catch(() => {})
    );
  };
};
