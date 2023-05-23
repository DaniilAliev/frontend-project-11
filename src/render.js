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

const renderState = {
  posts: [],
};

const renderRSS = (urlAr, elements, i18nextInstance) => {
  const liFeedResult = [];
  const liPostsResult = [];
  urlAr.forEach((url) => {
    parserFunc(url).then((parsedHTML) => {
      console.log(parsedHTML);
      // Фиды
      const titleRSS = parsedHTML.querySelector('title').textContent;
      const descriptionRss =
        parsedHTML.querySelector('description').textContent;

      // Создаем h3 с заголовком
      const h3Feed = document.createElement('h3');
      h3Feed.classList.add('h6', 'm-0');
      h3Feed.textContent = titleRSS;
      // Создаем параграф с описанием
      const pFeed = document.createElement('p');
      pFeed.classList.add('m-0', 'small', 'text-black-50');
      pFeed.textContent = descriptionRss;

      // делаем li
      const liFeed = document.createElement('li');
      liFeed.classList.add('list-group-item', 'border-0', 'border-end-0');
      [h3Feed, pFeed].forEach((item) => {
        liFeed.append(item);
      });
      liFeedResult.push(liFeed);

      // делаем ul
      const ulFeed = document.createElement('ul');
      ulFeed.classList.add('list-group', 'border-0', 'border-end-0');
      ulFeed.replaceChildren(...(_.reverse(liFeedResult)));

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

      // Посты
      const items = parsedHTML.querySelectorAll('item');
      items.forEach((item) => {
        const a = document.createElement('a');

        const link = item.querySelector('link').textContent;
        const title = item.querySelector('title').textContent;

        // работа со ссылками a
        const id = _.uniqueId();
        a.href = link;
        a.textContent = title;
        a.classList.add('fw-bold');
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.dataset.id = id;
        
        // создаем li
        const liPosts = document.createElement('li');
        liPosts.classList.add(
          'list-group-item',
          'd-flex',
          'justify-content-between',
          'align-items-start',
          'border-0',
          'border-end-0',
        );
        liPosts.prepend(a);
        liPostsResult.push(liPosts);
      });
      // создаем ul
      const ulPosts = document.createElement('ul');
      ulPosts.classList.add('list-group', 'border-0', 'rounded-0');
      ulPosts.replaceChildren(...liPostsResult);

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
    });
  });
};

export { renderBorder };
export { renderErrors };
export { renderRSS };
