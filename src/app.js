import onChange from 'on-change';
import i18next from 'i18next';
import resources from './locales/index.js';
import validate from './validate.js';
import { renderBorder } from './render.js';
import { renderErrors } from './render.js';

export default () => {
  const state = {
    currentURL: '',
    isValid: true,
    errors: '',
  };

  const elements = {
    form: document.querySelector('form'),
    input: document.querySelector('input'),
    errorField: document.querySelector('.feedback'),
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
  });

  // функция для получения урл из формы и изменения статуса isValid
  const getUrlAndValidate = () => {
    elements.form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const url = formData.get('url');
      validate(watchedState, url, i18nextInstance)
        .then(() => {
          watchedState.currentURL = url;
          watchedState.isValid = true;
          watchedState.errors = i18nextInstance.t(
            'texts.statusMessage.successful',
          );
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
};
