import * as yup from 'yup';

const validate = (state, url) => {
  // yup.setLocale({
  //   mixed: {
  //     notOneOf:
  //   },
  //   string: {},
  // });

  const schema = yup.string().url().notOneOf(Array.of(state.currentURL));
  return schema.validate(url);
};
