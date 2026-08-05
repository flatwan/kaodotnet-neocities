// PAS MON CODE
function initExplorerSelection(root = document) {
    const icons = root.querySelectorAll(".explorer_icon");

    icons.forEach(icon => {
        icon.addEventListener("click", e => {
            document.querySelectorAll(".explorer_icon").forEach(i => i.classList.remove("selected"));
            icon.classList.add("selected");
            e.stopPropagation();
        });
    });

    if (!window.__explorerSelectionDocumentClickInstalled) {
        document.addEventListener("click", () => {
            document.querySelectorAll(".explorer_icon").forEach(i => i.classList.remove("selected"));
        });
        window.__explorerSelectionDocumentClickInstalled = true;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    initExplorerSelection();
});