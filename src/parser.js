import _ from 'lodash';

const parserError = (parsedHTML) => {
  if (parsedHTML.querySelector('parsererror')) {
    throw new Error('noValidRss');
  }
};

const parseRssContent = (response, url) => {
  const parser = new DOMParser();
  const parsedData = parser.parseFromString(response, 'text/xml');

  parserError(parsedData);

  const titleRSS = parsedData.querySelector('title').textContent;
  const descriptionRss = parsedData.querySelector('description').textContent;

  const items = parsedData.querySelectorAll('item');

  const resultPosts = Array.from(items).map((item) => {
    const link = item.querySelector('link').textContent;
    const title = item.querySelector('title').textContent;
    const description = item.querySelector('description').textContent;
    const id = _.uniqueId();
    return {
      id,
      title,
      description,
      link,
    };
  });

  return {
    titleRSS, descriptionRss, link: url, resultPosts,
  };
};

export {
  parseRssContent, parserError,
};
