import onChange from 'on-change';
import {
  renderBorder, renderErrors, renderFeeds, renderPosts, renderButtonsAndModal, renderForm,
  renderViewed,
} from './render.js';

const watch = (state, elements, i18nextInstance) => {
  const watchedState = onChange(state, (path, value) => {
    if (path === 'form.isValid') {
      renderBorder(value, elements);
    }
    if (path === 'form.error') {
      renderErrors(value, elements, i18nextInstance);
    }
    if (path === 'form.status') {
      renderForm(value, elements, watchedState.form);
    }
    if (path === 'postIdInModal') {
      renderButtonsAndModal(value, elements, watchedState.posts);
    }
    if (path === 'feeds') {
      renderFeeds(value, elements, i18nextInstance, watchedState);
    }
    if (path === 'ui.watchedPostsId') {
      renderViewed(value);
    }
    if (path === 'posts') {
      renderPosts(value, elements, i18nextInstance, watchedState.ui.watchedPostsId);
    }
  });
  return watchedState;
};

export default watch;
