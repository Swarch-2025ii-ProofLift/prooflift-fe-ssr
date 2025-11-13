import { createServer as createHttpsServer } from "https";
import { readFileSync } from "fs";
import next from "next";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const httpsOptions = {
  key: readFileSync("/certs/key.pem"),
  cert: readFileSync("/certs/cert.pem"),
};

app.prepare().then(() => {
  createHttpsServer(httpsOptions, (req, res) => handle(req, res))
    .listen(3000, () => {
      console.log("Server running on https://localhost:3000");
    });
});
