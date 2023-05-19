import * as yup from 'yup';

const validate = (state, url, i18nextInstance) => {
  yup.setLocale({
    mixed: {
      notOneOf: i18nextInstance.t('texts.statusMessage.existing'),
    },
    string: {
      url: i18nextInstance.t('texts.statusMessage.invalid'),
    },
  });

  const schema = yup.string().url().notOneOf(Array.of(state.currentURL));
  return schema.validate(url);
};

export default validate;
