import { afterEach, describe, expect, test, vi } from "vitest";

function renderConnectPage() {
    document.body.innerHTML = `
        <button id="spotify-login-button">
            Continue with Spotify
        </button>
        <p id="connect-message"></p>
    `;
}

// Use a controlled browser-like page so redirects can be tested safely.
async function loadConnectPage(search = "") {
    renderConnectPage();

    const fakeWindow = {
        location: {
            search,
            href: "",
        },
    };

    vi.stubGlobal("window", fakeWindow);
    await import("../connect.js");

    return fakeWindow;
}

afterEach(() => {
    document.body.innerHTML = "";
    vi.unstubAllGlobals();
    vi.resetModules();
});

describe("Spotify connection page", () => {
    test("normal mode redirects to the backend Spotify route", async () => {
        const fakeWindow = await loadConnectPage("");

        document.querySelector("#spotify-login-button").click();

        expect(
            document.querySelector("#spotify-login-button").disabled,
        ).toBe(true);

        expect(
            document.querySelector("#spotify-login-button").textContent,
        ).toBe("Redirecting to Spotify...");

        expect(
            document.querySelector("#connect-message").textContent,
        ).toBe("Opening Spotify securely in a new step...");

        expect(fakeWindow.location.href).toBe(
            "http://127.0.0.1:3000/auth/connect/spotify",
        );
    });

    test("demo mode redirects to the dashboard with demo data", async () => {
        const fakeWindow = await loadConnectPage("?demo=true");

        document.querySelector("#spotify-login-button").click();

        expect(
            document.querySelector("#spotify-login-button").disabled,
        ).toBe(true);

        expect(
            document.querySelector("#spotify-login-button").textContent,
        ).toBe("Loading demo dashboard...");

        expect(
            document.querySelector("#connect-message").textContent,
        ).toBe("Opening the dashboard with demo data...");

        expect(fakeWindow.location.href).toBe(
            "dashboard.html?demo=true",
        );
    });
});