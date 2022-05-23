class Core {
  constructor(client) {
    this.client = client;
  }

  resetWarnAndErrorMessage() {
    const warnAndErrorElement = document.getElementById('warn-err-message-cep');
    warnAndErrorElement.classList.remove('c-txt__message--error');
    warnAndErrorElement.classList.remove('c-txt__message--success');
    warnAndErrorElement.classList.remove('c-txt__message--warning');
  }
  
  showWarningMessage(message) {
    this.resetWarnAndErrorMessage();
    const warnElement = document.getElementById('warn-err-message-cep');
    const inputElement = document.getElementById('cep-txt-input');
    inputElement.classList.add('c-txt__input--warning');
    warnElement.classList.add('c-txt__message--warning');
    warnElement.innerHTML = message;
    warnElement.style.display = 'block';
  }
  
  validateCEPInput(text) {
    const regex = /\d{8}/gi;
    if (text.length !== 8) {
      this.showWarningMessage('O CEP deve conter 8 dígitos');
      return false;
    } else if (!regex.test(text)) {
      this.showWarningMessage('O CEP deve conter apenas números');
      return false;
    }
    return true;
  }

  async retrieveLocationData(typedCEP) {
    const client = document.ZAFClient;
    const url = `https://viacep.com.br/ws/${typedCEP}/json/`;
    const response = await this.client.request({
      url: url,
      type: 'GET',
    });
  
    return response;
  }
  
  async addLocationCommentToTicket(currentTicketId, ticketCommentBody) {
    return await this.client.request({
      url: `/api/v2/tickets/${currentTicketId}`,
      type: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify({
        "ticket": {
          "comment": {
            "body": ticketCommentBody,
            "public": true 
          }
        }
      }),
    });
  }

  async addLocationComment() {
    try {
      const client = document.ZAFClient;
      // disable button while processing
      document.getElementById('cep-button').classList.add('is-disabled');
  
      // retrieve CEP typed
      const inputValueCEP = document.getElementById('cep-txt-input').value;
      const isInputValid = this.validateCEPInput(inputValueCEP);
      // validate it
      if (!isInputValid) {
        document.getElementById('cep-button').classList.remove('is-disabled');
        return;
      }

      // makes an http request to VIACEP api
      const locationData = await this.retrieveLocationData(inputValueCEP);
      if (!locationData.cep) throw new Error('Invalid CEP');
      
      // add comment to ticket
      let currentTicketId = await this.client.get('ticket.id');
      currentTicketId = currentTicketId['ticket.id'];
  
      const ticketCommentBody = `
        Dados de localização com base no CEP informado:\n
        CEP: ${locationData.cep}\n
        DDD: ${locationData.ddd}\n
        Cidade: ${locationData.localidade}\n
        Estado: ${locationData.uf}\n
        Bairro: ${locationData.bairro ? locationData.bairro : 'Não localizado'}\n
        Logradouro: ${locationData.logradouro ? locationData.logradouro : 'Não localizado'}
      `;

      // update ticket adding location comment to it
      const updateTicketWithCommentResponse = await this.addLocationCommentToTicket(currentTicketId, ticketCommentBody);
      // check response
      if (!updateTicketWithCommentResponse.ticket && !updateTicketWithCommentResponse.audit) throw new Error();
      
      // display successful elements to user feedback
      this.resetWarnAndErrorMessage();
      document.getElementById('warn-err-message-cep').classList.add('c-txt__message--success');
      document.getElementById('warn-err-message-cep').innerHTML = 'Localização encontrada!';
      document.getElementById('warn-err-message-cep').style.display = 'block';
      document.getElementById('cep-txt-input').classList.add('c-txt__input--success');
      document.getElementById('cep-button').classList.remove('is-disabled');
    } catch (e) {
      this.resetWarnAndErrorMessage();
      document.getElementById('warn-err-message-cep').classList.add('c-txt__message--error');
      document.getElementById('warn-err-message-cep').style.display = 'block';
      document.getElementById('cep-txt-input').classList.add('c-txt__input--error');
      const messageToDisplay = e.message && e.message.indexOf('Invalid CEP') > -1 ? 'O CEP informado é inválido, tente novamente.' : 'Erro interno. Por favor, contate o administrador.';
      document.getElementById('warn-err-message-cep').innerHTML = messageToDisplay;
      document.getElementById('cep-button').classList.remove('is-disabled');
    }
  }

  createErrorScreen() {
    const errorContainer = document.createElement('div');
    errorContainer.classList.add('c-callout--error');
    errorContainer.classList.add('c-callout');
    const errroContainerTitle = document.createElement('strong');
    errroContainerTitle.innerHTML = 'Ocorreu um erro :(';
    const errorContainerBody = document.createElement('p');
    errorContainerBody.innerHTML = 'Por favor, atualize o aplicativo ou contate o administrador.'
  
    errorContainer.appendChild(errroContainerTitle);
    errorContainer.appendChild(errorContainerBody);
  }

  createCEPArea(client) {
    try {
      // create cep area wrapper
      const cepWrapper = document.createElement('div');
      cepWrapper.setAttribute('id', 'cep-wrapper');
      cepWrapper.classList.add('wrapper');
      cepWrapper.style.width = '100%';
      // create input area container
      const inputAreaContainer = document.createElement('div');
      inputAreaContainer.classList.add('c-txt');
      // create cep label
      const cepInputLabel = document.createElement('label');
      cepInputLabel.innerHTML = 'Informe o CEP:';
      cepInputLabel.classList.add('c-txt__label');
      // create cep hint message
      cepInputLabel.setAttribute('for', 'cep-txt-input');
      const cepInputHint = document.createElement('span');
      cepInputHint.classList.add('c-txt__hint');
      cepInputHint.innerHTML = 'O ticket será atualizado com a localização'
      // create cep text input
      const cepInputTxt = document.createElement('input');
      cepInputTxt.classList.add('c-txt__input');
      cepInputTxt.setAttribute('id', 'cep-txt-input');
      // create cep warn/error message display
      const cepValidationDisplay = document.createElement('small');
      cepValidationDisplay.classList.add('c-txt__message');
      cepValidationDisplay.setAttribute('id', 'warn-err-message-cep');
      cepValidationDisplay.style.display = 'none';
      // create cep action button
      const cepActionButton = document.createElement('button');
      cepActionButton.innerHTML = 'Buscar localização'
      cepActionButton.classList.add('c-btn');
      cepActionButton.classList.add('c-btn--primary');
      cepActionButton.classList.add('c-btn--full');
      cepActionButton.setAttribute('id', 'cep-button');
      cepActionButton.addEventListener('click', () => {
        this.addLocationComment();
      });
      // reset input state when typing
      cepInputTxt.addEventListener('keydown', () => {
        cepValidationDisplay.style.display = 'none';
        cepInputTxt.classList.remove('c-txt__input--error');
        cepInputTxt.classList.remove('c-txt__input--warning');
        cepInputTxt.classList.remove('c-txt__input--success');
      });
  
      // make proper appends
      inputAreaContainer.appendChild(cepInputLabel);
      inputAreaContainer.appendChild(cepInputHint);
      inputAreaContainer.appendChild(cepInputTxt);
      inputAreaContainer.appendChild(cepValidationDisplay);
      inputAreaContainer.appendChild(cepActionButton);
      cepWrapper.appendChild(inputAreaContainer);
  
      return cepWrapper;
    } catch (error) {
      // create an error template to user feedback
      return this.createErrorScreen();
    }
  }

  createTicketList = (listArray) => {
    // create an li to each ticket in list
    const createTicketItem = (_, id) => {
      const ticketItem = document.createElement('li');
      ticketItem.style.listStyle = 'none';
      ticketItem.innerHTML = `<b>${listArray[id].id}</b> - ${listArray[id].subject}`;
      
      // create tag to display next to ticket subject
      const ticketItemTagDiv = document.createElement('div');
      ticketItemTagDiv.classList.add('c-tag');
      ticketItemTagDiv.classList.add('c-tag--sm');
      const ticketItemTagSpan = document.createElement('span');
      // set tag color based on ticket status
      if (listArray[id].status === 'open') {
        ticketItemTagDiv.classList.add('c-tag--red');
        ticketItemTagSpan.innerHTML = 'Aberto';
      } else if (listArray[id].status === 'pending') {
        ticketItemTagSpan.innerHTML = 'Pendente';
        ticketItemTagDiv.classList.add('c-tag--azure');
      } else if (listArray[id].status === 'new') {
        ticketItemTagSpan.innerHTML = 'Novo';
        ticketItemTagDiv.classList.add('c-tag--yellow');
      } else {
        ticketItemTagSpan.innerHTML = 'Resolvido';
        ticketItemTagDiv.classList.add('c-tag--grey');
      }
  
      ticketItemTagDiv.style.margin = '0px 6px';
  
      // make proper appends
      ticketItemTagDiv.appendChild(ticketItemTagSpan);
      ticketItem.appendChild(ticketItemTagDiv);
  
      return ticketItem;
    }
  
    return Array.from({ length: listArray.length }, createTicketItem);
  }

  async createRequesterTicketListArea(client) {
    try {
      // create list wrapper
      const requesterListWrapper = document.createElement('div');
      // create list element itself
      const ticketListElement = document.createElement('ul');
      ticketListElement.style.margin = '12px 0px';
      ticketListElement.setAttribute('id', 'requester-recent-ticket-list');
      // create list title as label element
      const ticketListLabel = document.createElement('label');
      ticketListLabel.classList.add('c-text__label');
      ticketListLabel.innerHTML = 'Últimos tickets do solicitante';
      ticketListLabel.style.fontWeight = 600;

      // retrieve list of current requester latest tickets
      let currentRequesterId = await this.client.get('ticket.requester.id');
      currentRequesterId = currentRequesterId['ticket.requester.id'];
      const contextInfo = await this.client.context();
      let requesterListTicketsDesc = await this.client.request({
        url: `https://${contextInfo.account.subdomain}.zendesk.com/api/v2/search.json?query=type:ticket%20requester_id:${currentRequesterId}&sort_by=created_at&sort_order=desc`,
        type: 'GET',
        contentType: 'application/json',
      });

      // slice list response to create an element to latest 4 tickets max
      const ticketsList = this.createTicketList(requesterListTicketsDesc.results.slice(0, 4));
      
      // append each ticket to the list element
      ticketsList.forEach(ticket => ticketListElement.appendChild(ticket));
      // make other proper appends
      requesterListWrapper.appendChild(ticketListLabel);
      requesterListWrapper.appendChild(ticketListElement);
  
      return requesterListWrapper;
    } catch (error) {
      // create an error template to user feedback
      return this.createErrorScreen();
    }
  }
}

export default Core;
