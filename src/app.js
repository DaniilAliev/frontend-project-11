import onChange from 'on-change';
import i18next from 'i18next';
import _ from 'lodash';
import resources from './locales/index.js';
import validate from './validate.js';
import {
  renderBorder, renderErrors, renderFeeds, renderPosts, renderButtonsAndModal, renderForm,
} from './render.js';
import parserFunc from './parser.js';

export default () => {
  const state = {
    currentURL: [],
    isValid: null,
    form: {
      isSubmit: false,
      errors: '',
    },
    stateUI: {
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
    if (path === 'form.errors') {
      renderErrors(value, elements);
    }
    if (path === 'form.isSubmit') {
      renderForm(value, elements);
    }
    if (path === 'currentURL') {
      const initAndRun = () => {
        createElementsForRender(value);
        setTimeout(initAndRun, 5000);
      };

      initAndRun();
      // createElementsForRender(value);
    }
    if (path === 'stateUI.currentIdAndButton') {
      renderButtonsAndModal(value, elements);
    }
    if (path === 'stateUI.feeds') {
      renderFeeds(value, elements, i18nextInstance);
    }
    if (path === 'stateUI.posts') {
      renderPosts(value, elements, i18nextInstance);
    }
  });

  // функция для получения урл из формы и изменения статуса isValid,
  // добавления УРЛ если он валидный, а также контроля состояния формы
  const getUrlAndValidate = () => {
    elements.form.addEventListener('submit', (e) => {
      watchedState.isValid = null;
      watchedState.form.errors = '';

      e.preventDefault();
      watchedState.form.isSubmit = 'submitting';
      const formData = new FormData(e.target);
      const url = formData.get('url');
      validate(watchedState, url, i18nextInstance)
        .then(() => {
          watchedState.currentURL.push(url);
          watchedState.isValid = true;
        })
        .catch((error) => {
          watchedState.isValid = false;
          watchedState.form.isSubmit = false;
          watchedState.form.errors = error.message;
        });
    });
  };

  const createElementsForRender = (urlAr) => {
    const existingFeeds = watchedState.stateUI.feeds.map((feed) => feed.titleRSS);
    // фиды
    let newPost = [];
    urlAr.forEach((url) => parserFunc(url, watchedState, i18nextInstance)
      .then((parsedHTML) => {
        watchedState.form.isSubmit = true;
        if (watchedState.isValid !== false) {
          watchedState.form.errors = i18nextInstance.t('texts.statusMessage.successful');
        }
        if (parsedHTML.querySelector('parsererror')) {
          watchedState.isValid = false;
          watchedState.form.errors = i18nextInstance.t('texts.statusMessage.noValidRss');
        }

        // фиды
        const titleRSS = parsedHTML.querySelector('title').textContent;
        const descriptionRss = parsedHTML.querySelector('description').textContent;

        if (!existingFeeds.includes(titleRSS)) {
          watchedState.stateUI.feeds.unshift({ titleRSS, descriptionRss });
          existingFeeds.push(titleRSS);
        }

        // посты

        const items = parsedHTML.querySelectorAll('item');
        items.forEach((item) => {
          const link = item.querySelector('link').textContent;
          const title = item.querySelector('title').textContent;
          const description = item.querySelector('description').textContent;
          const id = _.uniqueId();
          const status = 'unwatched';

          newPost.push({
            id,
            title,
            description,
            link,
            status,
          });
        });

        if (watchedState.stateUI.posts.length !== 0) {
          newPost = newPost.filter(
            (post) => !watchedState.stateUI.posts.some((statePost) => statePost.link === post.link),
          );
        }

        watchedState.stateUI.posts = [...newPost, ...watchedState.stateUI.posts];
      })
      .then(() => {
        elements.postsField.addEventListener('click', (e) => {
          if (e.target.tagName.toUpperCase() === 'BUTTON' || e.target.tagName.toUpperCase() === 'A') {
            const currentId = e.target.getAttribute('data-id');
            const postInfo = {};

            watchedState.stateUI.posts.forEach((post) => {
              if (post.id === currentId) {
                postInfo.title = post.title;
                postInfo.description = post.description;
                postInfo.link = post.link;
              }
            });
            watchedState.stateUI.currentIdAndButton = { currentId, postInfo };
            watchedState.stateUI.posts.forEach((post) => {
              if (post.id === currentId) {
                post.status = 'watched';
              }
            });
          }
        });
      })
      .catch(() => {}));
  };

  // i18next
  
};
