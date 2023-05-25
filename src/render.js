import parserFunc from './parser.js';
import _ from 'lodash';

const renderBorder = (isValid, elements) => {
  if (isValid === false) {
    elements.input.classList.add('is-invalid');
    elements.errorField.classList.remove('text-success');
    elements.errorField.classList.add('text-danger');
  } else if (isValid === true) {
    elements.input.classList.remove('is-invalid');
    elements.errorField.classList.remove('text-danger');
    elements.errorField.classList.add('text-success');
  }
};

const renderErrors = (error, elements) => {
  elements.errorField.textContent = error;
};

const renderFeeds = (value, elements, i18nextInstance) => {
  console.log(value);
  // renderState.posts = [];
  // watchedState.feeds = [];
  const ulFeed = document.createElement('ul');
  ulFeed.classList.add('list-group', 'border-0', 'border-end-0');
  ulFeed.replaceChildren(...value);

  // делаем div card-body
  const h2Feed = document.createElement('h2');
  h2Feed.classList.add('card-title', 'h4');
  h2Feed.textContent = i18nextInstance.t('texts.rssFeed.feeds');
  const divCardBody = document.createElement('div');
  divCardBody.classList.add('card-body');
  divCardBody.replaceChildren(h2Feed);

  // делаем div card-border
  const divCardBorder = document.createElement('div');
  divCardBorder.classList.add('card', 'border-0');
  [divCardBody, ulFeed].forEach((item) => {
    divCardBorder.append(item);
  });

  // добавляем полученное в div feeds
  elements.feedField.innerHTML = '';
  elements.feedField.append(divCardBorder);
};

const renderPosts = (value, elements, i18nextInstance) => {
  // Посты
  const ulPosts = document.createElement('ul');
  ulPosts.classList.add('list-group', 'border-0', 'rounded-0');
  ulPosts.replaceChildren(...value);

  // создаем div card-body
  const h2Posts = document.createElement('h2');
  h2Posts.classList.add('card-title', 'h4');
  h2Posts.textContent = i18nextInstance.t('texts.rssFeed.posts');
  const divCardBodyPosts = document.createElement('div');
  divCardBodyPosts.classList.add('card-body');
  divCardBodyPosts.replaceChildren(h2Posts);

  // создаем div card border-0
  const divCardBorderPosts = document.createElement('div');
  divCardBorderPosts.classList.add('card', 'border-0');
  [divCardBodyPosts, ulPosts].forEach((item) => {
    divCardBorderPosts.append(item);
  });

  elements.postsField.innerHTML = '';
  elements.postsField.append(divCardBorderPosts);
}

export { renderBorder };
export { renderErrors };
export { renderFeeds };
export { renderPosts };
