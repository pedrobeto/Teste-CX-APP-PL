import Core from "./Core.js";

const Main = async (client) => {
  const MainContentArea = document.getElementById("main-content");

  const cepArea = Core.createCEPArea(client);
  
  MainContentArea.appendChild(cepArea);
};

export default Main;
