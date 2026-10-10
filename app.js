// Keeps the navigation decision separate from browser actions so it can be tested independently.
export function getPageForButton(buttonId) {
    if (buttonId === "login-button") {
        return "dashboard.html";
    } else if (buttonId === "about-button") {
        return "about.html";
    } else {
        return null;
    }
}

const loginButton = document.querySelector("#login-button");

function handleLoginClick() {
    console.log("Login button clicked");
    const page = getPageForButton("login-button");
    window.location.href = page;
}

const aboutButton = document.querySelector("#about-button");

function handleAboutClick() {
    console.log("About button clicked");
    const page = getPageForButton("about-button");
    window.location.href = page;
}

// Only attach listeners when the buttons exist, because tests import this file without loading the full HTML page.
if (loginButton) {
    loginButton.addEventListener("click", handleLoginClick);
}

if (aboutButton) {
    aboutButton.addEventListener("click", handleAboutClick);
}
