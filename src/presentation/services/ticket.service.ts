import { Uuid } from "../../config/uuid.adapter";
import { Ticket } from "../../domain/interfaces/ticket";
import { WssService } from "./wss.service";

export class TicketService {
  constructor(private readonly wssService = WssService.instance) {}

  public tickets: Ticket[] = [
    { id: Uuid(), number: 1, createdAt: new Date(), done: false },
    { id: Uuid(), number: 2, createdAt: new Date(), done: false },
    { id: Uuid(), number: 3, createdAt: new Date(), done: false },
    { id: Uuid(), number: 4, createdAt: new Date(), done: false },
    { id: Uuid(), number: 5, createdAt: new Date(), done: false },
  ];

  public get getLastFourTickets(): Ticket[] {
    return this.workingOnTickets.slice(0, 4);
  }

  private readonly workingOnTickets: Ticket[] = [];

  public get pendingTickets(): Ticket[] {
    return this.tickets.filter((ticket) => !ticket.handleAtDesk);
  }

  public lastTicket(): number {
    return this.tickets.length > 0 ? this.tickets.at(-1)!.number : 0;
  }

  public createTicket() {
    const newTicket: Ticket = {
      id: Uuid(),
      number: this.lastTicket() + 1,
      createdAt: new Date(),
      done: false,
      handleAt: undefined,
      handleAtDesk: undefined,
    };

    this.tickets.push(newTicket);
    this.onTicketNumberChanged();
    return newTicket;
  }

  public drawTicket = (desk: string) => {
    const ticket = this.tickets.find((ticket) => !ticket.handleAtDesk);
    if (!ticket) return { status: "error", message: "No pending tickets" };

    ticket.handleAtDesk = desk;
    ticket.handleAt = new Date();

    this.workingOnTickets.unshift({ ...ticket });
    this.onTicketNumberChanged();
    this.onLastTickets();
    return { status: "ok", ticket };
  };

  public onFinishedTicket(id: string) {
    const ticket = this.tickets.find((ticket) => ticket.id == id);
    if (!ticket) return { status: "error", message: "Ticket not found" };

    this.tickets = this.tickets.map((ticket) => {
      if (ticket.id === id) {
        ticket.done = true;
      }

      return ticket;
    });

    return { status: "ok", message: "Ticket done" };
  }

  private onTicketNumberChanged() {
    this.wssService.sendMessage(
      "on-ticket-count-changed",
      this.pendingTickets.length
    );
  }

  private onLastTickets() {
    this.wssService.sendMessage("on-working-changed", this.workingOnTickets);
  }
}
