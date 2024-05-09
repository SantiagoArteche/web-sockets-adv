import { createServer } from "http";
import { Server } from "./presentation/server";
import { WssService } from "./presentation/services/wss.service";
import "dotenv/config";
import { AppRoutes } from "./presentation/routes";

(() => {
  main();
})();

function main() {
  const server = new Server();

  const httpServer = createServer(server.app);
  WssService.initWss({ server: httpServer });

  server.setRoutes(AppRoutes.routes);

  httpServer.listen(process.env.PORT, () => {
    console.log(`Server running on PORT ${process.env.PORT}`);
  });
}
