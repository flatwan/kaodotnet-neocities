function copy_to_clipboard(text) {
    navigator.clipboard.writeText(text)
        .then(() => {
            alert("Copied: " + text);
        })
        .catch(err => {
            console.error(err);
            alert("Failed to copy.");
        });
}