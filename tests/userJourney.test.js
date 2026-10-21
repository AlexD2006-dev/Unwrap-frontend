import {
    afterEach,
    describe,
    expect,
    test,
    vi,
} from "vitest";

const mocks = vi.hoisted(() => ({
    loginUser: vi.fn(),
    registerUser: vi.fn(),
    getTopArtists: vi.fn(),
    getTopTracks: vi.fn(),
    getTimeListened: vi.fn(),
}));

vi.mock("../api.js", () => mocks);

const authPageMarkup = `
    <form id="login-form">
        <input name="email">
        <input name="password">
        <p id="login-message"></p>
    </form>

    <form id="register-form">
        <input name="email">
        <input name="displayName">
        <input name="password">
        <p id="register-message"></p>
    </form>
`;

async function waitForAsyncWork() {
    await new Promise((resolve) => setTimeout(resolve, 0));
}

describe("critical user journey", () => {
    afterEach(() => {
        vi.unstubAllGlobals();
        document.body.innerHTML = "";
    });

    test("logs in, starts Spotify connection, and renders dashboard statistics", async () => {
        mocks.loginUser.mockResolvedValueOnce({});

        mocks.getTopArtists.mockResolvedValueOnce({
            topArtists: [
                {
                    artistName: "Taylor Swift",
                },
            ],
        });

        mocks.getTopTracks.mockResolvedValueOnce({
            topTracks: [
                {
                    trackName: "Cruel Summer",
                    artistNames: ["Taylor Swift"],
                },
            ],
        });

        mocks.getTimeListened.mockResolvedValueOnce({
            statistics: {
                totalMs: 6840000,
            },
        });

        const fakeWindow = {
            location: {
                href: "",
            },
        };

        vi.stubGlobal("window", fakeWindow);

        document.body.innerHTML = authPageMarkup;
        await import("../auth.js");

        document.querySelector("#login-form [name='email']").value =
            "user@example.com";
        document.querySelector("#login-form [name='password']").value =
            "correct-password";

        document.querySelector("#login-form").dispatchEvent(
            new Event("submit", {
                bubbles: true,
                cancelable: true,
            }),
        );

        await waitForAsyncWork();

        expect(mocks.loginUser).toHaveBeenCalledWith({
            email: "user@example.com",
            password: "correct-password",
        });
        expect(fakeWindow.location.href).toBe("connect.html");

        document.body.innerHTML = `
            <button id="spotify-login-button">
                Continue with Spotify
            </button>
            <p id="connect-message"></p>
        `;

        await import("../connect.js");

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

        document.body.innerHTML = `
            <ul id="top-artist-value"></ul>
            <ul id="top-track-value"></ul>
            <p id="total-time-value"></p>
        `;

        await import("../dashboard.js");
        await waitForAsyncWork();

        expect(mocks.getTopArtists).toHaveBeenCalledWith(3);
        expect(mocks.getTopTracks).toHaveBeenCalledWith(3);
        expect(mocks.getTimeListened).toHaveBeenCalled();

        expect(
            document.querySelector("#top-artist-value").textContent,
        ).toContain("Taylor Swift");
        expect(
            document.querySelector("#top-track-value").textContent,
        ).toContain("Cruel Summer - Taylor Swift");
        expect(
            document.querySelector("#total-time-value").textContent,
        ).toBe("1h 54m");
    });
});