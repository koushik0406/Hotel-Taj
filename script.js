// Guest selector
let guests = 1;
const guestDisplay = document.getElementById("guestsCount");

document.getElementById("incGuests").onclick = () => {
  guests = Math.min(8, guests + 1);
  guestDisplay.textContent = guests;
};

document.getElementById("decGuests").onclick = () => {
  guests = Math.max(1, guests - 1);
  guestDisplay.textContent = guests;
};

// Booking simulation
document.getElementById("bookingForm").onsubmit = (e) => {
  e.preventDefault();

  const name = document.getElementById("fullName").value;
  document.getElementById("bookingMessage").textContent =
    `Thanks ${name}, your holiday reservation request has been received! 🎄✨`;

  e.target.reset();
  guests = 1;
  guestDisplay.textContent = "1";
};

// Set year
document.getElementById("year").textContent = new Date().getFullYear();

// THEME TOGGLE
document.getElementById("themeToggle").onclick = () => {
  document.body.classList.toggle("holiday-theme");
};

// SNOW GENERATOR
function createSnowflake() {
  const snow = document.createElement("div");
  snow.classList.add("snowflake");
  snow.textContent = "❄";
  snow.style.left = Math.random() * 100 + "vw";
  snow.style.animationDuration = 4 + Math.random() * 6 + "s";
  snow.style.fontSize = 10 + Math.random() * 14 + "px";

  document.getElementById("snow-container").appendChild(snow);

  setTimeout(() => snow.remove(), 10000);
}

setInterval(createSnowflake, 200);
