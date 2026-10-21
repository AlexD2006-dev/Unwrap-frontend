import { afterEach, describe, expect, it, vi } from "vitest";

function renderDashboardShell() {
    document.body.innerHTML = `
        <p id="total-time-value">Loading...</p>

        <ol id="top-artist-value">
            <li>Loading...</li>
        </ol>

        <ol id="top-track-value">
            <li>Loading...</li>
        </ol>
    `;
}

afterEach(() => {
    document.body.innerHTML = "";
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    vi.resetModules();
});

describe("dashboard statistics", () => {
    it("displays statistics returned by the backend", async () => {
        renderDashboardShell();

        const fetchMock = vi.fn((url) => {
            if (url.includes("/api/top-artists")) {
                return Promise.resolve({
                    ok: true,
                    json: async () => ({
                        topArtists: [
                            { artistName: "Artist One" },
                            { artistName: "Artist Two" },
                            { artistName: "Artist Three" },
                        ],
                    }),
                });
            }

            if (url.includes("/api/top-tracks")) {
                return Promise.resolve({
                    ok: true,
                    json: async () => ({
                        topTracks: [
                            {
                                trackName: "Song One",
                                artistNames: ["Artist One"],
                            },
                            {
                                trackName: "Song Two",
                                artistNames: ["Artist Two"],
                            },
                            {
                                trackName: "Song Three",
                                artistNames: ["Artist Three"],
                            },
                        ],
                    }),
                });
            }

            return Promise.resolve({
                ok: true,
                json: async () => ({
                    statistics: {
                        totalMs: 3720000,
                        totalTracks: 3,
                    },
                }),
            });
        });

        vi.stubGlobal("fetch", fetchMock);

        await import("../dashboard.js");

        await vi.waitFor(() => {
            expect(
                document.querySelector("#total-time-value").textContent,
            ).toBe("1h 2m");

            expect(
                [...document.querySelectorAll("#top-artist-value li")].map(
                    (item) => item.textContent,
                ),
            ).toEqual([
                "Artist One",
                "Artist Two",
                "Artist Three",
            ]);

            expect(
                [...document.querySelectorAll("#top-track-value li")].map(
                    (item) => item.textContent,
                ),
            ).toEqual([
                "Song One - Artist One",
                "Song Two - Artist Two",
                "Song Three - Artist Three",
            ]);
        });
    });

    it("shows honest empty states when no data exists", async () => {
        renderDashboardShell();

        const fetchMock = vi.fn((url) => {
            if (url.includes("/api/top-artists")) {
                return Promise.resolve({
                    ok: true,
                    json: async () => ({
                        topArtists: [],
                    }),
                });
            }

            if (url.includes("/api/top-tracks")) {
                return Promise.resolve({
                    ok: true,
                    json: async () => ({
                        topTracks: [],
                    }),
                });
            }

            return Promise.resolve({
                ok: true,
                json: async () => ({
                    statistics: {
                        totalMs: 0,
                        totalTracks: 0,
                    },
                }),
            });
        });

        vi.stubGlobal("fetch", fetchMock);

        await import("../dashboard.js");

        await vi.waitFor(() => {
            expect(
                document.querySelector("#total-time-value").textContent,
            ).toBe("0m");

            expect(
                document.querySelector("#top-artist-value").textContent,
            ).toContain("No artist data available yet.");

            expect(
                document.querySelector("#top-track-value").textContent,
            ).toContain("No track data available yet.");
        });
    });

    it("shows an error state when the backend request fails", async () => {
        renderDashboardShell();

        vi.spyOn(console, "error").mockImplementation(() => {});

        const fetchMock = vi.fn().mockResolvedValue({
            ok: false,
            status: 401,
            json: async () => ({
                message: "Unauthorized",
            }),
        });

        vi.stubGlobal("fetch", fetchMock);

        await import("../dashboard.js");

        await vi.waitFor(() => {
            expect(
                document.querySelector("#total-time-value").textContent,
            ).toBe("Unavailable");

            expect(
                document.querySelector("#top-artist-value").textContent,
            ).toContain("Statistics could not be loaded.");

            expect(
                document.querySelector("#top-track-value").textContent,
            ).toContain("Statistics could not be loaded.");
        });
    });
});