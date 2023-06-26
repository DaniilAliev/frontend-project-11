import {
  parserFunc, itemsInfo, getDataFromUrl,
} from './parser.js';

const networkError = (watchedState, i18nextInstance) => {
  watchedState.form.isValid = false;
  watchedState.form.errors = i18nextInstance.t(
    'texts.statusMessage.networkError',
  );
  watchedState.form.submittingProcess = false;
};

const createElementsForRender = (url, watchedState, i18nextInstance, existingUrls) => {
  const existingFeeds = watchedState.feedsAndPosts.feeds.map((feed) => feed.titleRSS);
  let newPost = [];
  getDataFromUrl(url)
    .catch(() => {
      networkError(watchedState, i18nextInstance);
    })
    .then((response) => parserFunc(response, watchedState, i18nextInstance, existingUrls, url))
    .then(({
      parsedData, titleRSS, descriptionRss, link,
    }) => {
      if (!existingFeeds.includes(titleRSS)) {
        watchedState.feedsAndPosts.feeds.unshift({ titleRSS, descriptionRss, link });
        existingFeeds.push(titleRSS);
      }

      const items = parsedData.querySelectorAll('item');
      itemsInfo(newPost, items);

      if (watchedState.feedsAndPosts.posts.length !== 0) {
        newPost = newPost.filter(
          (post) => !watchedState.feedsAndPosts.posts
            .some((statePost) => statePost.link === post.link),
        );
      }

      watchedState.feedsAndPosts.posts = [...newPost, ...watchedState.feedsAndPosts.posts];
    });
};

const updatePosts = (feeds, watchedState, i18nextInstance, existingUrls) => {
  const promises = feeds.map((feed) => getDataFromUrl(feed.link)
    .catch(() => {
      networkError(watchedState, i18nextInstance);
    })
    .then((response) => parserFunc(
      response,
      watchedState,
      i18nextInstance,
      existingUrls,
      feed.link,
    ))
    .then(({ parsedData }) => {
      const items = parsedData.querySelectorAll('item');
      let newPost = [];
      itemsInfo(newPost, items);

      if (watchedState.feedsAndPosts.posts.length !== 0) {
        newPost = newPost.filter(
          (post) => !watchedState.feedsAndPosts.posts
            .some((statePost) => statePost.link === post.link),
        );
      }

      watchedState.feedsAndPosts.posts = [...newPost, ...watchedState.feedsAndPosts.posts];
    }));

  Promise.allSettled(promises);
};
export { createElementsForRender, updatePosts };
