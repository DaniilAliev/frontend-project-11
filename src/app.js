import onChange from 'on-change';
import * as yup from 'yup';

export default () => {
  const state = {
    currentURL: '',
    isValid: true,
  };

  const elements = {
    form: document.querySelector('form'),
    input: document.querySelector('input'),
  };

  // рендеры

  const render = (isValid, input) => {
    if (isValid === false) {
      input.classList.add('is-invalid');
    } else if (isValid === true) {
      input.classList.remove('is-invalid');
    }
  };

  // вотчер за состоянием
  const watchedState = onChange(state, (path, value) => {
    if (path === 'isValid') {
      render(value, elements.input);
    }
  });

  // функция для получения урл из формы и изменения статуса isValid
  const getUrlAndValidate = () => {
    elements.form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const url = formData.get('url');
      const schema = yup
        .string()
        .url()
        .notOneOf(Array.of(watchedState.currentURL));
      schema
        .validate(url)
        .then(() => {
          watchedState.isValid = true;
        })
        .catch(() => {
          watchedState.isValid = false;
        })
        .then(() => {
          watchedState.currentURL = url;
        })
        .then(() => {
          if (watchedState.isValid === true) {
            elements.form.reset();
            elements.input.focus();
          }
        });
    });
  };

  getUrlAndValidate();
};
