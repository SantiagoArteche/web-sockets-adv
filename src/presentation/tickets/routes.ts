import { Router } from "express";
import { TicketController } from "./controller";

export class TicketsRoutes {
  static get routes() {
    const router = Router();

    const controller = new TicketController();

    router.get("/", controller.getTickets);
    router.get("/last", controller.getLastTicketNumber);
    router.get("/pending", controller.pendingTickets);
    router.get("/draw/:desk", controller.drawTicket);
    router.get("/working-on", controller.workingOn);

    router.post("/", controller.createTicket);
    router.put("/done/:ticketId", controller.ticketFinished);
    return router;
  }
}
