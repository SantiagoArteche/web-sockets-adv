async function getWorkingOnTickets() {
  const response = await fetch("api/tickets/working-on");

  return await response.json();
}

function renderTickets(ticketsArray = []) {
  for (let i = 0; i < ticketsArray.length; i++) {
    const ticket = ticketsArray[i];

    if (i >= 4) break;

    const lblTicket = document.querySelector(`#lbl-ticket-0${i + 1}`);
    const lblDesk = document.querySelector(`#lbl-desk-0${i + 1}`);
    lblTicket.innerHTML = `Ticket ${ticket.number}`;
    lblDesk.innerHTML = ticket.handleAtDesk;
  }
}

function connectToWebSockets() {
  const socket = new WebSocket("ws://localhost:8080/ws");

  socket.onmessage = async (event) => {
    const { type, payload } = JSON.parse(event.data);

    if (type !== "on-working-changed") return;

    renderTickets(payload);
  };

  socket.onclose = (event) => {
    console.log("Connection closed");
    setTimeout(() => {
      console.log("retrying to connect");
      connectToWebSockets();
    }, 1500);
  };

  socket.onopen = (event) => {
    console.log("Connected");
  };
}

getWorkingOnTickets();
connectToWebSockets();
