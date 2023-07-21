import onChange from 'on-change';
import {
  renderBorder, renderErrors, renderFeeds, renderPosts, renderButtonsAndModal, renderForm,
  renderViewed,
} from './render.js';

const watch = (state, elements, i18nextInstance) => {
  const watchedState = onChange(state, (path, value) => {
    switch (path) {
      case 'form.isValid':
        renderBorder(value, elements);
        break;
      case 'form.error':
        renderErrors(value, elements, i18nextInstance);
        break;
      case 'form.status':
        renderForm(value, elements, watchedState.form);
        break;
      case 'postIdInModal':
        renderButtonsAndModal(value, elements, watchedState.posts);
        break;
      case 'feeds':
        renderFeeds(value, elements, i18nextInstance, watchedState);
        break;
      case 'ui.watchedPostsId':
        renderViewed(value);
        break;
      case 'posts':
        renderPosts(value, elements, i18nextInstance, watchedState.ui.watchedPostsId);
        break;
      default:
        throw new Error('Unknown state!');
    }
  });
  return watchedState;
};

export default watch;
