const addTextSecondary = (watchedPostsId, a) => {
  watchedPostsId.forEach((id) => {
    if (a.dataset.id === id) {
      a.classList.add('text-secondary');
    }
  });
};

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

const renderForm = (value, elements, form) => {
  if (value === 'loading') {
    elements.submitButton.disabled = true;
    elements.errorField.textContent = '';
    form.isValid = false;
  } else if (value === 'succeed') {
    elements.submitButton.disabled = false;
    elements.form.reset();
    elements.input.focus();
  } else if (value === 'failed') {
    elements.submitButton.disabled = false;
  }
};

const renderErrors = (error, elements, i18nextInstance) => {
  elements.errorField.textContent = i18nextInstance.t(`${error}`);
};

const renderFeeds = (value, elements, i18nextInstance, newFeed = []) => {
  value.forEach((item) => {
    const h3Feed = document.createElement('h3');
    h3Feed.classList.add('h6', 'm-0');
    h3Feed.textContent = item.titleRSS;

    const pFeed = document.createElement('p');
    pFeed.classList.add('m-0', 'small', 'text-black-50');
    pFeed.textContent = item.descriptionRss;

    const liFeed = document.createElement('li');
    liFeed.classList.add('list-group-item', 'border-0', 'border-end-0');
    [h3Feed, pFeed].forEach((subItem) => {
      liFeed.append(subItem);

      newFeed.push(liFeed);
    });
  });

  const ulFeed = document.createElement('ul');
  ulFeed.classList.add('list-group', 'border-0', 'border-end-0');
  ulFeed.replaceChildren(...newFeed);

  const h2Feed = document.createElement('h2');
  h2Feed.classList.add('card-title', 'h4');
  h2Feed.textContent = i18nextInstance.t('texts.rssFeed.feeds');
  const divCardBody = document.createElement('div');
  divCardBody.classList.add('card-body');
  divCardBody.replaceChildren(h2Feed);

  const divCardBorder = document.createElement('div');
  divCardBorder.classList.add('card', 'border-0');
  [divCardBody, ulFeed].forEach((item) => {
    divCardBorder.append(item);
  });

  elements.feedField.innerHTML = '';
  elements.feedField.append(divCardBorder);
};

const renderPosts = (values, elements, i18nextInstance, watchedPostsId, newPosts = []) => {
  values.forEach((value) => {
    const a = document.createElement('a');
    a.href = value.link;
    a.textContent = value.title;
    a.classList.add('fw-bold');
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.dataset.id = value.id;

    addTextSecondary(watchedPostsId, a);

    const button = document.createElement('button');
    button.textContent = i18nextInstance.t('texts.rssFeed.watch');
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    button.type = 'button';
    button.setAttribute('data-id', value.id);
    button.setAttribute('data-bs-toggle', 'modal');
    button.setAttribute('data-bs-target', '#modal');

    const liPosts = document.createElement('li');
    liPosts.classList.add(
      'list-group-item',
      'd-flex',
      'justify-content-between',
      'align-items-start',
      'border-0',
      'border-end-0',
    );
    [a, button].forEach((item) => liPosts.append(item));
    newPosts.push(liPosts);

    const ulPosts = document.createElement('ul');
    ulPosts.classList.add('list-group', 'border-0', 'rounded-0');
    ulPosts.replaceChildren(...newPosts);

    const h2Posts = document.createElement('h2');
    h2Posts.classList.add('card-title', 'h4');
    h2Posts.textContent = i18nextInstance.t('texts.rssFeed.posts');
    const divCardBodyPosts = document.createElement('div');
    divCardBodyPosts.classList.add('card-body');
    divCardBodyPosts.replaceChildren(h2Posts);

    const divCardBorderPosts = document.createElement('div');
    divCardBorderPosts.classList.add('card', 'border-0');
    [divCardBodyPosts, ulPosts].forEach((item) => {
      divCardBorderPosts.append(item);
    });

    elements.postsField.innerHTML = '';
    elements.postsField.append(divCardBorderPosts);
  });
};

const renderButtonsAndModal = (postId, elements, posts) => {
  const readMoreButton = elements.modal.querySelector('.btn-primary');
  const post = posts.find((item) => item.id === postId);
  elements.modalTitle.textContent = post.title;
  elements.modalBody.textContent = post.description;
  readMoreButton.href = post.link;
};

const renderViewed = (watchedPostsId) => {
  const links = document.querySelectorAll('.fw-bold');
  links.forEach((a) => {
    addTextSecondary(watchedPostsId, a);
  });
};

export {
  renderBorder, renderErrors, renderFeeds, renderPosts, renderButtonsAndModal, renderForm,
  renderViewed,
};
