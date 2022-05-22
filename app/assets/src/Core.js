const resetWarnAndErrorMessage = () => {
  const warnAndErrorElement = document.getElementById('warn-err-message-cep');
  warnAndErrorElement.classList.remove('c-txt__message--error');
  warnAndErrorElement.classList.remove('c-txt__message--success');
  warnAndErrorElement.classList.remove('c-txt__message--warning');
}

const showWarningMessage = (message) => {
  resetWarnAndErrorMessage();
  const warnElement = document.getElementById('warn-err-message-cep');
  const inputElement = document.getElementById('cep-txt-input');
  inputElement.classList.add('c-txt__input--warning');
  warnElement.classList.add('c-txt__message--warning');
  warnElement.innerHTML = message;
  warnElement.style.display = 'block';
}

const validateCEPInput = (text) => {
  const regex = /\d{8}/gi;
  if (text.length !== 8) {
    showWarningMessage('O CEP deve conter 8 dígitos');
    return false;
  } else if (!regex.test(text)) {
    showWarningMessage('O CEP deve conter apenas números');
    return false;
  }
  return true;
}

const retrieveLocationData = async (typedCEP) => {
  const client = document.ZAFClient;
  const url = `https://viacep.com.br/ws/${typedCEP}/json/`;
  const response = await client.request({
    url: url,
    type: 'GET',
  });

  return response;
}

const addLocationComment = async function() {
  try {
    const client = document.ZAFClient;
    // disable button while processing
    document.getElementById('cep-button').classList.add('is-disabled');

    // retrieve CEP typed
    const inputValueCEP = document.getElementById('cep-txt-input').value;
    const isInputValid = validateCEPInput(inputValueCEP);
    // validate it

    if (!isInputValid) {
      document.getElementById('cep-button').classList.remove('is-disabled');

      return;
    }
    // makes an http request to VIACEP api
    const locationData = await retrieveLocationData(inputValueCEP);

    if (!locationData.cep) throw new Error('Invalid CEP');
    // add comment to ticket
    let currentTicketId = await client.get('ticket.id');
    currentTicketId = currentTicketId['ticket.id'];

    
    const ticketLocationComment = `
      Dados de localização com base no CEP informado:\n
      CEP: ${locationData.cep}\n
      DDD: ${locationData.ddd}\n
      Cidade: ${locationData.localidade}\n
      Estado: ${locationData.uf}\n
      Bairro: ${locationData.bairro ? locationData.bairro : 'Não localizado'}\n
      Logradouro: ${locationData.logradouro ? locationData.logradouro : 'Não localizado'}
    `;

    let updateTicketWithCommentResponse = await client.request({
      url: `/api/v2/tickets/${currentTicketId}`,
      type: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify({
        "ticket": {
          "comment": {
            "body": ticketLocationComment,
            "public": true 
          }
        }
      }),
    });

    if (!updateTicketWithCommentResponse.ticket && !updateTicketWithCommentResponse.audit) throw new Error();

    resetWarnAndErrorMessage();
    document.getElementById('warn-err-message-cep').classList.add('c-txt__message--success');
    document.getElementById('warn-err-message-cep').innerHTML = 'Localização encontrada!';
    document.getElementById('warn-err-message-cep').style.display = 'block';
    document.getElementById('cep-txt-input').classList.add('c-txt__input--success');
    document.getElementById('cep-button').classList.remove('is-disabled');
  } catch (e) {
    console.log(e);
    resetWarnAndErrorMessage();
    document.getElementById('warn-err-message-cep').classList.add('c-txt__message--error');
    document.getElementById('warn-err-message-cep').style.display = 'block';
    document.getElementById('cep-txt-input').classList.add('c-txt__input--error');
    const messageToDisplay = e.message && e.message.indexOf('Invalid CEP') > -1 ? 'O CEP informado é inválido, tente novamente.' : 'Erro interno. Por favor, contate o administrador.';
    document.getElementById('warn-err-message-cep').innerHTML = messageToDisplay;
    document.getElementById('cep-button').classList.remove('is-disabled');
  }
}

const createCEPArea = (client) => {
  try {
    // create wrapper
    const cepWrapper = document.createElement('div');
    cepWrapper.setAttribute('id', 'cep-wrapper');
    cepWrapper.classList.add('wrapper');
    cepWrapper.style.width = '100%';
    // create input area
    const inputAreaContainer = document.createElement('div');
    inputAreaContainer.classList.add('c-txt');
    // create input area - label
    const inputLabel = document.createElement('label');
    inputLabel.innerHTML = 'Informe o CEP:';
    inputLabel.classList.add('c-txt__label');
    // create input area - hint message
    inputLabel.setAttribute('for', 'cep-txt-input');
    const inputHint = document.createElement('span');
    inputHint.classList.add('c-txt__hint');
    inputHint.innerHTML = 'O ticket será atualizado com a localização'
    // create input area - text input
    const cepInputTxt = document.createElement('input');
    cepInputTxt.classList.add('c-txt__input');
    cepInputTxt.setAttribute('id', 'cep-txt-input');
    // create input area - warn/error message
    const inputValidation = document.createElement('small');
    inputValidation.classList.add('c-txt__message');
    inputValidation.setAttribute('id', 'warn-err-message-cep');
    inputValidation.style.display = 'none';
    // create input area - action button
    const cepActionButton = document.createElement('button');
    cepActionButton.innerHTML = 'Buscar localização'
    cepActionButton.classList.add('c-btn');
    cepActionButton.classList.add('c-btn--primary');
    cepActionButton.classList.add('c-btn--full');
    cepActionButton.setAttribute('id', 'cep-button');
    cepActionButton.addEventListener('click', () => {
      addLocationComment();
    });
    // reset input after a request
    cepInputTxt.addEventListener('keydown', () => {
      inputValidation.style.display = 'none';
      cepInputTxt.classList.remove('c-txt__input--error');
      cepInputTxt.classList.remove('c-txt__input--warning');
      cepInputTxt.classList.remove('c-txt__input--success');
    });

    // make proper appends
    inputAreaContainer.appendChild(inputLabel);
    inputAreaContainer.appendChild(inputHint);
    inputAreaContainer.appendChild(cepInputTxt);
    inputAreaContainer.appendChild(inputValidation);
    inputAreaContainer.appendChild(cepActionButton);
    cepWrapper.appendChild(inputAreaContainer);

    return cepWrapper;
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
