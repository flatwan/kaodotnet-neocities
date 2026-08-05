// PAS MON CODE
function loadScript(src) {
    return new Promise((resolve, reject) => {
        const existingScript = document.querySelector(`script[src="${src}"]`);

        if (existingScript) {
            if (existingScript.dataset.loaded === "true") {
                resolve();
                return;
            }

            existingScript.addEventListener("load", () => resolve(), { once: true });
            existingScript.addEventListener("error", () => reject(new Error(`Failed to load ${src}`)), { once: true });
            return;
        }

        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.addEventListener("load", () => {
            script.dataset.loaded = "true";
            resolve();
        }, { once: true });
        script.addEventListener("error", () => reject(new Error(`Failed to load ${src}`)), { once: true });
        document.body.appendChild(script);
    });
}

function applyTitlebarTitle() {
    const titlebarContainer = document.getElementById("place-titlebar");
    const titlebarName = titlebarContainer?.querySelector("#titlebar-name");

    if (!titlebarName) {
        return;
    }

    const customTitle = titlebarContainer?.dataset.title?.trim();
    const resolvedTitle = customTitle || document.title?.trim() || "kao(dot)net";

    titlebarName.textContent = resolvedTitle;
}

loadScript("./js/time.js")
    .then(() => {
        // fetch("./components/top_bar.html")
        //     .then(response => {
        //         console.log(response.status);
        //         return response.text();
        //     })
        //     .then(data => {
        //         document.getElementById("place-titlebar").innerHTML = data;
        //         applyTitlebarTitle();
        //     })
        return Promise.all([
            fetch("./components/bot_bar.html")
                .then(response => {
                    console.log(response.status);
                    return response.text();
                })
                .then(data => {
                    document.getElementById("place-taskbar").innerHTML = data;
                })
        ]);
    })
    .then(() => {
        if (typeof window.initTaskbarClock === "function") {
            window.initTaskbarClock();
        }
    })
    .catch(error => {
        console.error(error);
    });