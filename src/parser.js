const parseRssContent = (response, url) => {
  const parser = new DOMParser();
  const parsedData = parser.parseFromString(response, 'text/xml');

  const parseError = parsedData.querySelector('parsererror');
  if (parseError) {
    parseError.isParsingError = true;
    throw parseError;
  }

  const titleRSS = parsedData.querySelector('title').textContent;
  const descriptionRss = parsedData.querySelector('description').textContent;

  const items = parsedData.querySelectorAll('item');

  const resultPosts = Array.from(items).map((item) => {
    const link = item.querySelector('link').textContent;
    const title = item.querySelector('title').textContent;
    const description = item.querySelector('description').textContent;
    return {
      title,
      description,
      link,
    };
  });

  return {
    titleRSS, descriptionRss, link: url, resultPosts,
  };
};

export default parseRssContent;
