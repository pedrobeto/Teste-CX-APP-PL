const createCEPArea = (client) => {
  try {
    // create wrapper
    const zipCodeWrapper = document.createElement('div');
    zipCodeWrapper.setAttribute('id', 'zipcode-wrapper');
    zipCodeWrapper.classList.add('wrapper');
    zipCodeWrapper.style.width = '100%';
    // create input area
    const inputAreaContainer = document.createElement('div');
    inputAreaContainer.classList.add('c-txt');
    // create input area - label
    const inputLabel = document.createElement('label');
    inputLabel.innerHTML = 'Informe o CEP:';
    inputLabel.classList.add('c-txt__label');
    // create input area - hint message
    inputLabel.setAttribute('for', 'zipcode-txt-input');
    const inputHint = document.createElement('span');
    inputHint.classList.add('c-txt__hint');
    inputHint.innerHTML = 'O ticket será atualizado com a localização'
    // create input area - text input
    const zipCodeInputTxt = document.createElement('input');
    zipCodeInputTxt.classList.add('c-txt__input');
    zipCodeInputTxt.setAttribute('id', 'zipcode-txt-input');
    // create input area - warn/error message
    const inputValidation = document.createElement('small');
    inputValidation.classList.add('c-txt__message');
    inputValidation.setAttribute('id', 'warn-err-message-cep');
    inputValidation.style.display = 'none';
    // create input area - action button
    const zipCodeActionButton = document.createElement('button');
    zipCodeActionButton.innerHTML = 'Buscar localização'
    zipCodeActionButton.classList.add('c-btn');
    zipCodeActionButton.classList.add('c-btn--primary');
    zipCodeActionButton.classList.add('c-btn--full');
    zipCodeActionButton.setAttribute('id', 'cep-button');
    zipCodeActionButton.addEventListener('click', () => {
      // TO DO - ADD COMMENT
      console.log('you clicked');
    });
    // reset input after a request
    zipCodeInputTxt.addEventListener('keydown', () => {
      inputValidation.style.display = 'none';
      zipCodeInputTxt.classList.remove('c-txt__input--error');
      zipCodeInputTxt.classList.remove('c-txt__input--warning');
      zipCodeInputTxt.classList.remove('c-txt__input--success');
    });

    // make proper appends
    inputAreaContainer.appendChild(inputLabel);
    inputAreaContainer.appendChild(inputHint);
    inputAreaContainer.appendChild(zipCodeInputTxt);
    inputAreaContainer.appendChild(inputValidation);
    inputAreaContainer.appendChild(zipCodeActionButton);
    zipCodeWrapper.appendChild(inputAreaContainer);

    return zipCodeWrapper;
  } catch (error) {
    const errorContainer = document.createElement('div');
    errorContainer.classList.add('c-callout--error');
    errorContainer.classList.add('c-callout');
    const errroContainerTitle = document.createElement('strong');
    errroContainerTitle.innerHTML = 'Something went wrong :(';
    const errorContainerBody = document.createElement('p');
    errorContainerBody.innerHTML = 'Please try again later or contact your admin.'

    errorContainer.appendChild(errroContainerTitle);
    errorContainer.appendChild(errorContainerBody);
    return errorContainer;
  }
};

const Core = {
  createCEPArea,
};

export default Core;
