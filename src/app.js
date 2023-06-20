import 'bootstrap';
import * as yup from 'yup';
import i18next from 'i18next';
import resources from './locales/index.js';
import validate from './validate.js';
import { createElementsForRender } from './createElemsForRender.js';
import watch from './view.js';

export default () => {
  const state = {
    form: {
      isValid: true,
      submittingProcess: false,
      errors: null,
    },
    feedsAndPosts: {
      feeds: [],
      posts: [],
      watchedPostsId: new Set(),
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

      elements.form.addEventListener('submit', (e) => {
        const watchedState = watch(state, elements, i18nextInstance);
        watchedState.form.isValid = null;
        watchedState.form.errors = '';

        e.preventDefault();
        watchedState.form.submittingProcess = 'submitting';
        const formData = new FormData(e.target);
        const url = formData.get('url');
        validate(existingUrls, url)
          .then(() => {
            watchedState.form.isValid = true;
            createElementsForRender(url, watchedState, i18nextInstance, elements, existingUrls);
          })
          .catch((error) => {
            watchedState.form.isValid = false;
            watchedState.form.submittingProcess = false;
            watchedState.form.errors = error.message;
          });
      });
    });
};
