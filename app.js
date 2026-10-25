// Keeps the navigation decision separate from browser actions so it can be tested independently.
export function getPageForButton(buttonId) {
    if (buttonId === "login-button") {
        return "auth.html";
    } else if (buttonId === "about-button") {
        return "about.html";
    } else {
        return null;
    }
}

// Preserve demo mode while moving between frontend pages.
function getPageUrl(page) {
    const isDemoMode =
        new URLSearchParams(window.location.search).get("demo") === "true";

    return isDemoMode ? `${page}?demo=true` : page;
}

const loginButton = document.querySelector("#login-button");

function handleLoginClick() {
    const page = getPageForButton("login-button");
    window.location.href = getPageUrl(page);
}

const aboutButton = document.querySelector("#about-button");

function handleAboutClick() {
    const page = getPageForButton("about-button");
    window.location.href = getPageUrl(page);
}

// Only attach listeners when the buttons exist, because tests import this file without loading the full HTML page.
if (loginButton) {
    loginButton.addEventListener("click", handleLoginClick);
}

if (aboutButton) {
    aboutButton.addEventListener("click", handleAboutClick);
}