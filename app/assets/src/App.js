import Main from "./Main.js";

class App {
  constructor() {
    // start client
    this.client = ZAFClient.init();

    this.init();
  }

  async init() {
    // resize app
    this.client.on("app.registered", (e) => {
      this.client.invoke("resize", { width: "100%", height: "260px" });
    });

    // set app context
    const main = new Main(this.client);
    await main.execute();
  }
}

const app = new App();
