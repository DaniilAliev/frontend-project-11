import 'bootstrap';
import * as yup from 'yup';
import i18next from 'i18next';
import resources from './locales/index.js';
import yupLocales from './locales/yupLocales.js';
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

  const validate = (arrayOfUrls, url) => {
    const schema = yup.string().url().notOneOf(arrayOfUrls);
    return schema.validate(url);
  };

  const defaultLang = 'ru';

  const i18nextInstance = i18next.createInstance();

  i18nextInstance
    .init({
      lng: defaultLang,
      debug: false,
      resources,
    })
    .then(() => {
      yup.setLocale(yupLocales);

      const watchedState = watch(state, elements, i18nextInstance);

      updatePosts(watchedState);

      elements.postsField.addEventListener('click', (eViewed) => {
        if (eViewed.target.tagName.toUpperCase() === 'BUTTON' || eViewed.target.tagName.toUpperCase() === 'A') {
          const currentId = eViewed.target.dataset.id;
          watchedState.ui.watchedPostsId.add(currentId);
          watchedState.postIdInModal = currentId;

          const readMoreButton = elements.modal.querySelector('.btn-primary');
          const post = watchedState.posts.find((item) => item.id === watchedState.postIdInModal);

          const onClickHandler = () => {
            window.open(post.link, '_blank');
          };
          readMoreButton.addEventListener('click', onClickHandler);

          elements.modal.addEventListener('hide.bs.modal', () => {
            readMoreButton.removeEventListener('click', onClickHandler);
          });
        }
      });

      elements.form.addEventListener('submit', (e) => {
        watchedState.form.error = null;

        e.preventDefault();
        watchedState.form.status = 'loading';
        const formData = new FormData(e.target);
        const url = formData.get('url');
        const arrayOfUrls = watchedState.feeds.map((feed) => feed.link);
        validate(arrayOfUrls, url)
          .then(() => {
            watchedState.form.isValid = true;
            createElementsForRender(url, watchedState);
          })
          .catch((error) => {
            watchedState.form.isValid = false;
            watchedState.form.status = 'failed';
            watchedState.form.error = error.message;
          });
      });
    });
};
