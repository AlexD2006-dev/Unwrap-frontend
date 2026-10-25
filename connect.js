const BACKEND_URL = "http://127.0.0.1:3000";

const spotifyLoginButton = document.querySelector(
    "#spotify-login-button",
);

const connectMessage = document.querySelector("#connect-message");

// Demo mode keeps the connection page usable without Spotify or the backend running.
const isDemoMode =
    new URLSearchParams(window.location.search).get("demo") === "true";

if (spotifyLoginButton) {
    spotifyLoginButton.addEventListener("click", () => {
        // Prevent repeated clicks from starting duplicate redirects.
        spotifyLoginButton.disabled = true;

        if (isDemoMode) {
            spotifyLoginButton.textContent = "Loading demo dashboard...";

            if (connectMessage) {
                connectMessage.textContent =
                    "Opening the dashboard with demo data...";
            }

            window.location.href = "dashboard.html?demo=true";
            return;
        }

        spotifyLoginButton.textContent = "Redirecting to Spotify...";

        if (connectMessage) {
            connectMessage.textContent =
                "Opening Spotify securely in a new step...";
        }

        window.location.href = `${BACKEND_URL}/auth/connect/spotify`;
    });
}