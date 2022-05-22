// start client and resize app
let client = ZAFClient.init();
document.ZAFClient = client;

client.on("app.registered", (e) => {
  
  client.invoke("resize", { width: "100%", height: "260px" });
});

// create screen context
import Main from "./Main.js";
await Main(client);
