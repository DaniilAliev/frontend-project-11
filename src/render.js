const render = (isValid, input) => {
  if (isValid === false) {
    input.classList.add('is-invalid');
  } else if (isValid === true) {
    input.classList.remove('is-invalid');
  }
};

export default render;