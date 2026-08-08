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
        if (anchor.dataset.intercepted === 'true') {
            return;
        }

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

        anchor.dataset.intercepted = 'true';
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
        if (el.dataset.intercepted === 'true') {
            return;
        }

        const value = el.getAttribute('ondblclick');
        if (!value) {
            return;
        }

        const match = value.match(/window\.location\s*=\s*['"](.+?)['"]/);
        if (!match) {
            return;
        }

        const targetUrl = getInternalUrl(match[1]);
        if (!targetUrl) {
            return;
        }

        el.dataset.intercepted = 'true';
        el.ondblclick = () => {
            navigateTo(targetUrl.href);
        };
    });
}

function isPersistentPlaceholder(node) {
    if (node.nodeType !== Node.ELEMENT_NODE) {
        return false;
    }

    return node.hasAttribute('data-persistent') ||
        ['place-titlebar', 'place-taskbar'].includes(node.id);
}

function swapMainContent(newDoc) {
    const newMain = newDoc.querySelector('main');
    const currentMain = document.querySelector('main');

    if (!newMain || !currentMain) {
        return;
    }

    Array.from(currentMain.childNodes).forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
            node.remove();
            return;
        }

        if (node.nodeType === Node.ELEMENT_NODE && isPersistentPlaceholder(node)) {
            return;
        }

        node.remove();
    });

    Array.from(newMain.childNodes).forEach(node => {
        if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) {
            return;
        }

        if (node.nodeType === Node.ELEMENT_NODE && isPersistentPlaceholder(node)) {
            return;
        }

        currentMain.appendChild(node.cloneNode(true));
    });

    // Récupère les classes du <body> de la nouvelle page
    document.body.className = newDoc.body.className;

    // Récupère les classes du <html> de la nouvelle page
    document.documentElement.className = newDoc.documentElement.className;
}

window.initLinkInterception = initLinkInterception;

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
            const contentRoot = document.querySelector('[data-page-content]') || document.querySelector('main');
            runInlineScripts(contentRoot);

            if (replaceState) {
                history.replaceState({ url: targetUrl.pathname }, document.title, targetUrl.pathname);
            } else {
                history.pushState({ url: targetUrl.pathname }, document.title, targetUrl.pathname);
            }

            initLinkInterception(document);

            const newScripts = Array.from(newDoc.querySelectorAll('script[src]')).map(script => script.getAttribute('src')).filter(Boolean);
            const scriptsToLoad = newScripts.filter(src => !document.querySelector(`script[src="${src}"]`));

            return Promise.all([
                ...scriptsToLoad.map(loadScript),
                window.loadSharedIncludes ? window.loadSharedIncludes(document, { forceRefresh: true }) : Promise.resolve()
            ]).then(() => {
                initLinkInterception(document);
                if (typeof window.initExplorerSelection === 'function') {
                    window.initExplorerSelection(contentRoot);
                }
                applyTitlebarTitle();
                window.scrollTo(0, 0);
            });
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
    ensurePageContentContainer(document);
    history.replaceState({ url: location.pathname }, document.title, location.pathname);
    initLinkInterception(document);
    applyTitlebarTitle();
});

loadScript("../js/time.js")
    .then(() => {
        if (typeof window.loadSharedIncludes === "function") {
            return window.loadSharedIncludes(document);
        }

        return Promise.resolve();
    })
    .then(() => {
        if (typeof window.initTaskbarClock === "function") {
            window.initTaskbarClock();
        }

        if (typeof window.initLinkInterception === "function") {
            window.initLinkInterception(document);
        }
    })
    .catch(error => {
        console.error(error);
    });
