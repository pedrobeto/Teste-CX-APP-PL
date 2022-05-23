import Core from "./Core.js";

class Main {
  constructor(client) {
    this.client = client;
  }

  async execute() {
    const core = new Core(this.client);

    // get parent element to each space/area of app
    const MainContentArea = document.getElementById("main-content");
    const SecondaryContentArea = document.getElementById("secondary-content");
  
    // build elements to those spaces
    const cepArea = core.createCEPArea();
    const requesterLatestTicketsListArea = await core.createRequesterTicketListArea();
    
    // make proper appends
    MainContentArea.appendChild(cepArea);
    SecondaryContentArea.appendChild(requesterLatestTicketsListArea);
  }
}

export default Main;
