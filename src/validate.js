import * as yup from 'yup';

const validate = (urlAr, url) => {
  const schema = yup.string().url().notOneOf(urlAr);
  return schema.validate(url);
};

export default validate;
