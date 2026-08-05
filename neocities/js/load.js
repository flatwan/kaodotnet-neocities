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

function getInternalUrl(url) {
    try {
        const parsed = new URL(url, location.href);

        if (parsed.origin !== location.origin) {
            return null;
        }

        if (parsed.pathname.match(/\.(css|js|png|jpe?g|gif|svg|ico|webp|mp4|mp3|wav|ogg|txt|pdf)$/i)) {
            return null;
        }

        return parsed;
    } catch (error) {
        return null;
    }
}

function isSamePage(url) {
    const parsed = new URL(url, location.href);
    return parsed.pathname === location.pathname && parsed.search === location.search;
}

function runInlineScripts(container) {
    container.querySelectorAll('script:not([src])').forEach(script => {
        const newScript = document.createElement('script');
        if (script.type) {
            newScript.type = script.type;
        }
        newScript.textContent = script.textContent;
        document.body.appendChild(newScript).remove();
    });
}

function initLinkInterception(root = document) {
    const anchors = root.querySelectorAll('a[href]');
    anchors.forEach(anchor => {
        const href = anchor.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
            return;
        }

        const targetUrl = getInternalUrl(href);
        if (!targetUrl) {
            return;
        }

        if (anchor.target && anchor.target !== '' && anchor.target !== '_self') {
            return;
        }

        anchor.addEventListener('click', event => {
            if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
                return;
            }
            event.preventDefault();
            navigateTo(targetUrl.href);
        });
    });

    const dblclickables = root.querySelectorAll('[ondblclick]');
    dblclickables.forEach(el => {
        const value = el.getAttribute('ondblclick');
        if (!value) {
            return;
        }

        const match = value.match(/window\.location\s*=\s*['\"](.+?)['\"]/);
        if (!match) {
            return;
        }

        const targetUrl = getInternalUrl(match[1]);
        if (!targetUrl) {
            return;
        }

        el.ondblclick = () => {
            navigateTo(targetUrl.href);
        };
    });
}

function swapMainContent(newDoc) {
    const newMain = newDoc.querySelector('main');
    const currentMain = document.querySelector('main');

    if (!newMain || !currentMain) {
        return;
    }

    currentMain.innerHTML = newMain.innerHTML;
    document.body.className = newDoc.body.className;
}

function navigateTo(url, replaceState = false) {
    const targetUrl = getInternalUrl(url);
    if (!targetUrl) {
        window.location.href = url;
        return Promise.resolve();
    }

    if (!replaceState && isSamePage(targetUrl.href)) {
        return Promise.resolve();
    }

    return fetch(targetUrl.href, { credentials: 'same-origin' })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch ${targetUrl.href}: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            const parser = new DOMParser();
            const newDoc = parser.parseFromString(html, 'text/html');
            const newTitle = newDoc.querySelector('title')?.textContent;

            if (newTitle) {
                document.title = newTitle;
            }

            swapMainContent(newDoc);
            runInlineScripts(document.querySelector('main'));
            initLinkInterception(document.querySelector('main'));
            if (typeof window.initExplorerSelection === 'function') {
                window.initExplorerSelection(document.querySelector('main'));
            }
            applyTitlebarTitle();
            window.scrollTo(0, 0);

            const newScripts = Array.from(newDoc.querySelectorAll('script[src]')).map(script => script.getAttribute('src')).filter(Boolean);
            const scriptsToLoad = newScripts.filter(src => !document.querySelector(`script[src="${src}"]`));
            return Promise.all(scriptsToLoad.map(loadScript));
        })
        .then(() => {
            if (replaceState) {
                history.replaceState({ url: targetUrl.pathname }, document.title, targetUrl.pathname);
            } else {
                history.pushState({ url: targetUrl.pathname }, document.title, targetUrl.pathname);
            }
        })
        .catch(error => {
            console.error(error);
            window.location.href = url;
        });
}

window.addEventListener('popstate', event => {
    const url = event.state?.url || location.pathname;
    navigateTo(url, true);
});

window.addEventListener('DOMContentLoaded', () => {
    history.replaceState({ url: location.pathname }, document.title, location.pathname);
    initLinkInterception(document);
    applyTitlebarTitle();
});

loadScript("./js/time.js")
    .then(() => {
        const titlebarPromise = fetch("./components/top_bar.html")
            .then(response => {
                console.log(response.status);
                return response.text();
            })
            .then(data => {
                const titlebar = document.getElementById("place-titlebar");
                if (titlebar) {
                    titlebar.innerHTML = data;
                    applyTitlebarTitle();
                    initLinkInterception(titlebar);
                }
            });

        const taskbarPromise = fetch("./components/bot_bar.html")
            .then(response => {
                console.log(response.status);
                return response.text();
            })
            .then(data => {
                const taskbar = document.getElementById("place-taskbar");
                if (taskbar) {
                    taskbar.innerHTML = data;
                    initLinkInterception(taskbar);
                }
            });

        return Promise.all([titlebarPromise, taskbarPromise]);
    })
    .then(() => {
        if (typeof window.initTaskbarClock === "function") {
            window.initTaskbarClock();
        }
    })
    .catch(error => {
        console.error(error);
    });
