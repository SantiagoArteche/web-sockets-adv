import { Router } from "express";
import { TicketsRoutes } from "./tickets/routes";

export class AppRoutes {
  public static get routes() {
    const router = Router();

    router.use("/api/tickets", TicketsRoutes.routes);

    return router;
  }
}
