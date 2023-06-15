/* eslint-disable no-use-before-define */
import 'bootstrap';
import onChange from 'on-change';
import i18next from 'i18next';
import resources from './locales/index.js';
import validate from './validate.js';
import {
  parserFunc, getTitleFromParsedHTML, getDescriptionFromParsedHTML, parserError, itemsInfo,
} from './parser.js';
import watch from './view.js';
import {
  renderBorder, renderErrors, renderFeeds, renderPosts, renderButtonsAndModal, renderForm,
} from './render.js';

export default () => {
  const state = {
    currentURL: [],
    form: {
      isValid: true,
      submittingProcess: false,
      errors: null,
    },
    feedsAndPosts: {
      feeds: [],
      posts: [],
      currentIdAndButton: {},
    },
  };

  const elements = {
    form: document.querySelector('form'),
    input: document.querySelector('input'),
    submitButton: document.querySelector('#submit'),
    errorField: document.querySelector('.feedback'),
    feedField: document.querySelector('.feeds'),
    postsField: document.querySelector('.posts'),
    modal: document.querySelector('.modal'),
    modalTitle: document.querySelector('.modal-title'),
    modalBody: document.querySelector('.modal-body'),
    modalFooterA: document.querySelector('.modal-footer a'),
  };

  const watchedState = onChange(state, (path, value) => {
    if (path === 'form.isValid') {
      renderBorder(value, elements);
    }
    if (path === 'form.errors') {
      renderErrors(value, elements);
    }
    if (path === 'form.submittingProcess') {
      renderForm(value, elements);
    }
    if (path === 'currentURL') {
      const initAndRun = () => {
        createElementsForRender(value);
        setTimeout(initAndRun, 5000);
      };

      initAndRun();
    }
    if (path === 'feedsAndPosts.currentIdAndButton') {
      renderButtonsAndModal(value, elements);
    }
    if (path === 'feedsAndPosts.feeds') {
      renderFeeds(value, elements, i18nextInstance);
    }
    if (path === 'feedsAndPosts.posts') {
      renderPosts(value, elements, i18nextInstance);
    }
  });
  // const watcher = watch(state, elements, i18nextInstance);
  const defaultLang = 'ru';

  const i18nextInstance = i18next.createInstance();

  i18nextInstance
    .init({
      lng: defaultLang,
      debug: true,
      resources,
    })
    .then(() => elements.form.addEventListener('submit', (e) => {
      watchedState.form.isValid = null;
      watchedState.form.errors = '';

      e.preventDefault();
      watchedState.form.submittingProcess = 'submitting';
      const formData = new FormData(e.target);
      const url = formData.get('url');
      validate(watchedState, url, i18nextInstance)
        .then(() => {
          watchedState.currentURL.push(url);
          watchedState.form.isValid = true;
        })
        .catch((error) => {
          watchedState.form.isValid = false;
          watchedState.form.submittingProcess = false;
          watchedState.form.errors = error.message;
        });
    }));

  
  // функция для получения урл из формы и изменения статуса isValid,
  // добавления УРЛ если он валидный, а также контроля состояния формы

  const createElementsForRender = (urlAr) => {
    const existingFeeds = watchedState.feedsAndPosts.feeds.map((feed) => feed.titleRSS);
    // фиды
    let newPost = [];
    urlAr.forEach((url) => parserFunc(url, watchedState, i18nextInstance)
      .then((parsedHTML) => {
        watchedState.form.submittingProcess = true;
        if (watchedState.form.isValid !== false) {
          watchedState.form.errors = i18nextInstance.t('texts.statusMessage.successful');
        }
        parserError(parsedHTML, watchedState, i18nextInstance);

        const titleRSS = getTitleFromParsedHTML(parsedHTML);
        const descriptionRss = getDescriptionFromParsedHTML(parsedHTML);

        if (!existingFeeds.includes(titleRSS)) {
          watchedState.feedsAndPosts.feeds.unshift({ titleRSS, descriptionRss });
          existingFeeds.push(titleRSS);
        }

        // посты

        const items = parsedHTML.querySelectorAll('item');
        itemsInfo(newPost, items);

        if (watchedState.feedsAndPosts.posts.length !== 0) {
          newPost = newPost.filter(
            (post) => !watchedState.feedsAndPosts.posts
              .some((statePost) => statePost.link === post.link),
          );
        }

        watchedState.feedsAndPosts.posts = [...newPost, ...watchedState.feedsAndPosts.posts];
      })
      .then(() => {
        elements.postsField.addEventListener('click', (e) => {
          if (e.target.tagName.toUpperCase() === 'BUTTON' || e.target.tagName.toUpperCase() === 'A') {
            const currentId = e.target.getAttribute('data-id');
            const postInfo = {};

            watchedState.feedsAndPosts.posts.forEach((post) => {
              if (post.id === currentId) {
                postInfo.title = post.title;
                postInfo.description = post.description;
                postInfo.link = post.link;
              }
            });
            watchedState.feedsAndPosts.currentIdAndButton = { postInfo };
            watchedState.feedsAndPosts.posts.forEach((post) => {
              if (post.id === currentId) {
                post.status = 'watched';
              }
            });
          }
        });
      })
      .catch(() => {}));
  };
};
