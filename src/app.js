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
    feeds: [],
    posts: [],
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
      createElementsForRender(value);
    }
    if (path === 'feeds') {
      renderFeeds(value, elements, i18nextInstance);
    }
    if (path === 'posts') {
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

  const createElementsForRender = (urlAr, newFeed = [], newPost = []) => {
    console.log(urlAr);
    urlAr.forEach((url) =>
      parserFunc(url, watchedState, i18nextInstance).then((parsedHTML) => {
        // Фиды
        const titleRSS = parsedHTML.querySelector('title').textContent;
        const descriptionRss =
          parsedHTML.querySelector('description').textContent;

        const h3Feed = document.createElement('h3');
        h3Feed.classList.add('h6', 'm-0');
        h3Feed.textContent = titleRSS;

        const pFeed = document.createElement('p');
        pFeed.classList.add('m-0', 'small', 'text-black-50');
        pFeed.textContent = descriptionRss;

        const liFeed = document.createElement('li');
        liFeed.classList.add('list-group-item', 'border-0', 'border-end-0');
        [h3Feed, pFeed].forEach((item) => {
          liFeed.append(item);
        });
        newFeed.push(liFeed);

        const feeds = [...newFeed, ...watchedState.feeds];
        watchedState.feeds = feeds;

        // Посты
        const items = parsedHTML.querySelectorAll('item');
        items.forEach((item) => {
          const a = document.createElement('a');

          const link = item.querySelector('link').textContent;
          const title = item.querySelector('title').textContent;

          const id = _.uniqueId();
          a.href = link;
          a.textContent = title;
          a.classList.add('fw-bold');
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
          a.dataset.id = id;

          const button = document.createElement('button');
          button.textContent = i18nextInstance.t('texts.rssFeed.watch');
          button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
          button.type = 'button';
          button.setAttribute('data-id', id);
          button.setAttribute('data-bs-toggle', 'modal');
          button.setAttribute('data-bs-target', '#modal');

          const liPosts = document.createElement('li');
          liPosts.classList.add(
            'list-group-item',
            'd-flex',
            'justify-content-between',
            'align-items-start',
            'border-0',
            'border-end-0'
          );
          [a, button].forEach((item) => liPosts.append(item));
          newPost.push(liPosts);
        });

        const posts = [...newPost, ...watchedState.posts];
        watchedState.posts = posts;
      })
    );
  };
};
