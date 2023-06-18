import onChange from 'on-change';
import {
  renderBorder, renderErrors, renderFeeds, renderPosts, renderButtonsAndModal, renderForm,
  renderViewed,
} from './render.js';

const watch = (state, elements, i18nextInstance, createElementsForRender) => {
  const watchedState = onChange(state, (path, value) => {
    if (path === 'form.isValid') {
      renderBorder(value, elements);
    }
    if (path === 'form.errors') {
      renderErrors(value, elements);
    }
    if (path === 'form.submittingProcess') {
      renderForm(value, elements);
    }
    if (path === 'currentURL') {
      const initAndRun = () => {
        createElementsForRender(value);
        setTimeout(initAndRun, 5000);
      };

      initAndRun();
    }
    if (path === 'feedsAndPosts.currentIdAndButton') {
      renderButtonsAndModal(value, elements);
    }
    if (path === 'feedsAndPosts.feeds') {
      renderFeeds(value, elements, i18nextInstance);
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
