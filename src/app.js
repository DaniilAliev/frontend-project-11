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

      elements.postsField.addEventListener('click', (eViewed) => {
        const watchedState = watch(state, elements, i18nextInstance);
        if (eViewed.target.tagName.toUpperCase() === 'BUTTON' || eViewed.target.tagName.toUpperCase() === 'A') {
          const currentId = eViewed.target.getAttribute('data-id');
          watchedState.feedsAndPosts.watchedPostsId.add(currentId);
          const postInfo = {};

          watchedState.feedsAndPosts.posts.forEach((post) => {
            if (post.id === currentId) {
              postInfo.title = post.title;
              postInfo.description = post.description;
              postInfo.link = post.link;
            }
          });
          watchedState.feedsAndPosts.currentIdAndButton = { postInfo };
        }
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
            createElementsForRender(url, watchedState, i18nextInstance, existingUrls);
          })
          .then(() => {
            const initAndRun = () => {
              updatePosts(
                watchedState.feedsAndPosts.feeds,
                watchedState,
                i18nextInstance,
                existingUrls,
              );
              setTimeout(initAndRun, 5000);
            };

            initAndRun();
          })
          .catch((error) => {
            watchedState.form.isValid = false;
            watchedState.form.submittingProcess = false;
            watchedState.form.errors = error.message;
          });
      });
    });
};
