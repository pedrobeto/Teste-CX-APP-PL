import Core from "./Core.js";

const Main = async () => {
  const MainContentArea = document.getElementById("main-content");

  const cepArea = Core.createCEPArea();
  
  MainContentArea.appendChild(cepArea);
};

export default Main;
