import * as yup from 'yup';

const validate = (feeds, url) => {
  const urlAr = feeds.map((feed) => feed.link);
  const schema = yup.string().url().notOneOf(urlAr);
  return schema.validate(url);
};

export default validate;
