import 'bootstrap';
import * as yup from 'yup';
import i18next from 'i18next';
import resources from './locales/index.js';
import validate from './validate.js';
import { createElementsForRender, updatePosts } from './createElemsForRender.js';
import watch from './view.js';

export default () => {
  const state = {
    form: {
      isValid: true,
      status: null,
      error: null,
    },
    feeds: [],
    posts: [],
    feedsAndPosts: {
      currentIdAndButton: {},
    },
    ui: {
      watchedPostsId: new Set(),
    },
    postIdInModal: '',
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

  const existingUrls = [];

  const defaultLang = 'ru';

  const i18nextInstance = i18next.createInstance();

  i18nextInstance
    .init({
      lng: defaultLang,
      debug: false,
      resources,
    })
    .then(() => {
      yup.setLocale({
        mixed: {
          notOneOf: 'texts.statusMessage.existing',
        },
        string: {
          required: 'texts.statusMessage.notEmpty',
          url: 'texts.statusMessage.invalid',
        },
      });

      elements.postsField.addEventListener('click', (eViewed) => {
        const watchedState = watch(state, elements, i18nextInstance);
        if (eViewed.target.tagName.toUpperCase() === 'BUTTON' || eViewed.target.tagName.toUpperCase() === 'A') {
          const currentId = eViewed.target.getAttribute('data-id');
          watchedState.ui.watchedPostsId.add(currentId);
          watchedState.postIdInModal = currentId;
        }
      });

      elements.form.addEventListener('submit', (e) => {
        const watchedState = watch(state, elements, i18nextInstance);

        watchedState.form.error = null;

        e.preventDefault();
        watchedState.form.status = 'loading';
        const formData = new FormData(e.target);
        const url = formData.get('url');
        validate(watchedState.feeds, url)
          .then(() => {
            watchedState.form.isValid = true;
            createElementsForRender(url, watchedState, existingUrls);
          })
          .catch((error) => {
            watchedState.form.isValid = false;
            watchedState.form.status = 'failed';
            watchedState.form.error = error.message;
          });

        updatePosts(watchedState);
      });
    });
};
