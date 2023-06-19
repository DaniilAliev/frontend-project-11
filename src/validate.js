import * as yup from 'yup';

const validate = (urlAr, url) => {
  yup.setLocale({
    mixed: {
      notOneOf: 'texts.statusMessage.existing',
    },
    string: {
      required: 'texts.statusMessage.notEmpty',
      url: 'texts.statusMessage.invalid',
    },
  });

  const schema = yup.string().url().notOneOf(urlAr);
  return schema.validate(url);
};

export default validate;
