const pendingTickets = document.querySelector("#lbl-pending");
const deskHeader = document.querySelector("h1");
const noMoreAlert = document.querySelector(".alert");
const currentTicketLabel = document.querySelector("small");
const btnDrawTicket = document.querySelector("#btn-draw");
const btnEndTicket = document.querySelector("#btn-end");

const searchParams = new URLSearchParams(window.location.search);

if (!searchParams.has("escritorio")) {
  window.location = "index.html";
}

const deskNumber = searchParams.get("escritorio");
let workingTicket = null;
deskHeader.innerHTML = deskNumber;

function checkTicketCount(currentCount = 0) {
  if (currentCount <= 0) {
    noMoreAlert.classList.remove("d-none");
    pendingTickets.innerHTML = null;
    return;
  } else {
    noMoreAlert.classList.add("d-none");
    pendingTickets.innerHTML = currentCount;
  }
}

async function getPendingTickets() {
  const response = await fetch("api/tickets/pending");

  const data = await response.json();

  checkTicketCount(data.length);
}

async function getTicket() {
  await finishTicket();
  const response = await fetch(`api/tickets/draw/${deskNumber}`);

  const { status, ticket, message } = await response.json();

  if (status === "error") {
    currentTicketLabel.innerHTML = message;
    return;
  }

  workingTicket = ticket;
  currentTicketLabel.innerHTML = ticket.number;
}

async function finishTicket() {
  if (!workingTicket) return;

  const response = await fetch(`api/tickets/done/${workingTicket.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
  });

  const { status } = await response.json();

  if (status === "ok") {
    workingTicket = null;
    currentTicketLabel.innerHTML = "Nobody";
  }
}

function connectToWebSockets() {
  const socket = new WebSocket("ws://localhost:8080/ws");

  socket.onmessage = (event) => {
    const { type, payload } = JSON.parse(event.data);

    if (type !== "on-ticket-count-changed") return;

    pendingTickets.innerHTML = payload;
    checkTicketCount(payload);
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

btnDrawTicket.addEventListener("click", getTicket);
btnEndTicket.addEventListener("click", finishTicket);

getPendingTickets();
connectToWebSockets();
