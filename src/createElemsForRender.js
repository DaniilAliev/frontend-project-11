import { parseRssContent } from './parser.js';
import getDataFromUrl from './getDataFromUrl.js';

const networkError = (watchedState) => {
  watchedState.form.isValid = false;
  watchedState.form.error = 'texts.statusMessage.networkError';
  watchedState.form.status = 'failed';
};

const novalidRssError = (watchedState) => {
  watchedState.form.isValid = false;
  watchedState.form.status = 'failed';
  watchedState.form.error = 'texts.statusMessage.noValidRss';
};

const errorsCatcher = (e, watchedState) => {
  if (e.message === 'noValidRss') {
    novalidRssError(watchedState);
  } else {
    networkError(watchedState);
  }
};

const updatePosts = (watchedState) => {
  const update = () => {
    const promises = watchedState.feeds.map((feed) => getDataFromUrl(feed.link)
      .then((response) => {
        const { resultPosts } = parseRssContent(response, feed.link);
        let newPost = resultPosts;

        if (watchedState.posts.length !== 0) {
          newPost = newPost.filter(
            (post) => !watchedState.posts
              .some((statePost) => statePost.link === post.link),
          );
        }

        watchedState.posts = [...newPost, ...watchedState.posts];
      })
      .catch((e) => {
        errorsCatcher(e, watchedState);
      }));

    Promise.allSettled(promises).then(() => setTimeout(update, 5000));
  };

  update();
};

const createElementsForRender = (url, watchedState, existingUrls) => {
  const existingFeeds = watchedState.feeds.map((feed) => feed.titleRSS);
  let newPost = [];
  getDataFromUrl(url)
    .then((response) => {
      const {
        titleRSS, descriptionRss, link, resultPosts,
      } = parseRssContent(response, url);
      watchedState.form.status = 'succeed';
      existingUrls.push(url);

      if (watchedState.form.isValid !== false) {
        watchedState.form.error = 'texts.statusMessage.successful';
      }

      if (!existingFeeds.includes(link)) {
        watchedState.feeds.unshift({ titleRSS, descriptionRss, link });
        existingFeeds.push(titleRSS);
      }

      newPost = resultPosts;

      if (watchedState.posts.length !== 0) {
        newPost = newPost.filter(
          (post) => !watchedState.posts
            .some((statePost) => statePost.link === post.link),
        );
      }

      watchedState.posts = [...newPost, ...watchedState.posts];
    })
    .catch((e) => {
      errorsCatcher(e, watchedState);
    });
};

export { createElementsForRender, updatePosts };
