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

function loadComponentIntoElement(element, url, onLoaded, options = {}) {
    const { forceRefresh = false } = options;

    if (!element) {
        return Promise.resolve();
    }

    if (!forceRefresh && (element.dataset.loaded === "true" || element.innerHTML.trim())) {
        if (typeof onLoaded === "function") {
            onLoaded(element);
        }
        return Promise.resolve();
    }

    return fetch(url, { credentials: "same-origin" })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch ${url}: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            element.innerHTML = data;
            element.dataset.loaded = "true";

            if (typeof onLoaded === "function") {
                onLoaded(element);
            }
        });
}

function loadSharedIncludes(root = document, options = {}) {
    const { forceRefresh = false } = options;
    const titlebar = root.getElementById("place-titlebar");
    const taskbar = root.getElementById("place-taskbar");
    const msn = root.getElementById("place-msn");

    const titlebarPromise = loadComponentIntoElement(titlebar, "./components/top_bar.html", () => {
        if (typeof window.applyTitlebarTitle === "function") {
            window.applyTitlebarTitle();
        }
    });

    const taskbarPromise = loadComponentIntoElement(taskbar, "./components/bot_bar.html");
    const msnPromise = loadComponentIntoElement(msn, "./components/msn.html", null, { forceRefresh });

    return Promise.all([titlebarPromise, taskbarPromise, msnPromise]);
}

window.loadSharedIncludes = loadSharedIncludes;