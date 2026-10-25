import { loginUser, registerUser } from "./api.js";

const registerForm = document.querySelector("#register-form");
const loginForm = document.querySelector("#login-form");

const registerMessage = document.querySelector("#register-message");
const loginMessage = document.querySelector("#login-message");

function showMessage(element, message, isError = false) {
    element.textContent = message;
    element.setAttribute("data-error", String(isError));
}

// Keep demo mode in the URL so demo users can complete the same flow without backend authentication.
function getConnectPageUrl() {
    const isDemoMode =
        new URLSearchParams(window.location.search).get("demo") === "true";

    return isDemoMode ? "connect.html?demo=true" : "connect.html";
}

if (registerForm) {
    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = new FormData(registerForm);

        const email = formData.get("email");
        const displayName = formData.get("displayName");
        const password = formData.get("password");

        showMessage(registerMessage, "Creating account...");

        try {
            await registerUser({
                email,
                displayName,
                password,
            });
        } catch (error) {
            showMessage(registerMessage, error.message, true);
            return;
        }

        showMessage(registerMessage, "Account created. Logging you in...");

        // Registration creates the account; a separate login establishes the session used by the next page.
        try {
            await loginUser({
                email,
                password,
            });

            window.location.href = getConnectPageUrl();
        } catch (error) {
            showMessage(
                registerMessage,
                "Account created, but automatic login failed. Please log in manually.",
                true,
            );
        }
    });
}

if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = new FormData(loginForm);
        const email = formData.get("email");
        const password = formData.get("password");

        showMessage(loginMessage, "Logging in...");

        try {
            await loginUser({
                email,
                password,
            });

            window.location.href = getConnectPageUrl();
        } catch (error) {
            showMessage(loginMessage, error.message, true);
        }
    });
}