import _ from 'lodash';
import parseRssContent from './parser.js';
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
  if (e.isParsingError) {
    novalidRssError(watchedState);
  } else {
    networkError(watchedState);
  }
};

const updatePosts = (watchedState) => {
  const update = () => {
    const updatedPosts = watchedState.feeds.map((feed) => getDataFromUrl(feed.link)
      .then((response) => {
        const { resultPosts } = parseRssContent(response, feed.link);

        const newPosts = resultPosts.filter(
          (post) => !watchedState.posts
            .some((statePost) => statePost.link === post.link),
        )
          .map((post) => ({ ...post, id: _.uniqueId() }));

        watchedState.posts = [...newPosts, ...watchedState.posts];
      })
      .catch((e) => {
        console.log(e);
      }));

    Promise.all(updatedPosts).then(() => setTimeout(update, 5000));
  };

  update();
};

const createElementsForRender = (url, watchedState) => {
  getDataFromUrl(url)
    .then((response) => {
      const {
        titleRSS, descriptionRss, link, resultPosts,
      } = parseRssContent(response, url);

      watchedState.form.status = 'succeed';

      watchedState.form.error = 'texts.statusMessage.successful';

      watchedState.feeds.unshift({ titleRSS, descriptionRss, link });

      const posts = resultPosts.map((post) => ({ ...post, id: _.uniqueId() }));

      watchedState.posts = [...posts, ...watchedState.posts];
    })
    .catch((e) => {
      errorsCatcher(e, watchedState);
    });
};

export { createElementsForRender, updatePosts };
