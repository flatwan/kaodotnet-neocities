const cursor = document.createElement("img");

cursor.id = "cursor";
cursor.alt = "";

document.body.appendChild(cursor);

const cursors = {
    normal: [
        "./resources/cursorHD1.png",
        "./resources/cursorHD2.png",
        "./resources/cursorHD3.png"
    ],

    hover: [
        "./resources/cursorHD-hover1.png",
        "./resources/cursorHD-hover2.png",
        "./resources/cursorHD-hover3.png"
    ]
};

let currentCursor = "normal";
let frame = 0;

cursor.src = cursors.normal[0];

document.addEventListener("mousemove", (event) => {
    cursor.style.left = `${event.clientX}px`;
    cursor.style.top = `${event.clientY}px`;
});

function setCursor(type) {
    if (currentCursor === type) {
        return;
    }

    currentCursor = type;
    frame = 0;
    cursor.src = cursors[currentCursor][0];
}

function isClickable(element) {
    return element.closest(
        "a, button, .explorer_icon, [onclick], [ondblclick]"
    );
}

document.addEventListener("mouseover", (event) => {
    if (isClickable(event.target)) {
        setCursor("hover");
    }
});

document.addEventListener("mouseout", (event) => {
    const clickableElement = isClickable(event.target);

    if (!clickableElement) {
        return;
    }

    const nextElement = event.relatedTarget;

    if (!nextElement || !clickableElement.contains(nextElement)) {
        setCursor("normal");
    }
});

setInterval(() => {
    const currentFrames = cursors[currentCursor];

    frame = (frame + 1) % currentFrames.length;
    cursor.src = currentFrames[frame];
}, 100);

cursor.addEventListener("error", () => {
    console.error("Image du curseur introuvable :", cursor.src);
});