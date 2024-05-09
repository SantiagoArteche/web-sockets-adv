const sendButton = document.querySelector("tr td button");
const currentTicket = document.querySelector("#lbl-new-ticket");

async function getLastTicket() {
  const response = await fetch("/api/tickets/last");
  const data = await response.json();
  currentTicket.innerHTML = `Cantidad de tickets: ${data}`;
}

async function createTicket() {
  const response = await fetch("/api/tickets", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  const data = await response.json();

  currentTicket.innerHTML = `Cantidad de tickets: ${data.number}`;
}

sendButton.addEventListener("click", createTicket);
getLastTicket();
