import Core from "./Core.js";

const Main = async (client) => {
  const MainContentArea = document.getElementById("main-content");
  const SecondaryContentArea = document.getElementById("secondary-content");

  const cepArea = Core.createCEPArea(client);
  const requesterLatestTicketsListArea = await Core.createRequesterTicketListArea(client);
  
  MainContentArea.appendChild(cepArea);
  SecondaryContentArea.appendChild(requesterLatestTicketsListArea);
};

export default Main;
