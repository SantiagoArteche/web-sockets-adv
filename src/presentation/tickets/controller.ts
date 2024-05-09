import { Request, Response } from "express";
import { TicketService } from "../services/ticket.service";

export class TicketController {
  constructor(private readonly ticketService = new TicketService()) {}

  public getTickets = async (req: Request, res: Response) => {
    res.send(this.ticketService.tickets);
  };

  public getLastTicketNumber = async (req: Request, res: Response) => {
    res.json(this.ticketService.lastTicket());
  };

  public pendingTickets = async (req: Request, res: Response) => {
    res.send(this.ticketService.pendingTickets);
  };

  public createTicket = async (req: Request, res: Response) => {
    res.send(this.ticketService.createTicket());
  };

  public drawTicket = async (req: Request, res: Response) => {
    const { desk } = req.params;

    res.send(this.ticketService.drawTicket(desk));
  };

  public ticketFinished = async (req: Request, res: Response) => {
    const { ticketId } = req.params;
    res.send(this.ticketService.onFinishedTicket(ticketId));
  };

  public workingOn = async (req: Request, res: Response) => {
    res.send(this.ticketService.getLastFourTickets);
  };
}
