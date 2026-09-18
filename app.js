export function getPageForButton(buttonId) {
    if (buttonId === "login-button") {
        return "dashboard.html";
    } else if (buttonId === "about-button") {
        return "about.html"
    } else {
        return null;
    }
}

// This finds the login button
const loginButton = document.querySelector("#login-button");
// This function runs when the Log in button is clicked.
function handleLoginClick() {
    console.log("Login button clicked");
    const page = getPageForButton("login-button");
    window.location.href = page;
}

if (loginButton) {
    loginButton.addEventListener("click", handleLoginClick);
}


// This finds the about button
const aboutButton = document.querySelector("#about-button");
function handleAboutClick() {
    console.log("About button clicked");
    const page = getPageForButton("about-button");
    window.location.href = page;
}

if (aboutButton) {
    aboutButton.addEventListener("click", handleAboutClick);
}

