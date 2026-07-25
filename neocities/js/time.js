// PAS MON CODE
//HH:MM MM/DD/YYYY
function updateTaskbarClock() {
    const clockElement = document.getElementById("taskbar-clock");

    if (!clockElement) {
        return;
    }

    const now = new Date();

    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const year = now.getFullYear();

    const timeString = `${hours}:${minutes}`;
    const dateString = `${month}/${day}/${year}`;

    clockElement.innerHTML = `<div>${timeString}</div><div>${dateString}</div>`;
}

function initTaskbarClock() {
    updateTaskbarClock();
    if (!window.__taskbarClockInterval) {
        window.__taskbarClockInterval = window.setInterval(updateTaskbarClock, 1000);
    }
}

window.updateTaskbarClock = updateTaskbarClock;
window.initTaskbarClock = initTaskbarClock;
