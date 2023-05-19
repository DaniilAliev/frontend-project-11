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

export { renderBorder };
export { renderErrors };
