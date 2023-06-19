import onChange from 'on-change';
import {
  renderBorder, renderErrors, renderFeeds, renderPosts, renderButtonsAndModal, renderForm,
  renderViewed,
} from './render.js';
import { updatePosts } from './createElemsForRender.js';

const watch = (state, elements, i18nextInstance) => {
  const watchedState = onChange(state, (path, value) => {
    if (path === 'form.isValid') {
      renderBorder(value, elements);
    }
    if (path === 'form.errors') {
      renderErrors(value, elements, i18nextInstance);
    }
    if (path === 'form.submittingProcess') {
      renderForm(value, elements);
    }
    if (path === 'feedsAndPosts.currentIdAndButton') {
      renderButtonsAndModal(value, elements);
    }
    if (path === 'feedsAndPosts.feeds') {
      renderFeeds(value, elements, i18nextInstance);

      const initAndRun = () => {
        updatePosts(value, watchedState, i18nextInstance);
        setTimeout(initAndRun, 5000);
      };

      initAndRun();
    }
    if (path === 'feedsAndPosts.watchedPostsId') {
      renderViewed(value);
    }
    if (path === 'feedsAndPosts.posts') {
      renderPosts(value, elements, i18nextInstance);
    }
  });
  return watchedState;
};

export default watch;
