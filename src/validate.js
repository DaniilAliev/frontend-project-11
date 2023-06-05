import * as yup from 'yup';

const validate = (state, url, i18nextInstance) => {
  yup.setLocale({
    mixed: {
      notOneOf: i18nextInstance.t('texts.statusMessage.existing'),
    },
    string: {
      required: i18nextInstance.t('texts.statusMessage.notEmpty'),
      url: i18nextInstance.t('texts.statusMessage.invalid'),
    },
  });

  const schema = yup.string().url().notOneOf(state.currentURL);
  return schema.validate(url);
};

export default validate;
