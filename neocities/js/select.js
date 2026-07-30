// PAS MON CODE
document.addEventListener("DOMContentLoaded", () => {
    const icons = document.querySelectorAll(".explorer_icon");

    icons.forEach(icon => {
        icon.addEventListener("click", e => {
            // Remove previous selection
            icons.forEach(i => i.classList.remove("selected"));

            // Select clicked icon
            icon.classList.add("selected");

            // Don't let the document click handler run
            e.stopPropagation();
        });
    });

    // Clicking anywhere else deselects everything
    document.addEventListener("click", () => {
        icons.forEach(i => i.classList.remove("selected"));
    });
});