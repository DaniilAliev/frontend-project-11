import {
  parserFunc,
  getTitleFromParsedHTML, getDescriptionFromParsedHTML, parserError, itemsInfo,
} from './parser.js';

const createElementsForRender = (url, watchedState, i18nextInstance, elements) => {
  const existingFeeds = watchedState.feedsAndPosts.feeds.map((feed) => feed.titleRSS);
  // фиды
  let newPost = [];
  parserFunc(url, watchedState, i18nextInstance)
    .then((parsedHTML) => {
      parserError(parsedHTML, watchedState, i18nextInstance, url);
      if (watchedState.form.isValid !== false) {
        watchedState.form.errors = i18nextInstance.t('texts.statusMessage.successful');
      }

      const titleRSS = getTitleFromParsedHTML(parsedHTML);
      const descriptionRss = getDescriptionFromParsedHTML(parsedHTML);

      if (!existingFeeds.includes(titleRSS)) {
        watchedState.feedsAndPosts.feeds.unshift({ titleRSS, descriptionRss });
        existingFeeds.push(titleRSS);
      }

      // посты

      const items = parsedHTML.querySelectorAll('item');
      itemsInfo(newPost, items);

      if (watchedState.feedsAndPosts.posts.length !== 0) {
        newPost = newPost.filter(
          (post) => !watchedState.feedsAndPosts.posts
            .some((statePost) => statePost.link === post.link),
        );
      }

      watchedState.feedsAndPosts.posts = [...newPost, ...watchedState.feedsAndPosts.posts];
    })
    .then(() => {
      elements.postsField.addEventListener('click', (eViewed) => {
        if (eViewed.target.tagName.toUpperCase() === 'BUTTON' || eViewed.target.tagName.toUpperCase() === 'A') {
          const currentId = eViewed.target.getAttribute('data-id');
          watchedState.feedsAndPosts.watchedPostsId.add(currentId);
          const postInfo = {};

          watchedState.feedsAndPosts.posts.forEach((post) => {
            if (post.id === currentId) {
              postInfo.title = post.title;
              postInfo.description = post.description;
              postInfo.link = post.link;
            }
          });
          watchedState.feedsAndPosts.currentIdAndButton = { postInfo };
        }
      });
    })
    .catch(() => {
    });
};

const updatePosts = (urlAr, watchedState, i18nextInstance) => {
  let newPost = [];
  urlAr.forEach((url) => parserFunc(url, watchedState, i18nextInstance)
    .then((parsedHTML) => {
      const items = parsedHTML.querySelectorAll('item');
      itemsInfo(newPost, items);

      if (watchedState.feedsAndPosts.posts.length !== 0) {
        newPost = newPost.filter(
          (post) => !watchedState.feedsAndPosts.posts
            .some((statePost) => statePost.link === post.link),
        );
      }

      watchedState.feedsAndPosts.posts = [...newPost, ...watchedState.feedsAndPosts.posts];
    }));
};
export { createElementsForRender, updatePosts };
