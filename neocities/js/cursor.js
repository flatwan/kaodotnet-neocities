// const cursor = document.createElement("img");

// cursor.id = "cursor";
// cursor.alt = "";
// cursor.setAttribute("aria-hidden", "true");

// document.body.appendChild(cursor);

// const cursors = {
//     normal: [
//         "../resources/cursorSD1.png",
//         "../resources/cursorSD2.png",
//         "../resources/cursorSD3.png"
//     ],

//     hover: [
//         "../resources/cursorSD-hover1.png",
//         "../resources/cursorSD-hover2.png",
//         "../resources/cursorSD-hover3.png"
//     ]
// };

// let currentCursor = "normal";
// let frame = 0;

// cursor.src = cursors.normal[0];

// function setCursor(type) {
//     if (currentCursor === type) {
//         return;
//     }

//     currentCursor = type;
//     frame = 0;
//     cursor.src = cursors[type][0];
// }

// function isClickable(element) {
//     if (!(element instanceof Element)) {
//         return false;
//     }

//     return Boolean(
//         element.closest(
//             "a, button, .explorer_icon, [onclick], [ondblclick]"
//         )
//     );
// }

// document.addEventListener("mousemove", (event) => {
//     cursor.style.left = `${event.clientX}px`;
//     cursor.style.top = `${event.clientY}px`;

//     if (isClickable(event.target)) {
//         setCursor("hover");
//     } else {
//         setCursor("normal");
//     }
// });

// document.addEventListener("mouseleave", () => {
//     cursor.style.display = "none";
// });

// document.addEventListener("mouseenter", () => {
//     cursor.style.display = "block";
// });

// setInterval(() => {
//     const frames = cursors[currentCursor];

//     frame = (frame + 1) % frames.length;
//     cursor.src = frames[frame];
// }, 100);

// cursor.addEventListener("error", () => {
//     console.error("Image du curseur introuvable :", cursor.src);
// });